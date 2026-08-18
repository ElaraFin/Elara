import { Stack } from "expo-router";

import { AppSessionProvider } from "../lib/app-session-store";
import { AuthProvider } from "../lib/auth-store";
import { PortfolioProvider } from "../lib/portfolio-store";

export default function RootLayout() {
  return (
    <AppSessionProvider>
      <AuthProvider>
        <PortfolioProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="create-account" />
            <Stack.Screen name="wealth-setup" />
            <Stack.Screen name="add-asset" />
            <Stack.Screen name="edit-asset" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </PortfolioProvider>
      </AuthProvider>
    </AppSessionProvider>
  );
}