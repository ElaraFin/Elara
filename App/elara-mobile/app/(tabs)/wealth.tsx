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
  sourcesCard: ViewStyle;
  sourcesHeader: ViewStyle;
  sourcesHeaderCopy: ViewStyle;
  sourcesKicker: TextStyle;
  sourcesTitle: TextStyle;
  manageSourcesButton: ViewStyle;
  manageSourcesButtonText: TextStyle;
  sourceRows: ViewStyle;
  sourceRow: ViewStyle;
  sourceRowLeft: ViewStyle;
  sourceBadge: ViewStyle;
  sourceBadgeText: TextStyle;
  sourceName: TextStyle;
  sourceDescription: TextStyle;
  sourceMetrics: ViewStyle;
  sourceValue: TextStyle;
  sourceCount: TextStyle;
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
  assetSourceRow: ViewStyle;
  sourcePill: ViewStyle;
  sourcePillSynced: ViewStyle;
  sourcePillText: TextStyle;
  sourcePillTextSynced: TextStyle;
  assetValueBox: ViewStyle;
  assetValue: TextStyle;
  assetSource: TextStyle;
  deleteButton: ViewStyle;
  deleteButtonText: TextStyle;
  lockedButton: ViewStyle;
  lockedButtonText: TextStyle;
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

type SourceSummaryItem = {
  key: string;
  label: string;
  description: string;
  badge: string;
  count: number;
  value: number;
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

function isBrokerSyncedAsset(asset: ElaraAsset) {
  return asset.source === "wealth_api";
}

function getAssetSourceLabel(asset: ElaraAsset) {
  if (asset.source === "wealth_api") {
    return asset.provider ? `Broker sync · ${asset.provider}` : "Broker sync";
  }

  if (asset.source === "pdf") {
    return asset.provider ? `PDF import · ${asset.provider}` : "PDF import";
  }

  return asset.provider ?? "Manual input";
}

function getAssetActionLabel(asset: ElaraAsset) {
  if (asset.source === "wealth_api") {
    return "Synced";
  }

  if (asset.source === "pdf") {
    return "Imported";
  }

  return "Edit";
}

function sumAssetValues(assets: ElaraAsset[]) {
  return assets.reduce((total, asset) => total + asset.current_value, 0);
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

  function handleDeleteAsset(asset: ElaraAsset) {
    if (isBrokerSyncedAsset(asset)) {
      Alert.alert(
        "Broker synced asset",
        "This asset comes from a broker connection and cannot be deleted individually. In the real WealthAPI flow, imported assets will be removed by disconnecting or refreshing the broker sync."
      );
      return;
    }

    Alert.alert("Delete asset", `Remove ${asset.name} from your portfolio?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteAsset(asset.id),
      },
    ]);
  }

  function handleOpenAsset(asset: ElaraAsset) {
    if (isBrokerSyncedAsset(asset)) {
      Alert.alert(
        "Broker synced asset",
        "This asset is imported from WealthAPI and is read-only. Its value should be updated through the broker sync, not edited manually."
      );
      return;
    }

    router.push({
      pathname: "/edit-asset",
      params: { assetId: asset.id },
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

  const sourceSummary = useMemo<SourceSummaryItem[]>(() => {
    const manualAssets = assets.filter((asset) => asset.source === "manual");
    const brokerAssets = assets.filter((asset) => asset.source === "wealth_api");
    const pdfAssets = assets.filter((asset) => asset.source === "pdf");
    const otherAssets = assets.filter(
      (asset) =>
        asset.source !== "manual" &&
        asset.source !== "wealth_api" &&
        asset.source !== "pdf"
    );

    return [
      {
        key: "manual",
        label: "Manual input",
        description: "Editable assets added by the user.",
        badge: "MAN",
        count: manualAssets.length,
        value: sumAssetValues(manualAssets),
      },
      {
        key: "broker",
        label: "Broker sync",
        description: "Read-only assets imported through WealthAPI.",
        badge: "WA",
        count: brokerAssets.length,
        value: sumAssetValues(brokerAssets),
      },
      {
        key: "pdf",
        label: "PDF import",
        description: "Assets parsed from statements and documents.",
        badge: "PDF",
        count: pdfAssets.length,
        value: sumAssetValues(pdfAssets),
      },
      {
        key: "other",
        label: "Other sources",
        description: "Fallback source for future integrations.",
        badge: "API",
        count: otherAssets.length,
        value: sumAssetValues(otherAssets),
      },
    ];
  }, [assets]);

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

      <View style={styles.sourcesCard}>
        <View style={styles.sourcesHeader}>
          <View style={styles.sourcesHeaderCopy}>
            <Text style={styles.sourcesKicker}>Connected sources</Text>
            <Text style={styles.sourcesTitle}>Where your wealth data comes from</Text>
          </View>

          <Pressable
            style={styles.manageSourcesButton}
            onPress={() => router.push("/wealth-setup" as any)}
          >
            <Text style={styles.manageSourcesButtonText}>Manage</Text>
          </Pressable>
        </View>

        <View style={styles.sourceRows}>
          {sourceSummary.map((source) => (
            <View key={source.key} style={styles.sourceRow}>
              <View style={styles.sourceRowLeft}>
                <View style={styles.sourceBadge}>
                  <Text style={styles.sourceBadgeText}>{source.badge}</Text>
                </View>

                <View>
                  <Text style={styles.sourceName}>{source.label}</Text>
                  <Text style={styles.sourceDescription}>
                    {source.description}
                  </Text>
                </View>
              </View>

              <View style={styles.sourceMetrics}>
                <Text style={styles.sourceValue}>
                  {formatCurrency(source.value)}
                </Text>
                <Text style={styles.sourceCount}>
                  {source.count} {source.count === 1 ? "asset" : "assets"}
                </Text>
              </View>
            </View>
          ))}
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
        <Text style={styles.sectionHint}>Manual assets can be edited</Text>
      </View>

      <View style={styles.assetList}>
        {assets.map((asset) => {
          const isSynced = isBrokerSyncedAsset(asset);

          return (
            <View key={asset.id} style={styles.assetCard}>
              <Pressable
                style={styles.assetOpenArea}
                onPress={() => handleOpenAsset(asset)}
              >
                <View style={styles.assetIcon}>
                  <Text style={styles.assetIconText}>
                    {getAssetInitial(asset)}
                  </Text>
                </View>

                <View style={styles.assetInfo}>
                  <Text style={styles.assetName}>{asset.name}</Text>

                  <Text style={styles.assetMeta}>
                    {assetLabels[asset.asset_type]} · {getAssetSourceLabel(asset)}
                  </Text>

                  <View style={styles.assetSourceRow}>
                    <View
                      style={[
                        styles.sourcePill,
                        isSynced && styles.sourcePillSynced,
                      ]}
                    >
                      <Text
                        style={[
                          styles.sourcePillText,
                          isSynced && styles.sourcePillTextSynced,
                        ]}
                      >
                        {isSynced ? "WealthAPI" : "Manual"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.assetValueBox}>
                  <Text style={styles.assetValue}>
                    {formatCurrency(asset.current_value, asset.currency)}
                  </Text>
                  <Text style={styles.assetSource}>
                    {getAssetActionLabel(asset)}
                  </Text>
                </View>
              </Pressable>

              {isSynced ? (
                <View style={styles.lockedButton}>
                  <Text style={styles.lockedButtonText}>↻</Text>
                </View>
              ) : (
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDeleteAsset(asset)}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </Pressable>
              )}
            </View>
          );
        })}
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
          This is the standardized portfolio object used by Elara to combine
          manual assets, PDF imports, and broker synced assets into one wealth
          view.
        </Text>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightKicker}>Data layer</Text>
        <Text style={styles.insightTitle}>Portfolio sources are separated</Text>
        <Text style={styles.insightText}>
          Manual assets can be edited by the user. Broker synced assets are
          read-only and should be updated through the WealthAPI sync flow.
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

  sourcesCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  sourcesHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },

  sourcesHeaderCopy: {
    flex: 1,
  },

  sourcesKicker: {
    color: "rgba(255,255,255,0.44)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },

  sourcesTitle: {
    marginTop: 6,
    color: "#FFFFFF",
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "900",
    letterSpacing: -0.65,
  },

  manageSourcesButton: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  manageSourcesButtonText: {
    color: "#050505",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: -0.15,
  },

  sourceRows: {
    marginTop: 18,
    gap: 10,
  },

  sourceRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  sourceRowLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  sourceBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  sourceBadgeText: {
    color: "#050505",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: -0.1,
  },

  sourceName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: -0.25,
  },

  sourceDescription: {
    marginTop: 3,
    color: "rgba(255,255,255,0.44)",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  sourceMetrics: {
    alignItems: "flex-end",
  },

  sourceValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: -0.25,
  },

  sourceCount: {
    marginTop: 3,
    color: "rgba(255,255,255,0.40)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: -0.1,
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

  assetSourceRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  sourcePill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  sourcePillSynced: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderColor: "rgba(255,255,255,0.22)",
  },

  sourcePillText: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },

  sourcePillTextSynced: {
    color: "#FFFFFF",
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

  lockedButton: {
    width: 32,
    height: 32,
    marginLeft: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  lockedButtonText: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 20,
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