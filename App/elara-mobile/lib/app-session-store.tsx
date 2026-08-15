import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AppSessionContextValue = {
  hasLoadedSession: boolean;
  hasCompletedSetup: boolean;
  completeSetup: () => void;
  resetSetup: () => void;
};

const STORAGE_KEY = "elara_has_completed_setup_v1";

const AppSessionContext = createContext<AppSessionContextValue | null>(null);

export function AppSessionProvider({ children }: { children: ReactNode }) {
  const [hasLoadedSession, setHasLoadedSession] = useState(false);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        setHasCompletedSetup(storedValue === "true");
      } catch (error) {
        console.log("Failed to load app session", error);
        setHasCompletedSetup(false);
      } finally {
        setHasLoadedSession(true);
      }
    }

    loadSession();
  }, []);

  async function completeSetup() {
    try {
      setHasCompletedSetup(true);
      await AsyncStorage.setItem(STORAGE_KEY, "true");
    } catch (error) {
      console.log("Failed to save app session", error);
    }
  }

  async function resetSetup() {
    try {
      setHasCompletedSetup(false);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.log("Failed to reset app session", error);
    }
  }

  const value = useMemo(
    () => ({
      hasLoadedSession,
      hasCompletedSetup,
      completeSetup,
      resetSetup,
    }),
    [hasLoadedSession, hasCompletedSetup]
  );

  return (
    <AppSessionContext.Provider value={value}>
      {children}
    </AppSessionContext.Provider>
  );
}

export function useAppSession() {
  const context = useContext(AppSessionContext);

  if (!context) {
    throw new Error("useAppSession must be used inside AppSessionProvider");
  }

  return context;
}