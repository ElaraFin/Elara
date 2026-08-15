import { calculatePortfolioAnalytics } from "../../lib/portfolio-analytics";
import { usePortfolio } from "../../lib/portfolio-store";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

function formatCurrency(value: number, currency = "EUR") {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function getHealthLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Balanced";
  if (score >= 45) return "Needs attention";
  if (score > 0) return "Fragile";
  return "No data";
}

export default function QuantScreen() {
  const { assets } = usePortfolio();

  const analytics = useMemo(() => {
    return calculatePortfolioAnalytics(assets);
  }, [assets]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>elara</Text>
          <Text style={styles.screenLabel}>Quant engine</Text>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>Local model</Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.kicker}>Portfolio analytics</Text>
        <Text style={styles.title}>Health score</Text>
        <Text style={styles.subtitle}>
          A first quantitative layer based on allocation, concentration,
          liquidity and risk balance.
        </Text>
      </View>

      <View style={styles.scoreCard}>
        <View>
          <Text style={styles.scoreLabel}>Portfolio Health Score</Text>
          <Text style={styles.scoreValue}>{analytics.healthScore}</Text>
          <Text style={styles.scoreCaption}>
            {getHealthLabel(analytics.healthScore)}
          </Text>
        </View>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreCircleText}>{analytics.healthScore}</Text>
          <Text style={styles.scoreCircleSub}>/100</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {formatCurrency(analytics.totalNetWorth)}
          </Text>
          <Text style={styles.metricLabel}>Net worth</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{analytics.assetCount}</Text>
          <Text style={styles.metricLabel}>Assets</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{analytics.assetClassCount}</Text>
          <Text style={styles.metricLabel}>Asset classes</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>
            {analytics.weightedRiskScore.toFixed(1)}
          </Text>
          <Text style={styles.metricLabel}>Risk score</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Core signals</Text>
        <Text style={styles.sectionHint}>0–100 scale</Text>
      </View>

      <View style={styles.card}>
        <SignalRow
          label="Diversification"
          value={analytics.diversificationScore}
        />
        <SignalRow
          label="Concentration"
          value={analytics.concentrationScore}
        />
        <SignalRow label="Liquidity" value={analytics.liquidityScore} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Exposure</Text>
        <Text style={styles.sectionHint}>Key weights</Text>
      </View>

      <View style={styles.exposureGrid}>
        <View style={styles.exposureCard}>
          <Text style={styles.exposureValue}>
            {formatPercent(analytics.largestAssetWeight)}
          </Text>
          <Text style={styles.exposureLabel}>Largest asset</Text>
          <Text style={styles.exposureSub}>
            {analytics.largestAssetName ?? "No asset yet"}
          </Text>
        </View>

        <View style={styles.exposureCard}>
          <Text style={styles.exposureValue}>
            {formatPercent(analytics.cashWeight)}
          </Text>
          <Text style={styles.exposureLabel}>Cash</Text>
          <Text style={styles.exposureSub}>Liquidity buffer</Text>
        </View>

        <View style={styles.exposureCard}>
          <Text style={styles.exposureValue}>
            {formatPercent(analytics.cryptoWeight)}
          </Text>
          <Text style={styles.exposureLabel}>Crypto</Text>
          <Text style={styles.exposureSub}>High-volatility sleeve</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Allocation</Text>
        <Text style={styles.sectionHint}>By asset class</Text>
      </View>

      <View style={styles.card}>
        {analytics.allocation.length === 0 ? (
          <Text style={styles.emptyText}>
            Add your first asset in the Wealth tab to activate the Quant Engine.
          </Text>
        ) : (
          analytics.allocation.map((item) => {
            const width = `${Math.max(item.weight * 100, 4)}%` as any;

            return (
              <View key={item.type} style={styles.allocationRow}>
                <View style={styles.allocationTopLine}>
                  <Text style={styles.allocationName}>{item.label}</Text>
                  <Text style={styles.allocationValue}>
                    {formatPercent(item.weight)}
                  </Text>
                </View>

                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width }]} />
                </View>

                <Text style={styles.allocationAmount}>
                  {formatCurrency(item.value)}
                </Text>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Detected risks</Text>
        <Text style={styles.sectionHint}>Non-binding</Text>
      </View>

      <View style={styles.card}>
        {analytics.mainRisks.map((risk, index) => (
          <View key={`${risk}-${index}`} style={styles.riskRow}>
            <View style={styles.riskDot} />
            <Text style={styles.riskText}>{risk}</Text>
          </View>
        ))}
      </View>

      <View style={styles.disclaimerCard}>
        <Text style={styles.disclaimerTitle}>Model note</Text>
        <Text style={styles.disclaimerText}>
          This is a lightweight local model for MVP validation. It is not
          financial advice and does not replace a regulated advisor. The score
          explains portfolio structure, not expected performance.
        </Text>
      </View>
    </ScrollView>
  );
}

function SignalRow({ label, value }: { label: string; value: number }) {
  const width = `${Math.max(value, 3)}%` as any;

  return (
    <View style={styles.signalRow}>
      <View style={styles.signalTopLine}>
        <Text style={styles.signalLabel}>{label}</Text>
        <Text style={styles.signalValue}>{value}/100</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width }]} />
      </View>
    </View>
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

  statusPill: {
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: -0.15,
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

  scoreCard: {
    marginTop: 28,
    padding: 24,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  scoreLabel: {
    color: "rgba(0,0,0,0.52)",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  scoreValue: {
    marginTop: 8,
    color: "#050505",
    fontSize: 58,
    lineHeight: 62,
    fontWeight: "900",
    letterSpacing: -3.4,
  },

  scoreCaption: {
    marginTop: 4,
    color: "rgba(0,0,0,0.50)",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.25,
  },

  scoreCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
  },

  scoreCircleText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1,
  },

  scoreCircleSub: {
    marginTop: -2,
    color: "rgba(255,255,255,0.48)",
    fontSize: 12,
    fontWeight: "800",
  },

  metricsGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  metricCard: {
    width: "48.5%",
    marginTop: 12,
    padding: 17,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  metricValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.75,
  },

  metricLabel: {
    marginTop: 6,
    color: "rgba(255,255,255,0.46)",
    fontSize: 13,
    fontWeight: "700",
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

  signalRow: {
    marginBottom: 20,
  },

  signalTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  signalLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.25,
  },

  signalValue: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  exposureGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  exposureCard: {
    width: "31.5%",
    padding: 15,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.075)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  exposureValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -1,
  },

  exposureLabel: {
    marginTop: 7,
    color: "rgba(255,255,255,0.66)",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  exposureSub: {
    marginTop: 5,
    color: "rgba(255,255,255,0.38)",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    letterSpacing: -0.1,
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

  allocationAmount: {
    marginTop: 7,
    color: "rgba(255,255,255,0.42)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.1,
  },

  emptyText: {
    color: "rgba(255,255,255,0.54)",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  riskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  riskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    marginTop: 6,
    marginRight: 12,
  },

  riskText: {
    flex: 1,
    color: "rgba(255,255,255,0.68)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.15,
  },

  disclaimerCard: {
    marginTop: 28,
    padding: 20,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.055)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  disclaimerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.55,
  },

  disclaimerText: {
    marginTop: 9,
    color: "rgba(255,255,255,0.52)",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.15,
  },
});