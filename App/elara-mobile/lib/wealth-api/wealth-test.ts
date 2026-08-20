import {
  getAssetMarketValues,
  getPortfolios,
  loginWealthAPI,
} from "./wealth-client";

export async function testWealthAPI() {
  try {
    console.log("Starting WealthAPI test...");

    await loginWealthAPI("YOUR_USERNAME", "YOUR_PASSWORD");

    console.log("WealthAPI login successful");

    const assetMarketValues = await getAssetMarketValues();

    console.log("Asset market values received:", assetMarketValues);

    const portfolios = await getPortfolios();

    console.log("Portfolios received:", portfolios);

    return {
      assetMarketValues,
      portfolios,
    };
  } catch (error) {
    console.log("WealthAPI test failed", error);
    throw error;
  }
}