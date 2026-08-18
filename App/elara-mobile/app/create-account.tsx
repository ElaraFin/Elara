import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAppSession } from "../lib/app-session-store";
import { useAuth } from "../lib/auth-store";

export default function CreateAccountScreen() {
  const {
    signInWithEmail,
    signUpWithEmail,
    user,
    isAuthLoading,
  } = useAuth();

  const { hasCompletedSetup } = useAppSession();

  const [mode, setMode] = useState<"signup" | "signin">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  function goToNextScreen() {
    if (hasCompletedSetup) {
      router.replace("/(tabs)/wealth" as any);
      return;
    }

    router.replace("/wealth-setup" as any);
  }

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (user) {
      goToNextScreen();
    }
  }, [isAuthLoading, user, hasCompletedSetup]);

  async function handleSubmit() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      Alert.alert("Missing email", "Enter your email address to continue.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Password too short",
        "Use at least 6 characters for your password."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      if (isSignup) {
        await signUpWithEmail(cleanEmail, password);

        Alert.alert(
          "Account created",
          "Your Elara account has been created.",
          [
            {
              text: "Continue",
              onPress: goToNextScreen,
            },
          ]
        );

        return;
      }

      await signInWithEmail(cleanEmail, password);
      goToNextScreen();
    } catch (error) {
      Alert.alert(
        isSignup ? "Sign up failed" : "Sign in failed",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleMode() {
    setMode(isSignup ? "signin" : "signup");
  }

  if (isAuthLoading) {
    return <View style={styles.screen} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          <Text style={styles.logo}>elara</Text>

          <View style={styles.backButtonPlaceholder} />
        </View>

        <View style={styles.header}>
          <Text style={styles.kicker}>Private beta</Text>

          <Text style={styles.title}>
            {isSignup ? "Create your account." : "Welcome back."}
          </Text>

          <Text style={styles.subtitle}>
            {isSignup
              ? "Create a secure Elara account. This identity will be used to save your portfolio privately on Supabase."
              : "Sign in before opening your Elara dashboard."}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.modeSwitch}>
            <Pressable
              style={[styles.modeButton, !isSignup && styles.modeButtonActive]}
              onPress={() => setMode("signin")}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  !isSignup && styles.modeButtonTextActive,
                ]}
              >
                Sign in
              </Text>
            </Pressable>

            <Pressable
              style={[styles.modeButton, isSignup && styles.modeButtonActive]}
              onPress={() => setMode("signup")}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  isSignup && styles.modeButtonTextActive,
                ]}
              >
                Create account
              </Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="rgba(255,255,255,0.32)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor="rgba(255,255,255,0.32)"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          <Pressable
            style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#050505" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isSignup ? "Create account" : "Sign in"}
              </Text>
            )}
          </Pressable>

          <Pressable style={styles.textButton} onPress={toggleMode}>
            <Text style={styles.textButtonText}>
              {isSignup
                ? "Already have an account? Sign in"
                : "New to Elara? Create an account"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why this matters</Text>
          <Text style={styles.infoText}>
            Supabase Auth gives each user a secure ID. That ID will be used by
            database policies to keep every portfolio private.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#050505",
  },

  screen: {
    flex: 1,
    backgroundColor: "#050505",
  },

  content: {
    flexGrow: 1,
    paddingTop: 58,
    paddingHorizontal: 22,
    paddingBottom: 40,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: -2,
  },

  backButtonPlaceholder: {
    width: 44,
    height: 44,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -1.6,
  },

  header: {
    marginTop: 54,
  },

  kicker: {
    color: "rgba(255,255,255,0.48)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.45,
    textTransform: "uppercase",
  },

  title: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 48,
    lineHeight: 49,
    fontWeight: "900",
    letterSpacing: -2.7,
  },

  subtitle: {
    marginTop: 16,
    color: "rgba(255,255,255,0.62)",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "500",
    letterSpacing: -0.25,
  },

  card: {
    marginTop: 36,
    padding: 20,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  modeSwitch: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginBottom: 22,
  },

  modeButton: {
    flex: 1,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  modeButtonActive: {
    backgroundColor: "#FFFFFF",
  },

  modeButtonText: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: -0.2,
  },

  modeButtonTextActive: {
    color: "#050505",
  },

  field: {
    marginTop: 16,
  },

  label: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: -0.15,
    marginBottom: 9,
  },

  input: {
    height: 58,
    borderRadius: 20,
    paddingHorizontal: 17,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.25,
    backgroundColor: "rgba(0,0,0,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  primaryButton: {
    marginTop: 24,
    height: 58,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  primaryButtonText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.35,
  },

  textButton: {
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  textButtonText: {
    color: "rgba(255,255,255,0.56)",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.2,
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