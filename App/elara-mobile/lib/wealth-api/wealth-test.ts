import {
  getAssetMarketValues,
  setWealthToken,
} from "./wealth-client";

/**
 * Test manuale per sandbox WealthAPI.
 *
 * Non chiamarlo dalla UI e non salvare token nel repo.
 * Quando avremo la sandbox attiva, passa un Bearer token valido a questa funzione.
 */
export async function testWealthAPI(authToken: string) {
  try {
    console.log("Starting WealthAPI test...");

    setWealthToken(authToken);

    const assetMarketValues = await getAssetMarketValues({
      importedFromBank: true,
    });

    console.log("Asset market values received:", assetMarketValues);

    return {
      assetMarketValues,
    };
  } catch (error) {
    console.log("WealthAPI test failed", error);
    throw error;
  }
}
