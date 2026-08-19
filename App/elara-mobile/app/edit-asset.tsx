import { AssetType, Currency, usePortfolio } from "../lib/portfolio-store";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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

const assetTypes: { label: string; value: AssetType }[] = [
  { label: "Cash", value: "cash" },
  { label: "ETF", value: "etf" },
  { label: "Stock", value: "stock" },
  { label: "Crypto", value: "crypto" },
  { label: "Bond", value: "bond" },
  { label: "Real estate", value: "real_estate" },
  { label: "Physical asset", value: "physical_asset" },
  { label: "Other", value: "other" },
];

const currencies: Currency[] = ["EUR", "USD", "GBP", "CHF"];

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return parsed;
}

export default function EditAssetScreen() {
  const params = useLocalSearchParams();
  const assetId = String(params.assetId ?? "");

  const { assets, updateAsset } = usePortfolio();

  const asset = useMemo(() => {
    return assets.find((item) => item.id === assetId);
  }, [assets, assetId]);

  const [name, setName] = useState("");
  const [assetType, setAssetType] = useState<AssetType>("etf");
  const [currentValue, setCurrentValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [provider, setProvider] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!asset) {
      return;
    }

    setName(asset.name);
    setAssetType(asset.asset_type);
    setCurrentValue(String(asset.current_value));
    setQuantity(asset.quantity ? String(asset.quantity) : "");
    setCurrency(asset.currency);
    setProvider(asset.provider ?? "");
  }, [asset?.id]);

  const parsedCurrentValue = useMemo(() => {
    return parseNumber(currentValue);
  }, [currentValue]);

  const canSave =
    Boolean(asset) && name.trim().length > 0 && parsedCurrentValue > 0;

  async function handleSave() {
    if (!asset || !canSave || isSaving) {
      return;
    }

    const parsedQuantity =
      quantity.trim().length > 0 ? parseNumber(quantity) : undefined;

    try {
      setIsSaving(true);

      await updateAsset(asset.id, {
        name: name.trim(),
        asset_type: assetType,
        current_value: parsedCurrentValue,
        quantity: parsedQuantity,
        currency,
        provider: provider.trim().length > 0 ? provider.trim() : "Manual input",
      });

      router.replace("/(tabs)/wealth" as any);
    } catch (error) {
      Alert.alert(
        "Update failed",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!asset) {
    return (
      <View style={styles.notFoundScreen}>
        <Text style={styles.notFoundTitle}>Asset not found</Text>
        <Text style={styles.notFoundText}>
          This asset may have been deleted or is no longer available.
        </Text>

        <Pressable
          style={styles.notFoundButton}
          onPress={() => router.replace("/(tabs)/wealth" as any)}
        >
          <Text style={styles.notFoundButtonText}>Back to Wealth</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <Text style={styles.logo}>elara</Text>

          <View style={styles.backButtonGhost} />
        </View>

        <View style={styles.header}>
          <Text style={styles.kicker}>Manual import</Text>
          <Text style={styles.title}>Edit asset</Text>
          <Text style={styles.subtitle}>
            Update the normalized asset data used by the Wealth dashboard,
            Quant Engine and future Copilot analysis.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Asset name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Example: VWCE, Bitcoin, Cash account"
            placeholderTextColor="rgba(255,255,255,0.34)"
            style={styles.input}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Asset type</Text>

          <View style={styles.pillGrid}>
            {assetTypes.map((item) => {
              const selected = item.value === assetType;

              return (
                <Pressable
                  key={item.value}
                  style={[styles.typePill, selected && styles.typePillSelected]}
                  onPress={() => setAssetType(item.value)}
                >
                  <Text
                    style={[
                      styles.typePillText,
                      selected && styles.typePillTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.section, styles.rowItemLarge]}>
            <Text style={styles.label}>Current value</Text>
            <TextInput
              value={currentValue}
              onChangeText={setCurrentValue}
              placeholder="0"
              placeholderTextColor="rgba(255,255,255,0.34)"
              style={styles.input}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.section, styles.rowItemSmall]}>
            <Text style={styles.label}>Currency</Text>

            <View style={styles.currencyBox}>
              {currencies.map((item) => {
                const selected = item === currency;

                return (
                  <Pressable
                    key={item}
                    style={[
                      styles.currencyPill,
                      selected && styles.currencyPillSelected,
                    ]}
                    onPress={() => setCurrency(item)}
                  >
                    <Text
                      style={[
                        styles.currencyText,
                        selected && styles.currencyTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Quantity optional</Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Example: 12.5"
            placeholderTextColor="rgba(255,255,255,0.34)"
            style={styles.input}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Provider optional</Text>
          <TextInput
            value={provider}
            onChangeText={setProvider}
            placeholder="Example: Trade Republic, Revolut, manual"
            placeholderTextColor="rgba(255,255,255,0.34)"
            style={styles.input}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Portfolio integration</Text>
          <Text style={styles.infoText}>
            Editing this asset updates the normalized portfolio data persisted
            for the authenticated user.
          </Text>
        </View>

        <Pressable
          style={[
            styles.saveButton,
            (!canSave || isSaving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!canSave || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#050505" />
          ) : (
            <Text
              style={[
                styles.saveButtonText,
                !canSave && styles.saveButtonTextDisabled,
              ]}
            >
              Save changes
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050505",
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingTop: 52,
    paddingHorizontal: 22,
    paddingBottom: 42,
  },

  topBar: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: -2,
  },

  backButtonGhost: {
    width: 42,
    height: 42,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -1.4,
  },

  header: {
    marginTop: 34,
  },

  kicker: {
    color: "rgba(255,255,255,0.54)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  title: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 43,
    fontWeight: "800",
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

  section: {
    marginTop: 26,
  },

  label: {
    marginBottom: 10,
    color: "rgba(255,255,255,0.74)",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.15,
  },

  input: {
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: 18,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.25,
  },

  pillGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  typePill: {
    height: 42,
    paddingHorizontal: 15,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  typePillSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },

  typePillText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  typePillTextSelected: {
    color: "#050505",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  rowItemLarge: {
    flex: 1,
  },

  rowItemSmall: {
    width: 116,
  },

  currencyBox: {
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    gap: 5,
  },

  currencyPill: {
    height: 34,
    minWidth: 24,
    paddingHorizontal: 5,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  currencyPillSelected: {
    backgroundColor: "#FFFFFF",
  },

  currencyText: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  currencyTextSelected: {
    color: "#050505",
  },

  infoCard: {
    marginTop: 30,
    padding: 18,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  infoTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.35,
  },

  infoText: {
    marginTop: 8,
    color: "rgba(255,255,255,0.58)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    letterSpacing: -0.15,
  },

  saveButton: {
    marginTop: 26,
    height: 62,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  saveButtonText: {
    color: "#050505",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.35,
  },

  saveButtonTextDisabled: {
    color: "rgba(255,255,255,0.36)",
  },

  notFoundScreen: {
    flex: 1,
    backgroundColor: "#050505",
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  notFoundTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1.3,
  },

  notFoundText: {
    marginTop: 10,
    color: "rgba(255,255,255,0.58)",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    textAlign: "center",
  },

  notFoundButton: {
    marginTop: 24,
    height: 54,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  notFoundButtonText: {
    color: "#050505",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.25,
  },
});