import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AssetType =
  | "cash"
  | "etf"
  | "stock"
  | "crypto"
  | "bond"
  | "real_estate"
  | "physical_asset"
  | "other";

export type AssetSource = "manual" | "pdf" | "wealth_api";

export type Currency = "EUR" | "USD" | "GBP" | "CHF";

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

type PortfolioContextValue = {
  assets: ElaraAsset[];
  totalNetWorth: number;
  addAsset: (asset: Omit<ElaraAsset, "id" | "created_at" | "updated_at">) => void;
  updateAsset: (assetId: string, updates: UpdateAssetInput) => void;
  deleteAsset: (assetId: string) => void;
  resetPortfolio: () => void;
};

const STORAGE_KEY = "elara_portfolio_assets_v1";

const initialAssets: ElaraAsset[] = [];

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<ElaraAsset[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      try {
        const storedAssets = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedAssets) {
          setAssets(JSON.parse(storedAssets));
        } else {
          setAssets(initialAssets);
        }
      } catch (error) {
        console.log("Failed to load portfolio assets", error);
        setAssets(initialAssets);
      } finally {
        setHasLoaded(true);
      }
    }

    loadAssets();
  }, []);

  useEffect(() => {
    async function saveAssets() {
      if (!hasLoaded) {
        return;
      }

      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
      } catch (error) {
        console.log("Failed to save portfolio assets", error);
      }
    }

    saveAssets();
  }, [assets, hasLoaded]);

  const totalNetWorth = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.current_value, 0);
  }, [assets]);

  function addAsset(
    asset: Omit<ElaraAsset, "id" | "created_at" | "updated_at">
  ) {
    const now = new Date().toISOString();

    const newAsset: ElaraAsset = {
      ...asset,
      id: `asset_${Date.now()}`,
      created_at: now,
      updated_at: now,
    };

    setAssets((currentAssets) => [newAsset, ...currentAssets]);
  }

  function updateAsset(assetId: string, updates: UpdateAssetInput) {
    const now = new Date().toISOString();

    setAssets((currentAssets) =>
      currentAssets.map((asset) => {
        if (asset.id !== assetId) {
          return asset;
        }

        return {
          ...asset,
          ...updates,
          updated_at: now,
        };
      })
    );
  }

  function deleteAsset(assetId: string) {
    setAssets((currentAssets) =>
      currentAssets.filter((asset) => asset.id !== assetId)
    );
  }

  async function resetPortfolio() {
    try {
      setAssets([]);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.log("Failed to reset portfolio assets", error);
    }
  }

  const value = useMemo(
    () => ({
      assets,
      totalNetWorth,
      addAsset,
      updateAsset,
      deleteAsset,
      resetPortfolio,
    }),
    [assets, totalNetWorth]
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error("usePortfolio must be used inside PortfolioProvider");
  }

  return context;
}