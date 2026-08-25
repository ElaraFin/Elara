from app.wealthapi.schemas import ElaraMappedAsset, WealthAssetMarketValue


def parse_number(value: str | int | float | None) -> float:
    if value is None or value == "":
        return 0.0

    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def map_asset_type(asset_type: str | None) -> str:
    match asset_type:
        case "ETF" | "FUND":
            return "etf"
        case "STOCK":
            return "stock"
        case "BOND":
            return "bond"
        case "CASH":
            return "cash"
        case "PRECIOUS_METAL" | "MATERIAL_ASSET":
            return "physical_asset"
        case "CERTIFICATE_OS" | "FOREIGN_CURRENCY" | "MANAGED":
            return "other"
        case _:
            return "other"


def get_display_name(asset: WealthAssetMarketValue) -> str:
    if asset.emitter and asset.isin:
        return f"{asset.emitter} ({asset.isin})"

    if asset.emitter:
        return asset.emitter

    return asset.isin or "Unknown WealthAPI asset"


def get_quantity(asset: WealthAssetMarketValue) -> float:
    return parse_number(asset.number_of_lots or asset.total_no_of_lots)


def map_wealth_asset_to_elara(
    asset: WealthAssetMarketValue,
    provider: str,
) -> ElaraMappedAsset:
    return ElaraMappedAsset(
        name=get_display_name(asset),
        asset_type=map_asset_type(asset.asset_type),
        quantity=get_quantity(asset),
        current_value=parse_number(asset.market_value),
        currency="EUR",
        source="wealth_api",
        provider=provider,
        external_id=asset.isin,
        raw_payload={
            "asset_type": asset.asset_type,
            "isin": asset.isin,
            "emitter": asset.emitter,
            "latest_quote": asset.latest_quote,
            "market_value": asset.market_value,
            "number_of_lots": asset.number_of_lots,
            "total_no_of_lots": asset.total_no_of_lots,
        },
    )
