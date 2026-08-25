import asyncio
from urllib.parse import urljoin

import httpx

from app.core.config import get_settings
from app.wealthapi.schemas import (
    WealthAssetPreviewRequest,
    WealthAssetsReportInitResponse,
    WealthAssetsReportResponse,
    WealthAssetsTotalMarketValue,
)


class WealthApiError(Exception):
    pass


def get_headers() -> dict[str, str]:
    settings = get_settings()

    if not settings.wealth_api_bearer_token:
        raise WealthApiError(
            "Missing WEALTH_API_BEARER_TOKEN. Add it to Backend/.env when sandbox is active."
        )

    return {
        "Accept": "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        "Authorization": f"Bearer {settings.wealth_api_bearer_token}",
    }


def build_url(path: str) -> str:
    settings = get_settings()
    base_url = settings.wealth_api_base_url.rstrip("/") + "/"
    return urljoin(base_url, path.lstrip("/"))


def build_filters(request: WealthAssetPreviewRequest) -> dict[str, str | bool]:
    filters: dict[str, str | bool] = {}

    if request.mandator_slug:
        filters["filter[mandator_slug]"] = request.mandator_slug

    if request.imported_from_bank is not None:
        filters["filter[imported_from_bank]"] = request.imported_from_bank

    if request.dates:
        filters["filter[dates]"] = ",".join(request.dates)

    if request.asset_types:
        filters["filter[asset_types]"] = ",".join(request.asset_types)

    if request.isins:
        filters["filter[isins]"] = ",".join(request.isins)

    if request.emitters:
        filters["filter[emitters]"] = ",".join(request.emitters)

    return filters


async def start_assets_market_value_report(
    request: WealthAssetPreviewRequest,
) -> WealthAssetsReportInitResponse:
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            build_url("/api/v3/reports/assets_market_value"),
            headers=get_headers(),
            params=build_filters(request),
        )

    if response.status_code >= 400:
        raise WealthApiError(f"WealthAPI {response.status_code}: {response.text}")

    return WealthAssetsReportInitResponse.model_validate(response.json())


async def fetch_assets_market_value_report(
    report_id: str,
) -> WealthAssetsReportResponse:
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(
            build_url(f"/api/v3/reports/assets_market_value/{report_id}"),
            headers=get_headers(),
        )

    if response.status_code >= 400:
        raise WealthApiError(f"WealthAPI {response.status_code}: {response.text}")

    return WealthAssetsReportResponse.model_validate(response.json())


async def wait_for_assets_market_value_report(
    report_id: str,
) -> WealthAssetsReportResponse:
    settings = get_settings()

    for attempt in range(settings.wealth_api_report_max_attempts):
        report = await fetch_assets_market_value_report(report_id)
        status = report.data.status.lower()

        if status == "success":
            return report

        if status == "failed":
            raise WealthApiError(
                report.data.error or "WealthAPI asset report generation failed."
            )

        if attempt < settings.wealth_api_report_max_attempts - 1:
            await asyncio.sleep(settings.wealth_api_poll_interval_seconds)

    raise WealthApiError(
        f"WealthAPI asset report did not complete after {settings.wealth_api_report_max_attempts} attempts."
    )


async def get_assets_market_value_report(
    request: WealthAssetPreviewRequest,
) -> WealthAssetsTotalMarketValue:
    init_response = await start_assets_market_value_report(request)

    report = await wait_for_assets_market_value_report(
        init_response.data.report_id
    )

    if not report.data.reports:
        raise WealthApiError("WealthAPI report succeeded but returned no reports.")

    return report.data.reports[0]
