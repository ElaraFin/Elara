import type { ElaraAsset } from "./portfolio-store";

export type PortfolioInsight = {
  currentState: string;
  risks: string;
  possibleActions: string;
};

function formatPercentage(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function generatePortfolioInsight(
  assets: ElaraAsset[],
  totalNetWorth: number
): PortfolioInsight {
  if (assets.length === 0 || totalNetWorth <= 0) {
    return {
      currentState:
        "Your portfolio is empty. Elara needs at least one asset to build a meaningful wealth overview.",
      risks:
        "No concentration, allocation or source risk can be assessed until assets are added.",
      possibleActions:
        "Add your first asset manually or connect a broker source to start building your portfolio analysis.",
    };
  }

  const sortedAssets = [...assets].sort(
    (a, b) => b.current_value - a.current_value
  );

  const largestAsset = sortedAssets[0];
  const largestAssetWeight = largestAsset.current_value / totalNetWorth;

  const manualAssets = assets.filter((asset) => asset.source === "manual");
  const brokerAssets = assets.filter((asset) => asset.source === "wealth_api");

  const assetTypes = new Set(assets.map((asset) => asset.asset_type));
  const hasBrokerSync = brokerAssets.length > 0;
  const hasManualAssets = manualAssets.length > 0;

  const currentState = `Your portfolio contains ${
    assets.length
  } assets across ${assetTypes.size} asset ${
    assetTypes.size === 1 ? "class" : "classes"
  }. The largest position is ${largestAsset.name}, representing ${formatPercentage(
    largestAssetWeight
  )} of total wealth.`;

  let risks =
    "No major imbalance is visible from the current simplified analysis.";

  if (largestAssetWeight >= 0.5) {
    risks = `${largestAsset.name} represents ${formatPercentage(
      largestAssetWeight
    )} of the portfolio. This creates concentration risk if that asset moves significantly.`;
  } else if (assetTypes.size <= 1) {
    risks =
      "The portfolio is currently concentrated in a single asset class. This may reduce diversification.";
  } else if (!hasBrokerSync && hasManualAssets) {
    risks =
      "The portfolio is based only on manual input. Values may become outdated unless they are updated regularly.";
  }

  let possibleActions =
    "Review the current allocation and compare it with your target risk profile before making changes.";

  if (!hasBrokerSync) {
    possibleActions =
      "Connect a broker source or import statements to reduce manual maintenance and improve portfolio accuracy.";
  } else if (largestAssetWeight >= 0.5) {
    possibleActions =
      "Simulate how the portfolio would look with a lower exposure to the largest position. This is not a recommendation, only a scenario to evaluate concentration.";
  } else if (assetTypes.size <= 2) {
    possibleActions =
      "Explore alternative allocations across more asset classes and compare expected risk and diversification.";
  }

  return {
    currentState,
    risks,
    possibleActions,
  };
}
