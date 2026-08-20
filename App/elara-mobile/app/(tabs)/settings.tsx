import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppSession } from "../../lib/app-session-store";
import { useAuth } from "../../lib/auth-store";
import { usePortfolio } from "../../lib/portfolio-store";
import { supabase } from "../../lib/supabase";
import { prepareMockWealthPortfolioSync } from "../../lib/wealth-api/wealth-sync";

export default function SettingsScreen() {
  const { resetPortfolio } = usePortfolio();
  const { resetSetup } = useAppSession();
  const { user, isAuthLoading, signOut } = useAuth();

  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isTestingWealthMock, setIsTestingWealthMock] = useState(false);

  const userEmail = user?.email ?? "Unknown email";

  function handleOpenAuthScreen() {
    router.push("/create-account" as any);
  }

  function handleResetLocalData() {
    Alert.alert(
      "Reset local data",
      "This will delete the local portfolio, reset onboarding, sign out from Supabase, and restart the app flow.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await resetPortfolio();
              await resetSetup();

              if (user) {
                await signOut();
              }

              await AsyncStorage.multiRemove([
                "elara_portfolio_assets_v1",
                "elara_has_completed_setup_v1",
              ]);

              router.replace("/" as any);
            } catch (error) {
              Alert.alert(
                "Reset failed",
                error instanceof Error ? error.message : "Unknown error"
              );
            }
          },
        },
      ]
    );
  }

  function handleSignOut() {
    Alert.alert("Sign out", "Do you want to sign out from this device?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          try {
            setIsSigningOut(true);
            await signOut();
            router.replace("/create-account" as any);
          } catch (error) {
            Alert.alert(
              "Sign out failed",
              error instanceof Error ? error.message : "Unknown error"
            );
          } finally {
            setIsSigningOut(false);
          }
        },
      },
    ]);
  }

  async function handleTestSupabaseConnection() {
    try {
      setIsTestingSupabase(true);

      const { error } = await supabase.from("assets").select("id").limit(1);

      if (error) {
        if (
          error.message.toLowerCase().includes("permission denied") ||
          error.message.toLowerCase().includes("row-level security")
        ) {
          Alert.alert(
            "Supabase reachable",
            "The app can reach Supabase. The assets table is protected by database policies."
          );
          return;
        }

        Alert.alert("Supabase error", error.message);
        return;
      }

      Alert.alert(
        "Supabase connected",
        "The mobile app can reach your Supabase project and query the assets table."
      );
    } catch (error) {
      Alert.alert(
        "Connection failed",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setIsTestingSupabase(false);
    }
  }

  function handleTestWealthMockSync() {
    try {
      setIsTestingWealthMock(true);

      const result = prepareMockWealthPortfolioSync("Mock Brokerage");
      const firstAsset = result.mappedAssets[0];

      Alert.alert(
        "WealthAPI mock sync ready",
        `Mapped ${result.mappedAssets.length} assets.\n\nTotal value: €${
          result.totalMarketValue?.toLocaleString("it-IT") ?? "N/A"
        }\n\nFirst asset: ${firstAsset?.name ?? "N/A"}`
      );
    } catch (error) {
      Alert.alert(
        "WealthAPI mock failed",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setIsTestingWealthMock(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>elara</Text>
          <Text style={styles.screenLabel}>Settings</Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.kicker}>Local development</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Manage account, Supabase connection, WealthAPI mapping, and local app
          state while building the MVP.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Account</Text>
          <Text style={styles.cardSubtitle}>
            Supabase Auth is now the identity layer for the Elara mobile app.
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowIcon}>
            <Text style={styles.rowIconText}>{user ? "✓" : "!"}</Text>
          </View>

          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>
              {isAuthLoading
                ? "Checking session..."
                : user
                  ? "Signed in"
                  : "Not signed in"}
            </Text>

            <Text style={styles.rowDescription}>
              {user
                ? userEmail
                : "Sign in or create an account before syncing portfolio data."}
            </Text>
          </View>
        </View>

        {user ? (
          <Pressable
            style={[
              styles.outlineButton,
              isSigningOut && styles.outlineButtonDisabled,
            ]}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            <Text
              style={[
                styles.outlineButtonText,
                isSigningOut && styles.outlineButtonTextDisabled,
              ]}
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </Text>
          </Pressable>
        ) : (
          <Pressable style={styles.secondaryButton} onPress={handleOpenAuthScreen}>
            <Text style={styles.secondaryButtonText}>
              Sign in / Create account
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Supabase</Text>
          <Text style={styles.cardSubtitle}>
            The app has a Supabase client configured through local environment
            variables.
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowIcon}>
            <Text style={styles.rowIconText}>SB</Text>
          </View>

          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Database connection</Text>
            <Text style={styles.rowDescription}>
              Test whether Expo can reach the Supabase project and read the
              assets table.
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.secondaryButton,
            isTestingSupabase && styles.secondaryButtonDisabled,
          ]}
          onPress={handleTestSupabaseConnection}
          disabled={isTestingSupabase}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              isTestingSupabase && styles.secondaryButtonTextDisabled,
            ]}
          >
            {isTestingSupabase ? "Testing..." : "Test Supabase connection"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>WealthAPI</Text>
          <Text style={styles.cardSubtitle}>
            Test the WealthAPI mapping layer without calling the real sandbox
            yet.
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowIcon}>
            <Text style={styles.rowIconText}>WA</Text>
          </View>

          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Mock brokerage sync</Text>
            <Text style={styles.rowDescription}>
              Converts mock brokerage holdings into Elara assets using the
              WealthAPI mapper.
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            styles.secondaryButton,
            isTestingWealthMock && styles.secondaryButtonDisabled,
          ]}
          onPress={handleTestWealthMockSync}
          disabled={isTestingWealthMock}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              isTestingWealthMock && styles.secondaryButtonTextDisabled,
            ]}
          >
            {isTestingWealthMock ? "Testing..." : "Test WealthAPI mock sync"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Local portfolio</Text>
          <Text style={styles.cardSubtitle}>
            Assets are now primarily saved on Supabase when the user is signed
            in.
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowIcon}>
            <Text style={styles.rowIconText}>DB</Text>
          </View>

          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Portfolio storage</Text>
            <Text style={styles.rowDescription}>
              Manual assets are persisted in Supabase for authenticated users.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Session state</Text>
          <Text style={styles.cardSubtitle}>
            The app remembers that onboarding/setup has been completed.
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowIcon}>
            <Text style={styles.rowIconText}>✓</Text>
          </View>

          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>Auto-open Wealth</Text>
            <Text style={styles.rowDescription}>
              After setup and authentication, the app opens directly on the
              Wealth dashboard.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.dangerCard}>
        <Text style={styles.dangerKicker}>Testing control</Text>
        <Text style={styles.dangerTitle}>Reset local data</Text>
        <Text style={styles.dangerText}>
          Deletes local assets, resets the setup flag, signs out from Supabase,
          and restarts the app flow.
        </Text>

        <Pressable style={styles.resetButton} onPress={handleResetLocalData}>
          <Text style={styles.resetButtonText}>Reset local data</Text>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Next integration step</Text>
        <Text style={styles.infoText}>
          When the WealthAPI sandbox is active, the mock sync will be replaced
          by the real Brokerage API flow and persisted as source=wealth_api.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050505",
  },

  content: {
    paddingTop: 58,
    paddingHorizontal: 22,
    paddingBottom: 118,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1.7,
  },

  screenLabel: {
    marginTop: 4,
    color: "rgba(255,255,255,0.46)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  header: {
    marginTop: 34,
  },

  kicker: {
    color: "rgba(255,255,255,0.48)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  title: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 43,
    fontWeight: "900",
    letterSpacing: -2.3,
  },

  subtitle: {
    marginTop: 14,
    color: "rgba(255,255,255,0.62)",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "500",
    letterSpacing: -0.25,
  },

  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  cardHeader: {
    marginBottom: 18,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.65,
  },

  cardSubtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.52)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.15,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  rowIconText: {
    color: "#050505",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  rowContent: {
    flex: 1,
    marginLeft: 14,
  },

  rowTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.35,
  },

  rowDescription: {
    marginTop: 4,
    color: "rgba(255,255,255,0.48)",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  secondaryButton: {
    marginTop: 20,
    height: 54,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  secondaryButtonText: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  secondaryButtonTextDisabled: {
    color: "rgba(255,255,255,0.36)",
  },

  outlineButton: {
    marginTop: 20,
    height: 54,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  outlineButtonDisabled: {
    opacity: 0.55,
  },

  outlineButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  outlineButtonTextDisabled: {
    color: "rgba(255,255,255,0.42)",
  },

  dangerCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 28,
    backgroundColor: "rgba(255,70,70,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,90,90,0.24)",
  },

  dangerKicker: {
    color: "rgba(255,140,140,0.78)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  dangerTitle: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  dangerText: {
    marginTop: 10,
    color: "rgba(255,255,255,0.58)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.15,
  },

  resetButton: {
    marginTop: 18,
    height: 54,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  resetButtonText: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  infoCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  infoTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.55,
  },

  infoText: {
    marginTop: 9,
    color: "rgba(255,255,255,0.52)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.15,
  },
});