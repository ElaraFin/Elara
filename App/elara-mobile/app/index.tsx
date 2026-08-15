import {
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import { router } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppSession } from "../lib/app-session-store";

const heroVideo =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4";

export default function WelcomeScreen() {
  const { hasLoadedSession, hasCompletedSetup } = useAppSession();
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  const player = useVideoPlayer(heroVideo, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    player.loop = true;
    player.muted = true;
    player.play();
  }, [player]);

  useEffect(() => {
    if (hasLoadedSession && hasCompletedSetup) {
      router.replace("/(tabs)/wealth" as any);
    }
  }, [hasLoadedSession, hasCompletedSetup]);

  if (!fontsLoaded) {
    return <View style={styles.screen} />;
  }

  return (
    <View style={styles.screen}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />

      <View style={styles.darkOverlay} />

      <View style={styles.topBar}>
        <View style={styles.logoBox}>
          <Text style={styles.logo}>elara</Text>
        </View>

        <View style={styles.betaPill}>
          <Text style={styles.betaText}>Beta</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.kickerPill}>
          <Text style={styles.kicker}>Private beta</Text>
        </View>

        <View style={styles.titleBox}>
          <Text style={styles.title}>
            Quantitative finance,{"\n"}in your pocket.
          </Text>
        </View>

        <Text style={styles.subtitle}>
          Unify your wealth and optimize it with quantitative models and
          artificial intelligence.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/onboarding")}
        >
          <Text style={styles.primaryButtonText}>Start setup</Text>
          <Text style={styles.primaryArrow}>→</Text>
        </Pressable>
      </View>

      <View style={styles.bottomHint}>
        <Text style={styles.bottomHintText}>
          The future of wealth management for European investors.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050505",
  },

  video: {
    ...StyleSheet.absoluteFillObject,
    transform: [{ scale: 1.12 }],
  },

  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },

  topBar: {
    position: "absolute",
    top: 42,
    left: 28,
    right: 28,
    height: 56,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logoBox: {
    minWidth: 125,
    height: 52,
    justifyContent: "center",
    overflow: "visible",
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 34,
    fontFamily: "Inter_900Black",
    letterSpacing: -2.25,
  },

  betaPill: {
    height: 48,
    paddingHorizontal: 25,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.94)",
    alignItems: "center",
    justifyContent: "center",
  },

  betaText: {
    color: "#050505",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },

  content: {
    position: "absolute",
    left: 34,
    right: 30,
    top: 342,
    zIndex: 5,
  },

  kickerPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  kicker: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
  },

  titleBox: {
    marginTop: 30,
    overflow: "visible",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 49,
    lineHeight: 48,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -3.05,
  },

  subtitle: {
    marginTop: 30,
    maxWidth: 358,
    color: "rgba(255,255,255,0.90)",
    fontSize: 20,
    lineHeight: 25,
    fontFamily: "Inter_500Medium",
    letterSpacing: -0.72,
  },

  primaryButton: {
    marginTop: 42,
    height: 64,
    alignSelf: "flex-start",
    paddingHorizontal: 30,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  primaryButtonText: {
    color: "#050505",
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.42,
  },

  primaryArrow: {
    color: "#050505",
    fontSize: 25,
    fontFamily: "Inter_700Bold",
    marginTop: -1,
  },

  bottomHint: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 18,
    zIndex: 5,
    alignItems: "center",
  },

  bottomHintText: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.15,
    textAlign: "center",
  },
});