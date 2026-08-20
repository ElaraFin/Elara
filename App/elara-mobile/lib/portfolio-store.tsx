import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./auth-store";
import {
  createSupabaseAsset,
  deleteSupabaseAsset,
  fetchSupabaseAssets,
  updateSupabaseAsset,
} from "./supabase-assets";

export type AssetType =
  | "cash"
  | "etf"
  | "stock"
  | "crypto"
  | "bond"
  | "real_estate"
  | "physical_asset"
  | "other";

export type AssetSource =
  | "manual"
  | "pdf"
  | "wealth_api";

export type Currency =
  | "EUR"
  | "USD"
  | "GBP"
  | "CHF";

export type ElaraAsset = {
  id: string;
  name: string;
  asset_type: AssetType;
  quantity?: number;
  current_value: number;
  currency: Currency;
  source: AssetSource;
  provider?: string;
  created_at: string;
  updated_at: string;
};

export type UpdateAssetInput = {
  name?: string;
  asset_type?: AssetType;
  quantity?: number;
  current_value?: number;
  currency?: Currency;
  provider?: string;
};

type NewAssetInput = Omit<
  ElaraAsset,
  "id" | "created_at" | "updated_at"
>;

type PortfolioContextValue = {
  assets: ElaraAsset[];
  totalNetWorth: number;

  isPortfolioLoading: boolean;
  portfolioError: string | null;

  addAsset: (
    asset: NewAssetInput
  ) => Promise<void>;

  updateAsset: (
    assetId: string,
    updates: UpdateAssetInput
  ) => Promise<void>;

  deleteAsset: (
    assetId: string
  ) => Promise<void>;

  resetPortfolio: () => Promise<void>;

  reloadPortfolio: () => Promise<void>;
};


const STORAGE_KEY =
  "elara_portfolio_assets_v1";


const initialAssets: ElaraAsset[] = [];


const PortfolioContext =
  createContext<PortfolioContextValue | null>(null);


function createLocalAsset(
  asset: NewAssetInput
): ElaraAsset {

  const now =
    new Date().toISOString();

  return {
    ...asset,
    id: `asset_${Date.now()}`,
    created_at: now,
    updated_at: now,
  };
}


export function PortfolioProvider({
  children,
}: {
  children: ReactNode;
}) {

  const {
    user,
    isAuthLoading,
  } = useAuth();


  const [assets, setAssets] =
    useState<ElaraAsset[]>([]);

  const [hasLoaded, setHasLoaded] =
    useState(false);

  const [portfolioError, setPortfolioError] =
    useState<string | null>(null);



  async function loadLocalAssets() {

    const storedAssets =
      await AsyncStorage.getItem(
        STORAGE_KEY
      );


    if (storedAssets) {

      setAssets(
        JSON.parse(storedAssets)
      );

      return;
    }


    setAssets(initialAssets);
  }



  async function loadPortfolio() {

    if (isAuthLoading) {
      return;
    }


    try {

      setHasLoaded(false);
      setPortfolioError(null);


      /*
        USER LOGGATO:
        Supabase è la fonte principale
      */
      if (user) {

        const remoteAssets =
          await fetchSupabaseAssets(user);


        setAssets(remoteAssets);

        return;
      }



      /*
        USER NON LOGGATO:
        nessun dato privato caricato
      */
      setAssets([]);


    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to load portfolio";


      console.log(
        "Failed to load portfolio assets",
        error
      );


      setPortfolioError(message);

      setAssets([]);


    } finally {

      setHasLoaded(true);

    }
  }



  useEffect(() => {

    loadPortfolio();

  }, [
    user?.id,
    isAuthLoading,
  ]);



  /*
    Salvataggio locale solo
    quando NON c'è utente autenticato
  */

  useEffect(() => {

    async function saveLocalAssets() {

      if (
        !hasLoaded ||
        user
      ) {
        return;
      }


      try {

        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(assets)
        );


      } catch(error) {

        console.log(
          "Failed saving local assets",
          error
        );

      }
    }


    saveLocalAssets();


  }, [
    assets,
    hasLoaded,
    user,
  ]);




  const totalNetWorth =
    useMemo(() => {

      return assets.reduce(
        (sum, asset) =>
          sum + asset.current_value,
        0
      );

    }, [assets]);




  async function addAsset(
    asset: NewAssetInput
  ) {

    try {

      setPortfolioError(null);


      if (user) {

        const createdAsset =
          await createSupabaseAsset(
            user,
            asset
          );


        setAssets(
          current =>
            [
              createdAsset,
              ...current,
            ]
        );


        return;
      }



      const localAsset =
        createLocalAsset(asset);


      setAssets(
        current =>
          [
            localAsset,
            ...current,
          ]
      );


    } catch(error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to add asset";


      setPortfolioError(message);

      throw new Error(message);
    }
  }




  async function updateAsset(
    assetId: string,
    updates: UpdateAssetInput
  ) {

    try {

      setPortfolioError(null);


      if (user) {

        const updatedAsset =
          await updateSupabaseAsset(
            user,
            assetId,
            updates
          );


        setAssets(
          current =>
            current.map(asset =>
              asset.id === assetId
                ? updatedAsset
                : asset
            )
        );


        return;
      }



      const now =
        new Date().toISOString();


      setAssets(
        current =>
          current.map(asset =>
            asset.id === assetId
              ? {
                  ...asset,
                  ...updates,
                  updated_at: now,
                }
              : asset
          )
      );


    } catch(error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update asset";


      setPortfolioError(message);

      throw new Error(message);
    }
  }




  async function deleteAsset(
    assetId: string
  ) {

    try {

      setPortfolioError(null);


      if(user) {

        await deleteSupabaseAsset(
          user,
          assetId
        );

      }


      setAssets(
        current =>
          current.filter(
            asset =>
              asset.id !== assetId
          )
      );


    } catch(error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete asset";


      setPortfolioError(message);

      throw new Error(message);
    }
  }




  async function resetPortfolio() {

    try {

      setAssets([]);

      await AsyncStorage.removeItem(
        STORAGE_KEY
      );


    } catch(error) {

      const message =
        error instanceof Error
          ? error.message
          : "Failed to reset portfolio";


      setPortfolioError(message);

      throw new Error(message);
    }
  }




  async function reloadPortfolio() {

    await loadPortfolio();

  }




  const value =
    useMemo(
      () => ({
        assets,
        totalNetWorth,

        isPortfolioLoading:
          !hasLoaded,

        portfolioError,

        addAsset,
        updateAsset,
        deleteAsset,
        resetPortfolio,
        reloadPortfolio,
      }),

      [
        assets,
        totalNetWorth,
        hasLoaded,
        portfolioError,
        user,
      ]
    );



  return (
    <PortfolioContext.Provider
      value={value}
    >
      {children}
    </PortfolioContext.Provider>
  );
}




export function usePortfolio() {

  const context =
    useContext(
      PortfolioContext
    );


  if(!context) {

    throw new Error(
      "usePortfolio must be used inside PortfolioProvider"
    );

  }


  return context;
}