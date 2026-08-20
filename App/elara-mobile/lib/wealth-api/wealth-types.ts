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

  /**
   * ISIN o identificativo strumento
   */
  isin: string;

  /**
   * Nome emittente
   */
  emitter: string | null;

  /**
   * Valore corrente posizione
   */
  market_value: string | null;

  /**
   * Numero quote/lotti posseduti
   */
  number_of_lots: string | null;
};



export type WealthAssetsTotalMarketValue = {
  asset_types: WealthAssetType[] | null;

  /**
   * Data report
   */
  date: string;

  /**
   * Valore totale patrimonio
   */
  total_market_value: string;

  assets: WealthAssetMarketValue[];
};



export type WealthAssetsReportStatus =
  | "processing"
  | "success"
  | "failed"
  | string;



export type WealthAssetsReport = {
  data: {
    report_id: string;

    status: WealthAssetsReportStatus;

    error?: string;

    reports?: WealthAssetsTotalMarketValue[];
  };
};





/**
 * Portfolio WealthAPI
 *
 * Verrà collegato agli endpoint reali
 * accounts / portfolios dello Swagger.
 */
export type WealthPortfolio = {
  id: string;

  name?: string;

  currency?: string;

  provider?: string;

  raw?: unknown;
};





/**
 * Conto bancario/cash account
 */
export type WealthAccount = {
  id: string;

  name?: string;

  account_type?: string;

  balance?: string;

  currency?: string;

  provider?: string;

  raw?: unknown;
};





/**
 * Connessione banca/broker
 */
export type WealthConnection = {
  id: string;

  provider?: string;

  status?: string;

  created_at?: string;

  raw?: unknown;
};