import { COLORS } from "@/constants/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor={COLORS.background} />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />

        <Stack.Screen name="(tabs)" />
      </Stack>
      <Toast />
    </>
  );
}
