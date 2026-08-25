from fastapi import APIRouter, HTTPException

from app.wealthapi.client import WealthApiError, get_assets_market_value_report
from app.wealthapi.mapper import map_wealth_asset_to_elara, parse_number
from app.wealthapi.schemas import (
    WealthAssetMarketValue,
    WealthAssetPreviewRequest,
    WealthAssetPreviewResponse,
    WealthAssetsTotalMarketValue,
)

router = APIRouter(prefix="/wealthapi", tags=["WealthAPI"])


def build_preview_response(
    report: WealthAssetsTotalMarketValue,
    provider: str,
) -> WealthAssetPreviewResponse:
    return WealthAssetPreviewResponse(
        provider=provider,
        report_date=report.date,
        total_market_value=parse_number(report.total_market_value),
        raw_assets=report.assets,
        mapped_assets=[
            map_wealth_asset_to_elara(asset, provider)
            for asset in report.assets
        ],
    )


@router.post("/assets/preview/mock", response_model=WealthAssetPreviewResponse)
async def preview_mock_assets(
    request: WealthAssetPreviewRequest,
) -> WealthAssetPreviewResponse:
    report = WealthAssetsTotalMarketValue(
        asset_types=["ETF", "STOCK", "CASH"],
        date="2026-08-25",
        total_market_value="18450.75",
        assets=[
            WealthAssetMarketValue(
                asset_type="ETF",
                isin="IE00BK5BQT80",
                emitter="Vanguard",
                latest_quote="156.25",
                market_value="12500.50",
                number_of_lots="80",
                total_no_of_lots="80",
            ),
            WealthAssetMarketValue(
                asset_type="STOCK",
                isin="US0378331005",
                emitter="Apple Inc.",
                latest_quote="350.02",
                market_value="4200.25",
                number_of_lots="12",
                total_no_of_lots="12",
            ),
            WealthAssetMarketValue(
                asset_type="CASH",
                isin="CASH_EUR",
                emitter="Cash balance",
                latest_quote="1",
                market_value="1750.00",
                number_of_lots="1",
                total_no_of_lots="1",
            ),
        ],
    )

    return build_preview_response(report, request.provider or "Mock Brokerage")


@router.post("/assets/preview", response_model=WealthAssetPreviewResponse)
async def preview_real_assets(
    request: WealthAssetPreviewRequest,
) -> WealthAssetPreviewResponse:
    try:
        report = await get_assets_market_value_report(request)
        return build_preview_response(report, request.provider)
    except WealthApiError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
