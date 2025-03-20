import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import "./global.css";

export default function Layout() {
  return (
    <SafeAreaProvider className="flex-1">
      <Toaster />
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "index") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "spent") {
              iconName = focused ? "wallet" : "wallet-outline";
            } else if (route.name === "categories") {
              iconName = focused ? "list" : "list-outline";
            }

            return (
              <Ionicons
                name={iconName as keyof typeof Ionicons.glyphMap}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: "#ADB2D4",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 60,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="spent"
          options={{
            title: "Spent",
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            title: "Categories",
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
