export type WealthAssetType =
  | "STOCK"
  | "FUND"
  | "ETF"
  | "BOND"
  | "CASH"
  | "CERTIFICATE_OS"
  | "PRECIOUS_METAL"
  | "MATERIAL_ASSET"
  | "FOREIGN_CURRENCY"
  | "MANAGED"
  | string;

export type WealthAssetMarketValue = {
  asset_type: WealthAssetType | null;
  isin: string;
  emitter: string | null;
  latest_quote?: string | null;
  market_value: string | null;
  number_of_lots?: string | null;
  total_no_of_lots?: string | null;
};

export type WealthAssetsTotalMarketValue = {
  asset_types: WealthAssetType[] | null;
  date: string;
  total_market_value: string;
  assets: WealthAssetMarketValue[];
};

export type WealthAssetsReportStatus =
  | "processing"
  | "success"
  | "failed"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | string;

export type WealthAssetsReportInitResponse = {
  data: {
    report_id: string;
    status_url?: string;
  };
};

export type WealthAssetsReport = {
  data: {
    report_id: string;
    status: WealthAssetsReportStatus;
    error?: string | null;
    reports?: WealthAssetsTotalMarketValue[];
  };
};

export type WealthPortfolio = {
  id: string;
  name?: string;
  currency?: string;
  provider?: string;
  raw?: unknown;
};

export type WealthAccount = {
  id: string;
  name?: string;
  account_type?: string;
  balance?: string;
  currency?: string;
  provider?: string;
  raw?: unknown;
};

export type WealthConnection = {
  id: string;
  provider?: string;
  status?: string;
  created_at?: string;
  raw?: unknown;
};
