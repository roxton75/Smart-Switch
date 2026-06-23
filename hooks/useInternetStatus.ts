import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

export default function useInternetStatus() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected =
        state.isConnected && state.isInternetReachable !== false;

      if (!connected) {
        Toast.show({
          type: "error",
          text1: "No Internet Connection",
          text2: "Please turn on WiFi or Mobile Data.",
          visibilityTime: 3000,
        });
      }
    });

    return unsubscribe;
  }, []);
}
