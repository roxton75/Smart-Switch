import { COLORS } from "@/constants/theme";

import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "PlusJakarta-Bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),

    "PlusJakarta-ExtraBold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),

    "Manrope-Regular": require("@/assets/fonts/Manrope-Regular.ttf"),

    "Manrope-Medium": require("@/assets/fonts/Manrope-Medium.ttf"),

    "Manrope-SemiBold": require("@/assets/fonts/Manrope-SemiBold.ttf"),

    "Manrope-Bold": require("@/assets/fonts/Manrope-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <>
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: COLORS.background }}
      >
        <StatusBar style="dark" backgroundColor={COLORS.background} />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splash" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <Toast />
      </GestureHandlerRootView>
    </>
  );
}
