import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CreateAccountScreen() {
  const [name, setName] = useState("Federico");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canContinue = name.trim().length > 0;

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.topBar}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>

            <Text style={styles.logo}>elara</Text>

            <Text style={styles.stepText}>2/3</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.content}>
            <View style={styles.headerBlock}>
              <Text style={styles.eyebrow}>CREATE YOUR ACCOUNT</Text>

              <Text style={styles.title}>
                Save your{"\n"}portfolio setup.
              </Text>

              <Text style={styles.subtitle}>
                Create a basic profile to keep your portfolio, preferences and
                future analysis connected.
              </Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor="rgba(0,0,0,0.36)"
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@email.com"
                  placeholderTextColor="rgba(0,0,0,0.36)"
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  placeholderTextColor="rgba(0,0,0,0.36)"
                  style={styles.input}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.noteCard}>
              <Text style={styles.noteTitle}>Your data stays editable.</Text>
              <Text style={styles.noteText}>
                You can update your profile, risk level and manual entries
                later from Settings.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              style={[
                styles.primaryButton,
                !canContinue && styles.primaryButtonDisabled,
              ]}
              disabled={!canContinue}
              onPress={() => router.push("/wealth-setup")}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050505",
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  topBar: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  backArrow: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: -2,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -1.5,
  },

  stepText: {
    width: 42,
    color: "rgba(255,255,255,0.46)",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
  },

  progressTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },

  progressFill: {
    width: "66%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  headerBlock: {
    marginBottom: 28,
  },

  eyebrow: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2.8,
    marginBottom: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 41,
    fontWeight: "900",
    letterSpacing: -2.6,
  },

  subtitle: {
    marginTop: 18,
    color: "rgba(255,255,255,0.58)",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "600",
    letterSpacing: -0.25,
  },

  formCard: {
    borderRadius: 32,
    backgroundColor: "#F7F7F4",
    padding: 22,
    gap: 16,
  },

  inputGroup: {
    gap: 8,
  },

  inputLabel: {
    color: "rgba(0,0,0,0.42)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  input: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 16,
    color: "#050505",
    fontSize: 16,
    fontWeight: "700",
  },

  noteCard: {
    marginTop: 14,
    borderRadius: 24,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 18,
  },

  noteTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  noteText: {
    marginTop: 5,
    color: "rgba(255,255,255,0.56)",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  footer: {
    paddingBottom: 18,
  },

  primaryButton: {
    height: 60,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  primaryButtonDisabled: {
    opacity: 0.35,
  },

  primaryButtonText: {
    color: "#050505",
    fontSize: 17,
    fontWeight: "900",
  },

  arrow: {
    color: "#050505",
    fontSize: 23,
    fontWeight: "900",
  },
});