import type { User } from "@supabase/supabase-js";

import {
  mapBackendAssetToSupabaseInput,
  previewBackendMockWealthAssets,
} from "../elara-backend";
import type { ElaraAsset } from "../portfolio-store";
import {
  deleteSupabaseAssetsBySource,
  replaceSupabaseAssetsBySource,
  type SupabaseAssetInput,
} from "../supabase-assets";

import { getAssetMarketValues } from "./wealth-client";
import { mapWealthAssetToElaraAsset } from "./wealth-mapper";
import type {
  WealthAssetMarketValue,
  WealthAssetsTotalMarketValue,
} from "./wealth-types";

export type WealthSyncedAsset = SupabaseAssetInput;

export type WealthSyncResult = {
  provider: string;
  reportDate?: string;
  totalMarketValue?: number;
  rawAssets: WealthAssetMarketValue[];
  mappedAssets: WealthSyncedAsset[];
};

export type WealthPersistedSyncResult = WealthSyncResult & {
  savedAssets: ElaraAsset[];
};

function parseNumber(value: string | null | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return parsed;
}

function getLatestReport(
  report: WealthAssetsTotalMarketValue | WealthAssetsTotalMarketValue[]
): WealthAssetsTotalMarketValue {
  if (Array.isArray(report)) {
    return report[0];
  }

  return report;
}

function buildRawPayload(asset: WealthAssetMarketValue): Record<string, unknown> {
  return {
    asset_type: asset.asset_type,
    isin: asset.isin,
    emitter: asset.emitter,
    latest_quote: asset.latest_quote,
    market_value: asset.market_value,
    number_of_lots: asset.number_of_lots,
    total_no_of_lots: asset.total_no_of_lots,
  };
}

function mapWealthAssetForSupabase(
  asset: WealthAssetMarketValue,
  provider: string
): WealthSyncedAsset {
  return {
    ...mapWealthAssetToElaraAsset(asset, provider),
    source: "wealth_api",
    external_id: asset.isin,
    raw_payload: buildRawPayload(asset),
  };
}

function mapWealthAssetsForSupabase(
  assets: WealthAssetMarketValue[],
  provider: string
): WealthSyncedAsset[] {
  return assets.map((asset) => mapWealthAssetForSupabase(asset, provider));
}

export async function prepareWealthPortfolioSync(
  provider = "wealthAPI"
): Promise<WealthSyncResult> {
  const wealthReport = await getAssetMarketValues();

  const latestReport = getLatestReport(wealthReport);
  const rawAssets = latestReport.assets ?? [];
  const mappedAssets = mapWealthAssetsForSupabase(rawAssets, provider);

  return {
    provider,
    reportDate: latestReport.date,
    totalMarketValue: parseNumber(latestReport.total_market_value),
    rawAssets,
    mappedAssets,
  };
}

export function prepareMockWealthPortfolioSync(
  provider = "wealthAPI"
): WealthSyncResult {
  const mockReport: WealthAssetsTotalMarketValue = {
    asset_types: ["ETF", "STOCK", "CASH"],
    date: new Date().toISOString(),
    total_market_value: "18450.75",
    assets: [
      {
        asset_type: "ETF",
        isin: "IE00BK5BQT80",
        emitter: "Vanguard",
        latest_quote: "156.25",
        market_value: "12500.50",
        number_of_lots: "80",
        total_no_of_lots: "80",
      },
      {
        asset_type: "STOCK",
        isin: "US0378331005",
        emitter: "Apple Inc.",
        latest_quote: "350.02",
        market_value: "4200.25",
        number_of_lots: "12",
        total_no_of_lots: "12",
      },
      {
        asset_type: "CASH",
        isin: "CASH_EUR",
        emitter: "Cash balance",
        latest_quote: "1",
        market_value: "1750.00",
        number_of_lots: "1",
        total_no_of_lots: "1",
      },
    ],
  };

  const mappedAssets = mapWealthAssetsForSupabase(mockReport.assets, provider);

  return {
    provider,
    reportDate: mockReport.date,
    totalMarketValue: parseNumber(mockReport.total_market_value),
    rawAssets: mockReport.assets,
    mappedAssets,
  };
}

export async function prepareBackendMockWealthPortfolioSync(
  provider = "Mock Brokerage"
): Promise<WealthSyncResult> {
  const preview = await previewBackendMockWealthAssets(provider);

  const mappedAssets = preview.mapped_assets.map(
    mapBackendAssetToSupabaseInput
  );

  return {
    provider: preview.provider,
    reportDate: preview.report_date ?? undefined,
    totalMarketValue: preview.total_market_value ?? undefined,
    rawAssets: preview.raw_assets,
    mappedAssets,
  };
}

export async function syncWealthPortfolioToSupabase(
  user: User,
  provider = "wealthAPI"
): Promise<WealthPersistedSyncResult> {
  const result = await prepareWealthPortfolioSync(provider);

  const savedAssets = await replaceSupabaseAssetsBySource(
    user,
    "wealth_api",
    result.mappedAssets
  );

  return {
    ...result,
    savedAssets,
  };
}

export async function syncMockWealthPortfolioToSupabase(
  user: User,
  provider = "Mock Brokerage"
): Promise<WealthPersistedSyncResult> {
  const result = await prepareBackendMockWealthPortfolioSync(provider);

  const savedAssets = await replaceSupabaseAssetsBySource(
    user,
    "wealth_api",
    result.mappedAssets
  );

  return {
    ...result,
    savedAssets,
  };
}

export async function removeWealthPortfolioFromSupabase(user: User) {
  await deleteSupabaseAssetsBySource(user, "wealth_api");
}
