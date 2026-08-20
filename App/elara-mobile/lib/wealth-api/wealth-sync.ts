import type { ElaraAsset } from "../portfolio-store";

import { getAssetMarketValues } from "./wealth-client";
import { mapWealthAssetsToElaraAssets } from "./wealth-mapper";
import type {
  WealthAssetMarketValue,
  WealthAssetsTotalMarketValue,
} from "./wealth-types";

export type WealthSyncedAsset = Omit<
  ElaraAsset,
  "id" | "created_at" | "updated_at"
>;

export type WealthSyncResult = {
  provider: string;
  reportDate?: string;
  totalMarketValue?: number;
  rawAssets: WealthAssetMarketValue[];
  mappedAssets: WealthSyncedAsset[];
};

function parseNumber(value: string | null | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return undefined;
  }

  return parsed;
}

function getLatestReport(
  report: WealthAssetsTotalMarketValue | WealthAssetsTotalMarketValue[]
): WealthAssetsTotalMarketValue {
  if (Array.isArray(report)) {
    return report[0];
  }

  return report;
}

/**
 * Prima versione del sync WealthAPI.
 *
 * Responsabilità:
 * - chiama WealthAPI
 * - prende gli asset dal report
 * - li converte in formato Elara
 *
 * NON salva ancora su Supabase.
 * Il salvataggio sarà collegato dopo, quando avremo sandbox/endpoints verificati.
 */
export async function prepareWealthPortfolioSync(
  provider = "wealthAPI"
): Promise<WealthSyncResult> {
  const wealthReport = await getAssetMarketValues();

  const latestReport = getLatestReport(wealthReport);

  const rawAssets = latestReport.assets ?? [];

  const mappedAssets = mapWealthAssetsToElaraAssets(rawAssets, provider);

  return {
    provider,
    reportDate: latestReport.date,
    totalMarketValue: parseNumber(latestReport.total_market_value),
    rawAssets,
    mappedAssets,
  };
}

/**
 * Versione mock utile per testare il mapping senza sandbox.
 *
 * Così possiamo validare la trasformazione WealthAPI → Elara
 * senza chiamare API reali.
 */
export function prepareMockWealthPortfolioSync(
  provider = "wealthAPI"
): WealthSyncResult {
  const mockReport: WealthAssetsTotalMarketValue = {
    asset_types: ["ETF", "STOCK", "CASH"],
    date: new Date().toISOString(),
    total_market_value: "18450.75",
    assets: [
      {
        asset_type: "ETF",
        isin: "IE00BK5BQT80",
        emitter: "Vanguard",
        market_value: "12500.50",
        number_of_lots: "80",
      },
      {
        asset_type: "STOCK",
        isin: "US0378331005",
        emitter: "Apple Inc.",
        market_value: "4200.25",
        number_of_lots: "12",
      },
      {
        asset_type: "CASH",
        isin: "CASH_EUR",
        emitter: "Cash balance",
        market_value: "1750.00",
        number_of_lots: "1",
      },
    ],
  };

  const mappedAssets = mapWealthAssetsToElaraAssets(
    mockReport.assets,
    provider
  );

  return {
    provider,
    reportDate: mockReport.date,
    totalMarketValue: parseNumber(mockReport.total_market_value),
    rawAssets: mockReport.assets,
    mappedAssets,
  };
}