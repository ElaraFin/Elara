import type {
  WealthAccount,
  WealthAssetsReport,
  WealthAssetsReportInitResponse,
  WealthAssetsTotalMarketValue,
  WealthAssetType,
  WealthConnection,
  WealthPortfolio,
} from "./wealth-types";

const DEFAULT_WEALTH_API_URL = "https://sandbox.wealthapi.eu";

const WEALTH_API_URL =
  process.env.EXPO_PUBLIC_WEALTH_API_URL ?? DEFAULT_WEALTH_API_URL;

const DEFAULT_REPORT_POLL_INTERVAL_MS = 1_500;
const DEFAULT_REPORT_MAX_ATTEMPTS = 20;

let accessToken: string | null = null;

type QueryParams = Record<string, string | number | boolean | undefined>;

type AssetMarketValueReportFilters = {
  mandatorSlug?: string;
  importedFromBank?: boolean;
  dates?: string[];
  assetTypes?: WealthAssetType[];
  isins?: string[];
  emitters?: string[];
};

type PollOptions = {
  pollIntervalMs?: number;
  maxAttempts?: number;
};

function buildUrl(endpoint: string, queryParams?: QueryParams) {
  const baseUrl = WEALTH_API_URL.replace(/\/$/, "");
  const url = new URL(`${baseUrl}${endpoint}`);

  Object.entries(queryParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

function authHeaders() {
  if (!accessToken) {
    throw new Error(
      "WealthAPI token missing. Set it with setWealthToken(token), or call this endpoint through the future FastAPI backend."
    );
  }

  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${accessToken}`,
  };
}

async function wealthRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  queryParams?: QueryParams
): Promise<T> {
  const response = await fetch(buildUrl(endpoint, queryParams), {
    ...options,
    headers: {
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(`WealthAPI ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeStatus(status: string | undefined) {
  return (status ?? "").toLowerCase();
}

function getReportFilters(filters?: AssetMarketValueReportFilters): QueryParams {
  return {
    "filter[mandator_slug]": filters?.mandatorSlug,
    "filter[imported_from_bank]": filters?.importedFromBank,
    "filter[dates]": filters?.dates?.join(","),
    "filter[asset_types]": filters?.assetTypes?.join(","),
    "filter[isins]": filters?.isins?.join(","),
    "filter[emitters]": filters?.emitters?.join(","),
  };
}

function getFirstReport(report: WealthAssetsReport) {
  const firstReport = report.data.reports?.[0];

  if (!firstReport) {
    throw new Error("WealthAPI asset report succeeded but returned no reports.");
  }

  return firstReport;
}

export function setWealthToken(token: string) {
  accessToken = token;
}

export function clearWealthToken() {
  accessToken = null;
}

/**
 * Lo Swagger caricato espone gli endpoint protetti da Bearer token,
 * ma non espone un endpoint login/refresh token verificabile.
 *
 * Per questo, per ora il token va passato con setWealthToken(token).
 * Nel backend FastAPI gestiremo login, refresh token e segreti in modo sicuro.
 */
export async function loginWealthAPI(_username: string, _password: string) {
  throw new Error(
    "loginWealthAPI is not implemented from swagger.yaml. Use setWealthToken(token) for sandbox tests, or move auth to the FastAPI backend."
  );
}

export async function startAssetMarketValueReport(
  filters?: AssetMarketValueReportFilters
): Promise<WealthAssetsReportInitResponse> {
  return wealthRequest<WealthAssetsReportInitResponse>(
    "/api/v3/reports/assets_market_value",
    {
      method: "POST",
    },
    getReportFilters(filters)
  );
}

export async function fetchAssetMarketValueReport(reportId: string) {
  return wealthRequest<WealthAssetsReport>(
    `/api/v3/reports/assets_market_value/${encodeURIComponent(reportId)}`,
    {
      method: "GET",
    }
  );
}

export async function waitForAssetMarketValueReport(
  reportId: string,
  options: PollOptions = {}
): Promise<WealthAssetsReport> {
  const pollIntervalMs =
    options.pollIntervalMs ?? DEFAULT_REPORT_POLL_INTERVAL_MS;

  const maxAttempts = options.maxAttempts ?? DEFAULT_REPORT_MAX_ATTEMPTS;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const report = await fetchAssetMarketValueReport(reportId);
    const status = normalizeStatus(report.data.status);

    if (status === "success") {
      return report;
    }

    if (status === "failed") {
      throw new Error(
        report.data.error ?? "WealthAPI asset report generation failed."
      );
    }

    if (attempt < maxAttempts) {
      await sleep(pollIntervalMs);
    }
  }

  throw new Error(
    `WealthAPI asset report did not complete after ${maxAttempts} attempts.`
  );
}

/**
 * Flow reale Swagger:
 * 1. POST /api/v3/reports/assets_market_value → report_id
 * 2. GET /api/v3/reports/assets_market_value/{report_id} finché status=success
 * 3. ritorna il primo report normalizzato per wealth-sync.ts
 */
export async function getAssetMarketValues(
  filters?: AssetMarketValueReportFilters,
  pollOptions?: PollOptions
): Promise<WealthAssetsTotalMarketValue> {
  const initResponse = await startAssetMarketValueReport(filters);

  const report = await waitForAssetMarketValueReport(
    initResponse.data.report_id,
    pollOptions
  );

  return getFirstReport(report);
}

/**
 * Lo Swagger richiede filter[id] per leggere bank connections in batch.
 * Questo non è ancora usato dalla UI, ma lo teniamo pronto per il backend.
 */
export async function getBankConnections(
  connectionIds: string[]
): Promise<WealthConnection[]> {
  if (connectionIds.length === 0) {
    throw new Error("getBankConnections requires at least one connection id.");
  }

  const response = await wealthRequest<{
    data: Array<{
      id: string;
      attributes?: {
        bank_name?: string;
      };
      meta?: {
        connection_status?: string;
        last_connection_attempt?: string;
      };
    }>;
  }>(
    "/api/v3/wealth_api/bank_connections",
    {
      method: "GET",
    },
    {
      "filter[id]": connectionIds.join(","),
    }
  );

  return response.data.map((connection) => ({
    id: connection.id,
    provider: connection.attributes?.bank_name,
    status: connection.meta?.connection_status,
    created_at: connection.meta?.last_connection_attempt,
    raw: connection,
  }));
}

/**
 * Nel nostro swagger.yaml non ci sono endpoint accounts / portfolios generici.
 * Li implementeremo solo se WealthAPI li conferma nella sandbox o nella doc auth.
 */
export async function getAccounts(): Promise<WealthAccount[]> {
  throw new Error("getAccounts is not available in the current swagger.yaml.");
}

export async function getPortfolios(): Promise<WealthPortfolio[]> {
  throw new Error("getPortfolios is not available in the current swagger.yaml.");
}
