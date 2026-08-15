import { AssetType, ElaraAsset } from "./portfolio-store";

export type AssetAllocation = {
  type: AssetType;
  label: string;
  value: number;
  weight: number;
};

export type PortfolioAnalytics = {
  totalNetWorth: number;
  assetCount: number;
  assetClassCount: number;
  allocation: AssetAllocation[];
  largestAssetName: string | null;
  largestAssetWeight: number;
  cashWeight: number;
  cryptoWeight: number;
  weightedRiskScore: number;
  diversificationScore: number;
  concentrationScore: number;
  liquidityScore: number;
  healthScore: number;
  mainRisks: string[];
};

const assetLabels: Record<AssetType, string> = {
  cash: "Cash",
  etf: "ETF",
  stock: "Stocks",
  crypto: "Crypto",
  bond: "Bonds",
  real_estate: "Real estate",
  physical_asset: "Physical assets",
  other: "Other",
};

const assetRiskScores: Record<AssetType, number> = {
  cash: 1,
  bond: 3,
  etf: 5,
  stock: 7,
  real_estate: 6,
  physical_asset: 6,
  crypto: 10,
  other: 6,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function getLiquidityScore(cashWeight: number) {
  if (cashWeight <= 0) {
    return 20;
  }

  if (cashWeight < 0.03) {
    return 40;
  }

  if (cashWeight <= 0.2) {
    return 90;
  }

  if (cashWeight <= 0.35) {
    return 72;
  }

  return 52;
}

function buildMainRisks(params: {
  totalNetWorth: number;
  largestAssetName: string | null;
  largestAssetWeight: number;
  cashWeight: number;
  cryptoWeight: number;
  assetClassCount: number;
}) {
  const risks: string[] = [];

  if (params.totalNetWorth <= 0) {
    return ["No portfolio data available yet."];
  }

  if (params.largestAssetWeight > 0.4 && params.largestAssetName) {
    risks.push(
      `High concentration in ${params.largestAssetName}: ${Math.round(
        params.largestAssetWeight * 100
      )}% of the portfolio.`
    );
  }

  if (params.cryptoWeight > 0.15) {
    risks.push(
      `Crypto exposure is elevated: ${Math.round(
        params.cryptoWeight * 100
      )}% of the portfolio.`
    );
  }

  if (params.cashWeight < 0.03) {
    risks.push("Liquidity buffer appears low relative to total wealth.");
  }

  if (params.cashWeight > 0.35) {
    risks.push("Cash allocation is high and may reduce long-term efficiency.");
  }

  if (params.assetClassCount <= 2) {
    risks.push("Portfolio diversification across asset classes is limited.");
  }

  if (risks.length === 0) {
    risks.push("No major imbalance detected from the current data.");
  }

  return risks;
}

export function calculatePortfolioAnalytics(
  assets: ElaraAsset[]
): PortfolioAnalytics {
  const totalNetWorth = assets.reduce(
    (sum, asset) => sum + asset.current_value,
    0
  );

  const groupedByType = assets.reduce<Record<AssetType, number>>(
    (acc, asset) => {
      acc[asset.asset_type] =
        (acc[asset.asset_type] ?? 0) + asset.current_value;
      return acc;
    },
    {} as Record<AssetType, number>
  );

  const allocation = Object.entries(groupedByType)
    .map(([type, value]) => ({
      type: type as AssetType,
      label: assetLabels[type as AssetType],
      value,
      weight: totalNetWorth > 0 ? value / totalNetWorth : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const sortedAssets = [...assets].sort(
    (a, b) => b.current_value - a.current_value
  );

  const largestAsset = sortedAssets[0] ?? null;
  const largestAssetWeight =
    largestAsset && totalNetWorth > 0
      ? largestAsset.current_value / totalNetWorth
      : 0;

  const cashValue = groupedByType.cash ?? 0;
  const cryptoValue = groupedByType.crypto ?? 0;

  const cashWeight = totalNetWorth > 0 ? cashValue / totalNetWorth : 0;
  const cryptoWeight = totalNetWorth > 0 ? cryptoValue / totalNetWorth : 0;

  const weightedRiskScore =
    totalNetWorth > 0
      ? assets.reduce((sum, asset) => {
          const risk = assetRiskScores[asset.asset_type] ?? 6;
          return sum + risk * (asset.current_value / totalNetWorth);
        }, 0)
      : 0;

  const assetClassCount = allocation.length;

  const diversificationScore =
    totalNetWorth > 0
      ? clamp(35 + assetClassCount * 12 + Math.min(assets.length, 8) * 3, 0, 100)
      : 0;

  const concentrationScore =
    totalNetWorth > 0 ? clamp(100 - largestAssetWeight * 120, 0, 100) : 0;

  const liquidityScore =
    totalNetWorth > 0 ? getLiquidityScore(cashWeight) : 0;

  const riskBalanceScore =
    totalNetWorth > 0
      ? clamp(100 - Math.abs(weightedRiskScore - 5.5) * 12, 0, 100)
      : 0;

  const healthScore =
    totalNetWorth > 0
      ? Math.round(
          diversificationScore * 0.28 +
            concentrationScore * 0.32 +
            liquidityScore * 0.2 +
            riskBalanceScore * 0.2
        )
      : 0;

  const mainRisks = buildMainRisks({
    totalNetWorth,
    largestAssetName: largestAsset?.name ?? null,
    largestAssetWeight,
    cashWeight,
    cryptoWeight,
    assetClassCount,
  });

  return {
    totalNetWorth,
    assetCount: assets.length,
    assetClassCount,
    allocation,
    largestAssetName: largestAsset?.name ?? null,
    largestAssetWeight: round(largestAssetWeight),
    cashWeight: round(cashWeight),
    cryptoWeight: round(cryptoWeight),
    weightedRiskScore: round(weightedRiskScore, 1),
    diversificationScore: Math.round(diversificationScore),
    concentrationScore: Math.round(concentrationScore),
    liquidityScore: Math.round(liquidityScore),
    healthScore,
    mainRisks,
  };
}