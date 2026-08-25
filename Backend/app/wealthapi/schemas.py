from pydantic import BaseModel


class WealthAssetMarketValue(BaseModel):
    asset_type: str | None = None
    isin: str
    emitter: str | None = None
    latest_quote: str | None = None
    market_value: str | None = None
    number_of_lots: str | None = None
    total_no_of_lots: str | None = None


class WealthAssetsTotalMarketValue(BaseModel):
    asset_types: list[str] | None = None
    date: str
    total_market_value: str
    assets: list[WealthAssetMarketValue]


class WealthAssetsReportInitData(BaseModel):
    report_id: str
    status_url: str | None = None


class WealthAssetsReportInitResponse(BaseModel):
    data: WealthAssetsReportInitData


class WealthAssetsReportData(BaseModel):
    report_id: str
    status: str
    error: str | None = None
    reports: list[WealthAssetsTotalMarketValue] | None = None


class WealthAssetsReportResponse(BaseModel):
    data: WealthAssetsReportData


class WealthAssetPreviewRequest(BaseModel):
    provider: str = "wealthAPI"
    mandator_slug: str | None = None
    imported_from_bank: bool | None = True
    dates: list[str] | None = None
    asset_types: list[str] | None = None
    isins: list[str] | None = None
    emitters: list[str] | None = None


class ElaraMappedAsset(BaseModel):
    name: str
    asset_type: str
    quantity: float
    current_value: float
    currency: str = "EUR"
    source: str = "wealth_api"
    provider: str
    external_id: str
    raw_payload: dict


class WealthAssetPreviewResponse(BaseModel):
    provider: str
    report_date: str | None = None
    total_market_value: float | None = None
    raw_assets: list[WealthAssetMarketValue]
    mapped_assets: list[ElaraMappedAsset]
