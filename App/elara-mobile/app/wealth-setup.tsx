import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "../lib/auth-store";
import { usePortfolio } from "../lib/portfolio-store";
import { syncMockWealthPortfolioToSupabase } from "../lib/wealth-api/wealth-sync";

type AssetCategory =
  | "bank"
  | "broker"
  | "etf"
  | "crypto"
  | "bond"
  | "realEstate"
  | "physical"
  | "other";

const assetCategories: {
  id: AssetCategory;
  title: string;
  description: string;
  shortLabel: string;
}[] = [
  {
    id: "bank",
    title: "Bank account",
    shortLabel: "Cash",
    description: "Current accounts, savings and available liquidity.",
  },
  {
    id: "broker",
    title: "Broker account",
    shortLabel: "Broker",
    description: "Investment accounts, trading apps and brokers.",
  },
  {
    id: "etf",
    title: "ETF / Stock",
    shortLabel: "Markets",
    description: "ETFs, single stocks and listed instruments.",
  },
  {
    id: "crypto",
    title: "Crypto",
    shortLabel: "Crypto",
    description: "Bitcoin, Ethereum and other digital assets.",
  },
  {
    id: "bond",
    title: "Bond",
    shortLabel: "Fixed income",
    description: "Government bonds, corporate bonds and bond ETFs.",
  },
  {
    id: "realEstate",
    title: "Real estate",
    shortLabel: "Property",
    description: "Properties and real-estate exposure.",
  },
  {
    id: "physical",
    title: "Physical asset",
    shortLabel: "Assets",
    description: "Cars, watches, collectibles and other valuable items.",
  },
  {
    id: "other",
    title: "Other",
    shortLabel: "Other",
    description: "Anything that does not fit the categories above.",
  },
];

function formatCurrency(value: number, currency = "EUR") {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function WealthSetupScreen() {
  const { user } = useAuth();
  const { assets, reloadPortfolio } = usePortfolio();

  const [selectedCategories, setSelectedCategories] = useState<AssetCategory[]>([
    "bank",
    "broker",
    "etf",
  ]);

  const [isConnectingBroker, setIsConnectingBroker] = useState(false);

  const brokerSyncedAssets = useMemo(() => {
    return assets.filter((asset) => asset.source === "wealth_api");
  }, [assets]);

  const brokerSyncedValue = useMemo(() => {
    return brokerSyncedAssets.reduce(
      (total, asset) => total + asset.current_value,
      0
    );
  }, [brokerSyncedAssets]);

  const hasBrokerSync = brokerSyncedAssets.length > 0;

  function toggleCategory(category: AssetCategory) {
    setSelectedCategories((current) => {
      if (current.includes(category)) {
        return current.filter((item) => item !== category);
      }

      return [...current, category];
    });
  }

  function handleManualInput() {
    router.push("/add-asset" as any);
  }

  function handlePdfImport() {
    Alert.alert(
      "PDF import",
      "PDF import is already part of the Elara roadmap. For the mobile MVP, this button is prepared as the entry point for statement parsing."
    );
  }

  async function handleConnectBrokerMock() {
    if (!user) {
      Alert.alert(
        "Sign in required",
        "You need to be signed in before connecting a broker account."
      );
      return;
    }

    try {
      setIsConnectingBroker(true);

      const wasAlreadySynced = hasBrokerSync;

      const result = await syncMockWealthPortfolioToSupabase(
        user,
        "Mock Brokerage"
      );

      await reloadPortfolio();

      Alert.alert(
        wasAlreadySynced ? "Broker sync refreshed" : "Broker connected",
        wasAlreadySynced
          ? `Refreshed ${result.savedAssets.length} mock broker assets through the WealthAPI sync layer.`
          : `Imported ${result.savedAssets.length} mock broker assets through the WealthAPI sync layer.`,
        [
          {
            text: "View Wealth",
            onPress: () => router.replace("/(tabs)/wealth" as any),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Broker connection failed",
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setIsConnectingBroker(false);
    }
  }

  const selectedCount = selectedCategories.length;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>

          <Text style={styles.logo}>elara</Text>

          <Text style={styles.stepText}>3/3</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerBlock}>
            <Text style={styles.eyebrow}>WEALTH SETUP</Text>

            <Text style={styles.title}>
              Connect your{"\n"}first wealth data.
            </Text>

            <Text style={styles.subtitle}>
              Start manually, import documents, or connect a broker. Elara
              normalizes every source into one portfolio view.
            </Text>
          </View>

          <View style={styles.importPanel}>
            <Text style={styles.importEyebrow}>DATA SOURCES</Text>
            <Text style={styles.importTitle}>Choose how to start</Text>

            {hasBrokerSync ? (
              <View style={styles.brokerStatusCard}>
                <View>
                  <Text style={styles.brokerStatusLabel}>Broker sync active</Text>
                  <Text style={styles.brokerStatusValue}>
                    {formatCurrency(brokerSyncedValue)}
                  </Text>
                </View>

                <View style={styles.brokerStatusPill}>
                  <Text style={styles.brokerStatusPillText}>
                    {brokerSyncedAssets.length}{" "}
                    {brokerSyncedAssets.length === 1 ? "asset" : "assets"}
                  </Text>
                </View>
              </View>
            ) : null}

            <Pressable style={styles.importCard} onPress={handleManualInput}>
              <View style={styles.importIcon}>
                <Text style={styles.importIconText}>＋</Text>
              </View>

              <View style={styles.importCopy}>
                <Text style={styles.importCardTitle}>Manual input</Text>
                <Text style={styles.importCardText}>
                  Add cash, ETFs, stocks, crypto, real estate or physical assets
                  manually.
                </Text>
              </View>

              <Text style={styles.importArrow}>→</Text>
            </Pressable>

            <Pressable style={styles.importCard} onPress={handlePdfImport}>
              <View style={styles.importIcon}>
                <Text style={styles.importIconText}>PDF</Text>
              </View>

              <View style={styles.importCopy}>
                <Text style={styles.importCardTitle}>Import statement</Text>
                <Text style={styles.importCardText}>
                  Prepare the flow for bank and broker PDF parsing.
                </Text>
              </View>

              <Text style={styles.importArrow}>→</Text>
            </Pressable>

            <Pressable
              style={[
                styles.importCard,
                styles.brokerImportCard,
                isConnectingBroker && styles.importCardDisabled,
              ]}
              onPress={handleConnectBrokerMock}
              disabled={isConnectingBroker}
            >
              <View style={[styles.importIcon, styles.brokerImportIcon]}>
                <Text style={styles.brokerImportIconText}>WA</Text>
              </View>

              <View style={styles.importCopy}>
                <Text
                  style={[styles.importCardTitle, styles.brokerImportCardTitle]}
                >
                  {isConnectingBroker
                    ? hasBrokerSync
                      ? "Refreshing sync..."
                      : "Connecting broker..."
                    : hasBrokerSync
                      ? "Refresh broker sync"
                      : "Connect broker"}
                </Text>

                <Text
                  style={[styles.importCardText, styles.brokerImportCardText]}
                >
                  {hasBrokerSync
                    ? "Replace the current WealthAPI imported assets with the latest broker snapshot."
                    : "Use the mocked WealthAPI sync now. Later this becomes the real broker connection flow."}
                </Text>
              </View>

              <Text style={[styles.importArrow, styles.brokerImportArrow]}>
                →
              </Text>
            </Pressable>
          </View>

          <View style={styles.mergerPanel}>
            <View style={styles.mergerHeader}>
              <View>
                <Text style={styles.mergerEyebrow}>MERGER MODULE</Text>
                <Text style={styles.mergerTitle}>Portfolio categories</Text>
              </View>

              <View style={styles.countPill}>
                <Text style={styles.countText}>{selectedCount} selected</Text>
              </View>
            </View>

            <View style={styles.categoryList}>
              {assetCategories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);

                return (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.categoryRow,
                      isSelected && styles.categoryRowSelected,
                    ]}
                    onPress={() => toggleCategory(category.id)}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        isSelected && styles.categoryIconSelected,
                      ]}
                    >
                      <CategoryIcon type={category.id} selected={isSelected} />
                    </View>

                    <View style={styles.categoryCopy}>
                      <View style={styles.categoryTitleRow}>
                        <Text
                          style={[
                            styles.categoryTitle,
                            isSelected && styles.categoryTitleSelected,
                          ]}
                        >
                          {category.title}
                        </Text>

                        <Text
                          style={[
                            styles.categoryShortLabel,
                            isSelected && styles.categoryShortLabelSelected,
                          ]}
                        >
                          {category.shortLabel}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.categoryDescription,
                          isSelected && styles.categoryDescriptionSelected,
                        ]}
                      >
                        {category.description}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.checkCircle,
                        isSelected && styles.checkCircleSelected,
                      ]}
                    >
                      {isSelected && <Text style={styles.checkText}>✓</Text>}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Sources stay separated.</Text>
            <Text style={styles.noteText}>
              Manual assets remain editable. Broker-synced assets are read-only
              and updated through WealthAPI sync.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.primaryButton,
              selectedCount === 0 && styles.primaryButtonDisabled,
            ]}
            disabled={selectedCount === 0}
            onPress={() => router.replace("/(tabs)/wealth" as any)}
          >
            <Text style={styles.primaryButtonText}>Enter Elara</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function CategoryIcon({
  type,
  selected,
}: {
  type: AssetCategory;
  selected: boolean;
}) {
  const color = selected ? "#050505" : "#FFFFFF";

  if (type === "bank") {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.bankRoof, { borderBottomColor: color }]} />
        <View style={[styles.bankBase, { backgroundColor: color }]} />
        <View style={[styles.bankColumnOne, { backgroundColor: color }]} />
        <View style={[styles.bankColumnTwo, { backgroundColor: color }]} />
        <View style={[styles.bankColumnThree, { backgroundColor: color }]} />
      </View>
    );
  }

  if (type === "broker") {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.brokerFrame, { borderColor: color }]} />
        <View style={[styles.brokerLineOne, { backgroundColor: color }]} />
        <View style={[styles.brokerLineTwo, { backgroundColor: color }]} />
        <View style={[styles.brokerPoint, { backgroundColor: color }]} />
      </View>
    );
  }

  if (type === "etf") {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.marketAxisX, { backgroundColor: color }]} />
        <View style={[styles.marketAxisY, { backgroundColor: color }]} />
        <View style={[styles.marketBarOne, { backgroundColor: color }]} />
        <View style={[styles.marketBarTwo, { backgroundColor: color }]} />
        <View style={[styles.marketBarThree, { backgroundColor: color }]} />
      </View>
    );
  }

  if (type === "crypto") {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.cryptoCoin, { borderColor: color }]}>
          <Text style={[styles.cryptoText, { color }]}>₿</Text>
        </View>
      </View>
    );
  }

  if (type === "bond") {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.bondPaper, { borderColor: color }]} />
        <View style={[styles.bondLineOne, { backgroundColor: color }]} />
        <View style={[styles.bondLineTwo, { backgroundColor: color }]} />
        <View style={[styles.bondSeal, { backgroundColor: color }]} />
      </View>
    );
  }

  if (type === "realEstate") {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.houseRoof, { borderBottomColor: color }]} />
        <View style={[styles.houseBody, { borderColor: color }]} />
        <View style={[styles.houseDoor, { backgroundColor: color }]} />
      </View>
    );
  }

  if (type === "physical") {
    return (
      <View style={styles.iconCanvas}>
        <View style={[styles.assetBox, { borderColor: color }]} />
        <View style={[styles.assetSparkOne, { backgroundColor: color }]} />
        <View style={[styles.assetSparkTwo, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View style={styles.iconCanvas}>
      <View style={[styles.otherDotOne, { backgroundColor: color }]} />
      <View style={[styles.otherDotTwo, { backgroundColor: color }]} />
      <View style={[styles.otherDotThree, { backgroundColor: color }]} />
    </View>
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
    width: "100%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingTop: 28,
    paddingBottom: 112,
  },

  headerBlock: {
    marginBottom: 24,
  },

  eyebrow: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2.8,
    marginBottom: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 41,
    fontWeight: "900",
    letterSpacing: -2.6,
  },

  subtitle: {
    marginTop: 16,
    color: "rgba(255,255,255,0.58)",
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "600",
    letterSpacing: -0.25,
  },

  importPanel: {
    marginBottom: 12,
    borderRadius: 32,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 18,
  },

  importEyebrow: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2.6,
  },

  importTitle: {
    marginTop: 4,
    marginBottom: 16,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.9,
  },

  brokerStatusCard: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brokerStatusLabel: {
    color: "rgba(255,255,255,0.52)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: -0.1,
  },

  brokerStatusValue: {
    marginTop: 4,
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  brokerStatusPill: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },

  brokerStatusPillText: {
    color: "#050505",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: -0.2,
  },

  importCard: {
    minHeight: 92,
    marginTop: 10,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  brokerImportCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },

  brokerImportCardTitle: {
    color: "#050505",
  },

  brokerImportCardText: {
    color: "rgba(0,0,0,0.58)",
  },

  brokerImportArrow: {
    color: "rgba(0,0,0,0.58)",
  },

  importCardDisabled: {
    opacity: 0.55,
  },

  importIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  importIconText: {
    color: "#050505",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  brokerImportIcon: {
    backgroundColor: "#050505",
  },

  brokerImportIconText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  importCopy: {
    flex: 1,
  },

  importCardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  importCardText: {
    marginTop: 5,
    color: "rgba(255,255,255,0.52)",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },

  importArrow: {
    color: "rgba(255,255,255,0.56)",
    fontSize: 22,
    fontWeight: "900",
  },

  mergerPanel: {
    borderRadius: 32,
    backgroundColor: "#F7F7F4",
    padding: 18,
  },

  mergerHeader: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mergerEyebrow: {
    color: "rgba(0,0,0,0.42)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2.6,
  },

  mergerTitle: {
    marginTop: 4,
    color: "#050505",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.9,
  },

  countPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#050505",
  },

  countText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  categoryList: {
    gap: 10,
  },

  categoryRow: {
    minHeight: 92,
    borderRadius: 24,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  categoryRowSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },

  categoryIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
  },

  categoryIconSelected: {
    backgroundColor: "#F0F0EC",
  },

  categoryCopy: {
    flex: 1,
  },

  categoryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  categoryTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  categoryTitleSelected: {
    color: "#050505",
  },

  categoryShortLabel: {
    color: "rgba(255,255,255,0.38)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  categoryShortLabelSelected: {
    color: "rgba(0,0,0,0.38)",
  },

  categoryDescription: {
    marginTop: 5,
    color: "rgba(255,255,255,0.52)",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },

  categoryDescriptionSelected: {
    color: "rgba(0,0,0,0.54)",
  },

  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
  },

  checkCircleSelected: {
    borderColor: "#050505",
    backgroundColor: "#050505",
  },

  checkText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  noteCard: {
    marginTop: 12,
    borderRadius: 26,
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
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 18,
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

  iconCanvas: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  bankRoof: {
    position: "absolute",
    top: 1,
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },

  bankBase: {
    position: "absolute",
    bottom: 2,
    width: 22,
    height: 3,
    borderRadius: 2,
  },

  bankColumnOne: {
    position: "absolute",
    bottom: 5,
    left: 5,
    width: 3,
    height: 10,
    borderRadius: 2,
  },

  bankColumnTwo: {
    position: "absolute",
    bottom: 5,
    left: 11,
    width: 3,
    height: 10,
    borderRadius: 2,
  },

  bankColumnThree: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 3,
    height: 10,
    borderRadius: 2,
  },

  brokerFrame: {
    width: 22,
    height: 17,
    borderRadius: 5,
    borderWidth: 2,
  },

  brokerLineOne: {
    position: "absolute",
    width: 10,
    height: 2.5,
    borderRadius: 2,
    transform: [{ rotate: "-25deg" }],
    left: 5,
    bottom: 8,
  },

  brokerLineTwo: {
    position: "absolute",
    width: 10,
    height: 2.5,
    borderRadius: 2,
    transform: [{ rotate: "25deg" }],
    right: 3,
    top: 7,
  },

  brokerPoint: {
    position: "absolute",
    right: 3,
    top: 5,
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  marketAxisX: {
    position: "absolute",
    left: 3,
    bottom: 4,
    width: 20,
    height: 2.5,
    borderRadius: 2,
  },

  marketAxisY: {
    position: "absolute",
    left: 3,
    bottom: 4,
    width: 2.5,
    height: 20,
    borderRadius: 2,
  },

  marketBarOne: {
    position: "absolute",
    left: 8,
    bottom: 6,
    width: 4,
    height: 8,
    borderRadius: 2,
  },

  marketBarTwo: {
    position: "absolute",
    left: 14,
    bottom: 6,
    width: 4,
    height: 13,
    borderRadius: 2,
  },

  marketBarThree: {
    position: "absolute",
    left: 20,
    bottom: 6,
    width: 4,
    height: 17,
    borderRadius: 2,
  },

  cryptoCoin: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },

  cryptoText: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: -1,
  },

  bondPaper: {
    width: 20,
    height: 23,
    borderRadius: 5,
    borderWidth: 2,
  },

  bondLineOne: {
    position: "absolute",
    top: 7,
    width: 11,
    height: 2,
    borderRadius: 1,
  },

  bondLineTwo: {
    position: "absolute",
    top: 12,
    width: 11,
    height: 2,
    borderRadius: 1,
  },

  bondSeal: {
    position: "absolute",
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  houseRoof: {
    position: "absolute",
    top: 1,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },

  houseBody: {
    position: "absolute",
    bottom: 3,
    width: 18,
    height: 14,
    borderWidth: 2,
    borderRadius: 3,
  },

  houseDoor: {
    position: "absolute",
    bottom: 3,
    width: 5,
    height: 8,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  assetBox: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 2,
    transform: [{ rotate: "45deg" }],
  },

  assetSparkOne: {
    position: "absolute",
    top: 2,
    right: 1,
    width: 5,
    height: 2,
    borderRadius: 2,
  },

  assetSparkTwo: {
    position: "absolute",
    top: 0,
    right: 3,
    width: 2,
    height: 5,
    borderRadius: 2,
  },

  otherDotOne: {
    position: "absolute",
    left: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  otherDotTwo: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  otherDotThree: {
    position: "absolute",
    right: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});