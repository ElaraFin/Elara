import type { AssetType, Currency } from "./portfolio-store";
import type { SupabaseAssetInput } from "./supabase-assets";
import type { WealthAssetMarketValue } from "./wealth-api/wealth-types";

const ELARA_BACKEND_URL = process.env.EXPO_PUBLIC_ELARA_BACKEND_URL;

export type BackendMappedAsset = {
  name: string;
  asset_type: string;
  quantity: number;
  current_value: number;
  currency: string;
  source: string;
  provider: string;
  external_id: string;
  raw_payload: Record<string, unknown>;
};

export type BackendWealthAssetPreviewResponse = {
  provider: string;
  report_date: string | null;
  total_market_value: number | null;
  raw_assets: WealthAssetMarketValue[];
  mapped_assets: BackendMappedAsset[];
};

export type BackendWealthApiStatus = {
  service: string;
  base_url: string;
  has_bearer_token: boolean;
  mode: "mock-only" | "sandbox-ready" | string;
  mock_preview_endpoint: string;
  real_preview_endpoint: string;
};

const VALID_ASSET_TYPES = new Set<AssetType>([
  "cash",
  "etf",
  "stock",
  "crypto",
  "bond",
  "real_estate",
  "physical_asset",
  "other",
]);

const VALID_CURRENCIES = new Set<Currency>(["EUR", "USD", "GBP", "CHF"]);

function getBackendBaseUrl() {
  if (!ELARA_BACKEND_URL) {
    throw new Error("Missing EXPO_PUBLIC_ELARA_BACKEND_URL in .env.local");
  }

  return ELARA_BACKEND_URL.replace(/\/$/, "");
}

function parseNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return parsed;
}

function mapAssetType(value: string): AssetType {
  if (VALID_ASSET_TYPES.has(value as AssetType)) {
    return value as AssetType;
  }

  return "other";
}

function mapCurrency(value: string): Currency {
  if (VALID_CURRENCIES.has(value as Currency)) {
    return value as Currency;
  }

  return "EUR";
}

async function backendRequest<T>(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${getBackendBaseUrl()}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Elara backend ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

export async function getBackendWealthApiStatus() {
  return backendRequest<BackendWealthApiStatus>("/wealthapi/status");
}

export async function previewBackendMockWealthAssets(
  provider = "Mock Brokerage"
) {
  return backendRequest<BackendWealthAssetPreviewResponse>(
    "/wealthapi/assets/preview/mock",
    {
      method: "POST",
      body: JSON.stringify({ provider }),
    }
  );
}

export async function previewBackendRealWealthAssets(provider = "wealthAPI") {
  return backendRequest<BackendWealthAssetPreviewResponse>(
    "/wealthapi/assets/preview",
    {
      method: "POST",
      body: JSON.stringify({
        provider,
        imported_from_bank: true,
      }),
    }
  );
}

export function mapBackendAssetToSupabaseInput(
  asset: BackendMappedAsset
): SupabaseAssetInput {
  return {
    name: asset.name,
    asset_type: mapAssetType(asset.asset_type),
    quantity: parseNumber(asset.quantity),
    current_value: parseNumber(asset.current_value),
    currency: mapCurrency(asset.currency),
    source: "wealth_api",
    provider: asset.provider,
    external_id: asset.external_id,
    raw_payload: asset.raw_payload,
  };
}
