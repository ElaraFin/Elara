import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Goal = "growth" | "preserve" | "understand";

const goals: {
  id: Goal;
  title: string;
  description: string;
}[] = [
  {
    id: "growth",
    title: "Grow my wealth",
    description: "Long-term growth with controlled risk.",
  },
  {
    id: "preserve",
    title: "Preserve capital",
    description: "Prioritize stability and reduce unnecessary volatility.",
  },
  {
    id: "understand",
    title: "Understand my finances",
    description: "Get a clear view of my net worth, risks and allocation.",
  },
];

export default function OnboardingScreen() {
  const [selectedGoal, setSelectedGoal] = useState<Goal>("growth");

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>

          <Text style={styles.logo}>elara</Text>

          <Text style={styles.stepText}>1/3</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.content}>
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>PROFILE AND GOALS</Text>

            <Text style={styles.title}>
              What are you trying to do with your wealth?
            </Text>

            <Text style={styles.subtitle}>
              Elara uses this context to explain risk, allocation and possible
              scenarios in a way that fits your objective.
            </Text>
          </View>

          <View style={styles.options}>
            {goals.map((goal) => {
              const isSelected = selectedGoal === goal.id;

              return (
                <Pressable
                  key={goal.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => setSelectedGoal(goal.id)}
                >
                  <View style={styles.optionTop}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && styles.optionTitleSelected,
                      ]}
                    >
                      {goal.title}
                    </Text>

                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.optionDescription,
                      isSelected && styles.optionDescriptionSelected,
                    ]}
                  >
                    {goal.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/create-account")}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050505",
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
    width: "33%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  headerBlock: {
    marginBottom: 34,
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

  options: {
    gap: 12,
  },

  optionCard: {
    minHeight: 104,
    borderRadius: 28,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 20,
    justifyContent: "center",
  },

  optionCardSelected: {
    backgroundColor: "#F7F7F4",
    borderColor: "#F7F7F4",
  },

  optionTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  optionTitleSelected: {
    color: "#050505",
  },

  optionDescription: {
    marginTop: 7,
    color: "rgba(255,255,255,0.52)",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
  },

  optionDescriptionSelected: {
    color: "rgba(0,0,0,0.56)",
  },

  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterSelected: {
    borderColor: "#050505",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#050505",
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