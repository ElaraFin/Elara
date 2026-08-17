import { useAppSession } from "../../lib/app-session-store";
import { usePortfolio } from "../../lib/portfolio-store";
import { supabase } from "../../lib/supabase";
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

export default function SettingsScreen() {
  const { resetPortfolio } = usePortfolio();
  const { resetSetup } = useAppSession();

  const [isTestingSupabase, setIsTestingSupabase] = useState(false);

  function handleResetLocalData() {
    Alert.alert(
      "Reset local data",
      "This will delete the local portfolio and restart the onboarding flow. Use it only for testing.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetPortfolio();
            await resetSetup();
            router.replace("/" as any);
          },
        },
      ]
    );
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
          "The app can reach Supabase. The assets table is protected because Supabase Auth is not connected yet."
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
          Manage local app state while building the MVP. These controls are only
          for development and testing before Supabase Auth.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Supabase</Text>
          <Text style={styles.cardSubtitle}>
            The app now has a Supabase client configured through local
            environment variables.
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
          <Text style={styles.cardTitle}>Local portfolio</Text>
          <Text style={styles.cardSubtitle}>
            Assets are currently saved with AsyncStorage on this device.
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.rowIcon}>
            <Text style={styles.rowIconText}>DB</Text>
          </View>

          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>AsyncStorage active</Text>
            <Text style={styles.rowDescription}>
              Manual assets remain available after closing and reopening Expo
              Go.
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
              After setup, the app opens directly on the Wealth dashboard.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.dangerCard}>
        <Text style={styles.dangerKicker}>Testing control</Text>
        <Text style={styles.dangerTitle}>Reset local data</Text>
        <Text style={styles.dangerText}>
          Deletes local assets and resets the setup flag. The next app launch
          will start from the Welcome screen again.
        </Text>

        <Pressable style={styles.resetButton} onPress={handleResetLocalData}>
          <Text style={styles.resetButtonText}>Reset local data</Text>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Next backend step</Text>
        <Text style={styles.infoText}>
          After this local layer works, the same asset model will be persisted on
          Supabase and exposed through FastAPI endpoints.
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