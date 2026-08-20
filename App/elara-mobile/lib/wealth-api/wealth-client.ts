import type {
  WealthAssetMarketValue,
  WealthAssetsTotalMarketValue,
  WealthPortfolio,
  WealthAccount,
} from "./wealth-types";


const WEALTH_API_URL =
  process.env.EXPO_PUBLIC_WEALTH_API_URL;


let accessToken: string | null = null;



function authHeaders() {

  if (!accessToken) {
    throw new Error(
      "WealthAPI token missing"
    );
  }


  return {
    "Content-Type": "application/json",

    Authorization:
      `Bearer ${accessToken}`,
  };
}



async function wealthRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {


  if (!WEALTH_API_URL) {
    throw new Error(
      "Missing WealthAPI URL"
    );
  }


  const response =
    await fetch(
      `${WEALTH_API_URL}${endpoint}`,
      {
        ...options,

        headers: {
          ...authHeaders(),
          ...options.headers,
        },
      }
    );


  if (!response.ok) {

    const text =
      await response.text();


    throw new Error(
      `WealthAPI ${response.status}: ${text}`
    );
  }


  return response.json();

}




export function setWealthToken(
  token:string
) {

  accessToken = token;

}



export function clearWealthToken() {

  accessToken = null;

}




/**
 * AUTH
 *
 * Endpoint da collegare
 * alla documentazione login WealthAPI
 */
export async function loginWealthAPI(
  username:string,
  password:string
) {


  const response =
    await fetch(
      `${WEALTH_API_URL}/api/v1/login`,
      {
        method:"POST",

        headers:{
          "Content-Type":
            "application/json",
        },


        body:JSON.stringify({
          username,
          password,
        }),
      }
    );


  if(!response.ok){

    throw new Error(
      "WealthAPI login failed"
    );

  }


  const data =
    await response.json();


  accessToken =
    data.access_token;


  return data;

}





/**
 * BANK CONNECTIONS
 *
 * esempio:
 * Trade Republic
 * Fineco
 * Revolut
 */
export async function getBankConnections(){

  return wealthRequest(
    "/api/v1/wealth_api/bank_connections"
  );

}





/**
 * ACCOUNTS
 */
export async function getAccounts()
:Promise<WealthAccount[]> {


  return wealthRequest(
    "/api/v1/accounts"
  );

}





/**
 * PORTFOLIO
 */
export async function getPortfolios()
:Promise<WealthPortfolio[]> {


  return wealthRequest(
    "/api/v1/portfolios"
  );

}





/**
 * ASSET MARKET VALUE
 */
export async function getAssetMarketValues()
:Promise<WealthAssetsTotalMarketValue> {


  return wealthRequest(
    "/api/v1/reports/assets_market_value"
  );

}