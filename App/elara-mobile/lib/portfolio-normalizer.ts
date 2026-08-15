import { AssetType, Currency, ElaraAsset } from "./portfolio-store";

export type NormalizedAsset = {
  id: string;
  name: string;
  asset_type: AssetType;
  value: number;
  weight: number;
  currency: Currency;
  source: "manual" | "pdf" | "wealth_api";
  provider: string;
  quantity: number | null;
  created_at: string;
  updated_at: string;
};

export type NormalizedAllocationItem = {
  asset_type: AssetType;
  value: number;
  weight: number;
};

export type NormalizedPortfolio = {
  base_currency: Currency;
  total_net_worth: number;
  asset_count: number;
  asset_class_count: number;
  assets: NormalizedAsset[];
  allocation_by_asset_type: NormalizedAllocationItem[];
  data_sources: string[];
  last_updated_at: string | null;
};

function round(value: number, decimals = 4) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function getLatestUpdatedAt(assets: ElaraAsset[]) {
  if (assets.length === 0) {
    return null;
  }

  return assets
    .map((asset) => asset.updated_at)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
}

function getDataSources(assets: ElaraAsset[]) {
  const sources = assets.map((asset) => asset.source);
  return Array.from(new Set(sources));
}

export function normalizePortfolio(
  assets: ElaraAsset[],
  baseCurrency: Currency = "EUR"
): NormalizedPortfolio {
  const totalNetWorth = assets.reduce((sum, asset) => {
    return sum + asset.current_value;
  }, 0);

  const normalizedAssets: NormalizedAsset[] = assets.map((asset) => {
    const weight =
      totalNetWorth > 0 ? round(asset.current_value / totalNetWorth, 6) : 0;

    return {
      id: asset.id,
      name: asset.name,
      asset_type: asset.asset_type,
      value: asset.current_value,
      weight,
      currency: asset.currency,
      source: asset.source,
      provider: asset.provider ?? "Unknown provider",
      quantity: asset.quantity ?? null,
      created_at: asset.created_at,
      updated_at: asset.updated_at,
    };
  });

  const allocationMap = normalizedAssets.reduce<Record<string, number>>(
    (acc, asset) => {
      acc[asset.asset_type] = (acc[asset.asset_type] ?? 0) + asset.value;
      return acc;
    },
    {}
  );

  const allocationByAssetType: NormalizedAllocationItem[] = Object.entries(
    allocationMap
  )
    .map(([assetType, value]) => ({
      asset_type: assetType as AssetType,
      value,
      weight: totalNetWorth > 0 ? round(value / totalNetWorth, 6) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  return {
    base_currency: baseCurrency,
    total_net_worth: totalNetWorth,
    asset_count: normalizedAssets.length,
    asset_class_count: allocationByAssetType.length,
    assets: normalizedAssets,
    allocation_by_asset_type: allocationByAssetType,
    data_sources: getDataSources(assets),
    last_updated_at: getLatestUpdatedAt(assets),
  };
}