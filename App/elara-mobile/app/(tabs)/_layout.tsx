import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

function TabIcon({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) {
  return (
    <View
      style={{
        height: 46,
        minWidth: 78,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? "rgba(255,255,255,0.92)" : "transparent",
      }}
    >
      <Text
        style={{
          color: focused ? "#050505" : "rgba(255,255,255,0.54)",
          fontSize: 13,
          fontWeight: "900",
          letterSpacing: -0.25,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="wealth"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <BlurView
            intensity={36}
            tint="dark"
            style={{
              flex: 1,
              borderRadius: 999,
              overflow: "hidden",
              backgroundColor: "rgba(25,25,25,0.72)",
            }}
          />
        ),
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 18,
          height: 74,
          borderRadius: 999,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.12)",
          paddingTop: 13,
          paddingHorizontal: 8,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.36,
          shadowRadius: 30,
          elevation: 12,
          overflow: "hidden",
        },
      }}
    >
      <Tabs.Screen
        name="wealth"
        options={{
          title: "Wealth",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Wealth" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="copilot"
        options={{
          title: "Copilot",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Copilot" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="quant"
        options={{
          title: "Quant",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Quant" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Settings" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}