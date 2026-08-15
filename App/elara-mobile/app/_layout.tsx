import { AppSessionProvider } from "../lib/app-session-store";
import { PortfolioProvider } from "../lib/portfolio-store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AppSessionProvider>
      <PortfolioProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#050505" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="create-account" />
          <Stack.Screen name="wealth-setup" />
          <Stack.Screen name="add-asset" />
          <Stack.Screen name="edit-asset" />
          <Stack.Screen name="(tabs)" />
        </Stack>

        <StatusBar style="light" />
      </PortfolioProvider>
    </AppSessionProvider>
  );
}