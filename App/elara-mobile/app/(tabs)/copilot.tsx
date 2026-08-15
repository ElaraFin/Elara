import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const starterQuestions = [
  "Am I managing my money well?",
  "What risks do you see?",
  "How can I improve my allocation?",
];

export default function CopilotScreen() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.topBar}>
            <Text style={styles.logo}>elara</Text>
            <Text style={styles.pageLabel}>Copilot</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatContent}
          >
            <View style={styles.datePill}>
              <Text style={styles.datePillText}>Today</Text>
            </View>

            <View style={styles.assistantBubble}>
              <Text style={styles.assistantName}>Copilot</Text>
              <Text style={styles.assistantText}>
                Hi. I can help you understand your portfolio, detect possible
                imbalances and simulate alternative strategies.
              </Text>
            </View>

            <View style={styles.suggestionsBlock}>
              <Text style={styles.suggestionsTitle}>Suggested questions</Text>

              <View style={styles.suggestionList}>
                {starterQuestions.map((question) => (
                  <Pressable
                    key={question}
                    style={styles.suggestionCard}
                    onPress={() => setMessage(question)}
                  >
                    <Text style={styles.suggestionText}>{question}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.userBubble}>
              <Text style={styles.userText}>
                What should I improve in my portfolio?
              </Text>
            </View>

            <View style={styles.assistantBubbleLarge}>
              <Text style={styles.assistantName}>Copilot</Text>

              <View style={styles.analysisSection}>
                <Text style={styles.analysisTitle}>📌 Current state</Text>
                <Text style={styles.assistantText}>
                  Your portfolio appears to have a solid base across ETFs,
                  bonds and cash. This gives you both growth exposure and some
                  liquidity.
                </Text>
              </View>

              <View style={styles.analysisDivider} />

              <View style={styles.analysisSection}>
                <Text style={styles.analysisTitle}>📉 Risks or imbalances</Text>
                <Text style={styles.assistantText}>
                  The main points to monitor are equity concentration,
                  alternative assets valuation and the volatility coming from
                  crypto exposure.
                </Text>
              </View>

              <View style={styles.analysisDivider} />

              <View style={styles.analysisSection}>
                <Text style={styles.analysisTitle}>🔄 Possible actions</Text>
                <Text style={styles.assistantText}>
                  You could compare your current allocation with a more
                  defensive scenario or simulate how a higher bond weight would
                  change volatility.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.inputWrapper}>
            <View style={styles.inputBox}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Message Copilot..."
                placeholderTextColor="rgba(255,255,255,0.42)"
                style={styles.input}
                multiline
              />

              <Pressable style={styles.sendButton}>
                <Text style={styles.sendText}>↑</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showDisclaimer} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEyebrow}>IMPORTANT</Text>

            <Text style={styles.modalTitle}>
              Copilot is not financial advice.
            </Text>

            <Text style={styles.modalText}>
              Copilot provides educational explanations, portfolio analysis and
              simulations. It does not provide binding financial advice and does
              not tell you what to buy or sell.
            </Text>

            <Pressable
              style={styles.checkboxRow}
              onPress={() => setDontShowAgain((current) => !current)}
            >
              <View
                style={[
                  styles.checkbox,
                  dontShowAgain && styles.checkboxSelected,
                ]}
              >
                {dontShowAgain && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>

              <Text style={styles.checkboxLabel}>Do not show again</Text>
            </Pressable>

            <Pressable
              style={styles.modalButton}
              onPress={() => setShowDisclaimer(false)}
            >
              <Text style={styles.modalButtonText}>I understand</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  },

  topBar: {
    height: 62,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1.8,
  },

  pageLabel: {
    color: "rgba(255,255,255,0.48)",
    fontSize: 14,
    fontWeight: "900",
  },

  chatContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 184,
  },

  datePill: {
    alignSelf: "center",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginBottom: 16,
  },

  datePillText: {
    color: "rgba(255,255,255,0.46)",
    fontSize: 12,
    fontWeight: "900",
  },

  assistantBubble: {
    alignSelf: "flex-start",
    maxWidth: "88%",
    borderRadius: 28,
    borderTopLeftRadius: 10,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 17,
    marginBottom: 16,
  },

  assistantBubbleLarge: {
    alignSelf: "flex-start",
    width: "100%",
    borderRadius: 30,
    borderTopLeftRadius: 10,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 18,
  },

  assistantName: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 9,
  },

  assistantText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },

  suggestionsBlock: {
    marginBottom: 16,
  },

  suggestionsTitle: {
    color: "rgba(255,255,255,0.46)",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 10,
  },

  suggestionList: {
    gap: 9,
  },

  suggestionCard: {
    alignSelf: "flex-start",
    maxWidth: "94%",
    borderRadius: 999,
    backgroundColor: "#F7F7F4",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  suggestionText: {
    color: "#050505",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: -0.2,
  },

  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "86%",
    borderRadius: 26,
    borderTopRightRadius: 10,
    backgroundColor: "#F7F7F4",
    paddingHorizontal: 17,
    paddingVertical: 14,
    marginBottom: 14,
  },

  userText: {
    color: "#050505",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "800",
  },

  analysisSection: {
    gap: 5,
  },

  analysisTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  analysisDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 15,
  },

  inputWrapper: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 104,
  },

  inputBox: {
    minHeight: 58,
    maxHeight: 116,
    borderRadius: 30,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 18,
    paddingRight: 7,
    paddingVertical: 7,
  },

  input: {
    flex: 1,
    maxHeight: 96,
    paddingTop: 10,
    paddingBottom: 10,
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "700",
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  sendText: {
    color: "#050505",
    fontSize: 21,
    fontWeight: "900",
    marginTop: -2,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.74)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    width: "100%",
    borderRadius: 36,
    backgroundColor: "#F7F7F4",
    padding: 24,
  },

  modalEyebrow: {
    color: "rgba(0,0,0,0.42)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2.8,
  },

  modalTitle: {
    marginTop: 22,
    color: "#050505",
    fontSize: 34,
    lineHeight: 34,
    fontWeight: "900",
    letterSpacing: -2,
  },

  modalText: {
    marginTop: 16,
    color: "rgba(0,0,0,0.62)",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
  },

  checkboxRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxSelected: {
    backgroundColor: "#050505",
  },

  checkboxCheck: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  checkboxLabel: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "800",
  },

  modalButton: {
    marginTop: 24,
    height: 58,
    borderRadius: 999,
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});