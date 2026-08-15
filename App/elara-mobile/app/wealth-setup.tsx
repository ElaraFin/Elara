import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

export default function WealthSetupScreen() {
  const [selectedCategories, setSelectedCategories] = useState<AssetCategory[]>([
    "bank",
    "broker",
    "etf",
  ]);

  function toggleCategory(category: AssetCategory) {
    setSelectedCategories((current) => {
      if (current.includes(category)) {
        return current.filter((item) => item !== category);
      }

      return [...current, category];
    });
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
            <Text style={styles.eyebrow}>MANUAL WEALTH INPUT</Text>

            <Text style={styles.title}>
              Choose your{"\n"}first asset sources.
            </Text>

            <Text style={styles.subtitle}>
              Select the categories you want to map first. Elara will merge them
              into one portfolio view.
            </Text>
          </View>

          <View style={styles.mergerPanel}>
            <View style={styles.mergerHeader}>
              <View>
                <Text style={styles.mergerEyebrow}>MERGER MODULE</Text>
                <Text style={styles.mergerTitle}>Manual import</Text>
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
            <Text style={styles.noteTitle}>You can update this later.</Text>
            <Text style={styles.noteText}>
              The MVP starts with manual data. Bank and broker connections can
              be added later through WealthAPI.
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
            onPress={() => router.replace("/(tabs)/wealth")}
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
    paddingBottom: 96,
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