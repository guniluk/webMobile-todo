import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <Stack
          screenOptions={{
            headerShown: true,
          }}
        >
          <Stack.Screen
            name="index"
            options={{ headerShown: false, title: "Home" }}
          />
          <Stack.Screen name="about" options={{ title: "About page" }} />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "Tabs" }}
          />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
