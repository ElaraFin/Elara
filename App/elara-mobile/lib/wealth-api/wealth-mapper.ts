import type {
  AssetType,
  Currency,
  ElaraAsset,
} from "../portfolio-store";

import type {
  WealthAssetMarketValue,
  WealthAssetType,
} from "./wealth-types";



function mapWealthAssetType(
  type: WealthAssetType | null
): AssetType {

  switch (type) {

    case "ETF":
    case "FUND":
      return "etf";


    case "STOCK":
      return "stock";


    case "BOND":
      return "bond";


    case "CASH":
      return "cash";


    case "PRECIOUS_METAL":
    case "MATERIAL_ASSET":
      return "physical_asset";


    case "CERTIFICATE_OS":
    case "FOREIGN_CURRENCY":
    case "MANAGED":
      return "other";


    default:
      return "other";
  }
}



function parseNumber(
  value: string | null
): number {

  if (!value) {
    return 0;
  }


  const parsed =
    Number(value);


  if (Number.isNaN(parsed)) {
    return 0;
  }


  return parsed;
}



export function mapWealthAssetToElaraAsset(
  asset: WealthAssetMarketValue,
  provider = "wealthAPI"
): Omit<
  ElaraAsset,
  "id" | "created_at" | "updated_at"
> {

  return {

    name:
      asset.isin,


    asset_type:
      mapWealthAssetType(
        asset.asset_type
      ),


    quantity:
      parseNumber(
        asset.number_of_lots
      ),


    current_value:
      parseNumber(
        asset.market_value
      ),


    currency:
      "EUR" as Currency,


    source:
      "wealth_api",


    provider,
  };
}



export function mapWealthAssetsToElaraAssets(
  assets: WealthAssetMarketValue[],
  provider = "wealthAPI"
) {

  return assets.map(
    (asset) =>
      mapWealthAssetToElaraAsset(
        asset,
        provider
      )
  );

}