import type { User } from "@supabase/supabase-js";

import {
  mapBackendAssetToSupabaseInput,
  previewBackendMockWealthAssets,
  previewBackendRealWealthAssets,
} from "../elara-backend";
import type { ElaraAsset } from "../portfolio-store";
import {
  deleteSupabaseAssetsBySource,
  replaceSupabaseAssetsBySource,
  type SupabaseAssetInput,
} from "../supabase-assets";

import type { WealthAssetMarketValue } from "./wealth-types";

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

async function prepareBackendWealthPortfolioSync(
  provider: string,
  mode: "mock" | "real"
): Promise<WealthSyncResult> {
  const preview =
    mode === "mock"
      ? await previewBackendMockWealthAssets(provider)
      : await previewBackendRealWealthAssets(provider);

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

/**
 * Sync reale WealthAPI.
 *
 * Expo non chiama più WealthAPI direttamente.
 * Expo chiama il backend FastAPI, e il backend chiamerà WealthAPI sandbox/prod.
 */
export async function prepareWealthPortfolioSync(
  provider = "wealthAPI"
): Promise<WealthSyncResult> {
  return prepareBackendWealthPortfolioSync(provider, "real");
}

/**
 * Sync mock WealthAPI via backend.
 *
 * Questo è quello usato ora dalla UI.
 */
export async function prepareMockWealthPortfolioSync(
  provider = "Mock Brokerage"
): Promise<WealthSyncResult> {
  return prepareBackendWealthPortfolioSync(provider, "mock");
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
  const result = await prepareMockWealthPortfolioSync(provider);

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
