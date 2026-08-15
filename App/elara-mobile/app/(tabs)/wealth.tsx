import { useAppSession } from "../../lib/app-session-store";
import { normalizePortfolio } from "../../lib/portfolio-normalizer";
import { AssetType, ElaraAsset, usePortfolio } from "../../lib/portfolio-store";
import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const assetLabels: Record<AssetType, string> = {
  cash: "Cash",
  etf: "ETF",
  stock: "Stocks",
  crypto: "Crypto",
  bond: "Bonds",
  real_estate: "Real estate",
  physical_asset: "Physical assets",
  other: "Other",
};

type WealthStyles = {
  screen: ViewStyle;
  content: ViewStyle;
  topBar: ViewStyle;
  logo: TextStyle;
  screenLabel: TextStyle;
  addButton: ViewStyle;
  addButtonText: TextStyle;
  addButtonPlus: TextStyle;
  heroCard: ViewStyle;
  heroLabel: TextStyle;
  heroValue: TextStyle;
  heroMetaRow: ViewStyle;
  heroMetaItem: ViewStyle;
  heroMetaValue: TextStyle;
  heroMetaLabel: TextStyle;
  heroDivider: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  sectionHint: TextStyle;
  card: ViewStyle;
  emptyText: TextStyle;
  allocationRow: ViewStyle;
  allocationTopLine: ViewStyle;
  allocationName: TextStyle;
  allocationValue: TextStyle;
  progressTrack: ViewStyle;
  progressFill: ViewStyle;
  allocationWeight: TextStyle;
  assetList: ViewStyle;
  assetCard: ViewStyle;
  assetOpenArea: ViewStyle;
  assetIcon: ViewStyle;
  assetIconText: TextStyle;
  assetInfo: ViewStyle;
  assetName: TextStyle;
  assetMeta: TextStyle;
  assetValueBox: ViewStyle;
  assetValue: TextStyle;
  assetSource: TextStyle;
  deleteButton: ViewStyle;
  deleteButtonText: TextStyle;
  insightCard: ViewStyle;
  insightKicker: TextStyle;
  insightTitle: TextStyle;
  insightText: TextStyle;
  normalizedCard: ViewStyle;
  normalizedKicker: TextStyle;
  normalizedTitle: TextStyle;
  normalizedRow: ViewStyle;
  normalizedLabel: TextStyle;
  normalizedValue: TextStyle;
  normalizedText: TextStyle;
};

function formatCurrency(value: number, currency = "EUR") {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function getAssetInitial(asset: ElaraAsset) {
  return asset.name.trim().charAt(0).toUpperCase();
}

export default function WealthScreen() {
  const { assets, totalNetWorth, deleteAsset } = usePortfolio();
  const { completeSetup } = useAppSession();

  const normalizedPortfolio = useMemo(() => {
    return normalizePortfolio(assets);
  }, [assets]);

  useEffect(() => {
    completeSetup();
  }, [completeSetup]);

  function handleDeleteAsset(assetId: string, assetName: string) {
    Alert.alert(
      "Delete asset",
      `Remove ${assetName} from your local portfolio?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAsset(assetId),
        },
      ]
    );
  }

  function handleEditAsset(assetId: string) {
    router.push({
      pathname: "/edit-asset",
      params: { assetId },
    } as any);
  }

  const allocation = useMemo(() => {
    const grouped = assets.reduce<Record<string, number>>((acc, asset) => {
      acc[asset.asset_type] = (acc[asset.asset_type] ?? 0) + asset.current_value;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([type, value]) => ({
        type: type as AssetType,
        value,
        weight: totalNetWorth > 0 ? value / totalNetWorth : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [assets, totalNetWorth]);

  const largestAsset = useMemo(() => {
    if (assets.length === 0 || totalNetWorth <= 0) {
      return null;
    }

    const sorted = [...assets].sort(
      (a, b) => b.current_value - a.current_value
    );

    return {
      asset: sorted[0],
      weight: sorted[0].current_value / totalNetWorth,
    };
  }, [assets, totalNetWorth]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>elara</Text>
          <Text style={styles.screenLabel}>Wealth dashboard</Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push("/add-asset" as any)}
        >
          <Text style={styles.addButtonText}>Add asset</Text>
          <Text style={styles.addButtonPlus}>＋</Text>
        </Pressable>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Total net worth</Text>
        <Text style={styles.heroValue}>{formatCurrency(totalNetWorth)}</Text>

        <View style={styles.heroMetaRow}>
          <View style={styles.heroMetaItem}>
            <Text style={styles.heroMetaValue}>{assets.length}</Text>
            <Text style={styles.heroMetaLabel}>Assets</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetaItem}>
            <Text style={styles.heroMetaValue}>
              {largestAsset ? `${Math.round(largestAsset.weight * 100)}%` : "0%"}
            </Text>
            <Text style={styles.heroMetaLabel}>Top exposure</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroMetaItem}>
            <Text style={styles.heroMetaValue}>{allocation.length}</Text>
            <Text style={styles.heroMetaLabel}>Classes</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Allocation</Text>
        <Text style={styles.sectionHint}>By asset class</Text>
      </View>

      <View style={styles.card}>
        {allocation.length === 0 ? (
          <Text style={styles.emptyText}>
            No assets yet. Add your first asset to build your portfolio.
          </Text>
        ) : (
          allocation.map((item) => {
            const progressWidth = `${Math.max(
              item.weight * 100,
              3
            )}%` as `${number}%`;

            return (
              <View key={item.type} style={styles.allocationRow}>
                <View style={styles.allocationTopLine}>
                  <Text style={styles.allocationName}>
                    {assetLabels[item.type]}
                  </Text>
                  <Text style={styles.allocationValue}>
                    {formatCurrency(item.value)}
                  </Text>
                </View>

                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: progressWidth }]} />
                </View>

                <Text style={styles.allocationWeight}>
                  {Math.round(item.weight * 100)}% of portfolio
                </Text>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Assets</Text>
        <Text style={styles.sectionHint}>Tap to edit</Text>
      </View>

      <View style={styles.assetList}>
        {assets.map((asset) => (
          <View key={asset.id} style={styles.assetCard}>
            <Pressable
              style={styles.assetOpenArea}
              onPress={() => handleEditAsset(asset.id)}
            >
              <View style={styles.assetIcon}>
                <Text style={styles.assetIconText}>
                  {getAssetInitial(asset)}
                </Text>
              </View>

              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>{asset.name}</Text>
                <Text style={styles.assetMeta}>
                  {assetLabels[asset.asset_type]} ·{" "}
                  {asset.provider ?? "Manual input"}
                </Text>
              </View>

              <View style={styles.assetValueBox}>
                <Text style={styles.assetValue}>
                  {formatCurrency(asset.current_value, asset.currency)}
                </Text>
                <Text style={styles.assetSource}>Edit</Text>
              </View>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleDeleteAsset(asset.id, asset.name)}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.normalizedCard}>
        <Text style={styles.normalizedKicker}>Portfolio integration</Text>
        <Text style={styles.normalizedTitle}>Normalized portfolio ready</Text>

        <View style={styles.normalizedRow}>
          <Text style={styles.normalizedLabel}>Base currency</Text>
          <Text style={styles.normalizedValue}>
            {normalizedPortfolio.base_currency}
          </Text>
        </View>

        <View style={styles.normalizedRow}>
          <Text style={styles.normalizedLabel}>Assets normalized</Text>
          <Text style={styles.normalizedValue}>
            {normalizedPortfolio.asset_count}
          </Text>
        </View>

        <View style={styles.normalizedRow}>
          <Text style={styles.normalizedLabel}>Asset classes</Text>
          <Text style={styles.normalizedValue}>
            {normalizedPortfolio.asset_class_count}
          </Text>
        </View>

        <View style={styles.normalizedRow}>
          <Text style={styles.normalizedLabel}>Data sources</Text>
          <Text style={styles.normalizedValue}>
            {normalizedPortfolio.data_sources.length > 0
              ? normalizedPortfolio.data_sources.join(", ")
              : "none"}
          </Text>
        </View>

        <Text style={styles.normalizedText}>
          This is the standardized portfolio object that will later be saved on
          Supabase and exposed through FastAPI.
        </Text>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightKicker}>Data layer</Text>
        <Text style={styles.insightTitle}>Manual import is now active</Text>
        <Text style={styles.insightText}>
          Every asset you add is stored in the local Elara portfolio structure.
          Next step: persist this same model on Supabase and expose it through
          FastAPI.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create<WealthStyles>({
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

  addButton: {
    height: 46,
    paddingLeft: 18,
    paddingRight: 14,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  addButtonText: {
    color: "#050505",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.25,
    marginRight: 8,
  },

  addButtonPlus: {
    color: "#050505",
    fontSize: 18,
    fontWeight: "900",
    marginTop: -1,
  },

  heroCard: {
    marginTop: 30,
    padding: 24,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
  },

  heroLabel: {
    color: "rgba(0,0,0,0.52)",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  heroValue: {
    marginTop: 10,
    color: "#050505",
    fontSize: 44,
    lineHeight: 48,
    fontWeight: "900",
    letterSpacing: -2.6,
  },

  heroMetaRow: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.10)",
    flexDirection: "row",
    alignItems: "center",
  },

  heroMetaItem: {
    flex: 1,
  },

  heroMetaValue: {
    color: "#050505",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  heroMetaLabel: {
    marginTop: 3,
    color: "rgba(0,0,0,0.46)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  heroDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(0,0,0,0.10)",
    marginHorizontal: 12,
  },

  sectionHeader: {
    marginTop: 30,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  sectionHint: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.15,
  },

  card: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  emptyText: {
    color: "rgba(255,255,255,0.54)",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  allocationRow: {
    marginBottom: 20,
  },

  allocationTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  allocationName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.25,
  },

  allocationValue: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  progressTrack: {
    marginTop: 10,
    height: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },

  allocationWeight: {
    marginTop: 7,
    color: "rgba(255,255,255,0.42)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  assetList: {},

  assetCard: {
    padding: 15,
    marginBottom: 12,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
  },

  assetOpenArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  assetIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  assetIconText: {
    color: "#050505",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  assetInfo: {
    flex: 1,
    marginLeft: 13,
  },

  assetName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.35,
  },

  assetMeta: {
    marginTop: 4,
    color: "rgba(255,255,255,0.46)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.15,
  },

  assetValueBox: {
    alignItems: "flex-end",
    marginLeft: 12,
  },

  assetValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.25,
  },

  assetSource: {
    marginTop: 4,
    color: "rgba(255,255,255,0.40)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: -0.1,
    textTransform: "uppercase",
  },

  deleteButton: {
    width: 32,
    height: 32,
    marginLeft: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 22,
  },

  normalizedCard: {
    marginTop: 28,
    padding: 20,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  normalizedKicker: {
    color: "rgba(255,255,255,0.44)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  normalizedTitle: {
    marginTop: 8,
    marginBottom: 16,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.65,
  },

  normalizedRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  normalizedLabel: {
    color: "rgba(255,255,255,0.48)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  normalizedValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  normalizedText: {
    marginTop: 14,
    color: "rgba(255,255,255,0.54)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.15,
  },

  insightCard: {
    marginTop: 28,
    padding: 20,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  insightKicker: {
    color: "rgba(255,255,255,0.44)",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },

  insightTitle: {
    marginTop: 8,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.65,
  },

  insightText: {
    marginTop: 10,
    color: "rgba(255,255,255,0.58)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.15,
  },
});