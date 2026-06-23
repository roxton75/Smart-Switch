import { FONTS } from "@/constants/fonts";
import { COLORS } from "constants/theme";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text } from "react-native";

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;

  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslateY = useRef(new Animated.Value(20)).current;

  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1.03,
          duration: 800,
          useNativeDriver: true,
        }),

        Animated.timing(bottomOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),

        Animated.timing(bottomTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1500);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: screenOpacity,
        },
      ]}
    >
      <Animated.Image
        source={require("@/assets/images/logo.png")}
        resizeMode="contain"
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.devnoxContainer,
          {
            opacity: bottomOpacity,
            transform: [
              {
                translateY: bottomTranslateY,
              },
            ],
          },
        ]}
      >
        <Text style={styles.developedBy}>Developed by</Text>

        <Image
          source={require("@/assets/images/devnox.png")}
          resizeMode="contain"
          style={styles.devnoxLogo}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: COLORS.background,

    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 440,
    height: 280,
  },

  devnoxContainer: {
    position: "absolute",

    bottom: 60,

    alignItems: "center",
  },

  developedBy: {
    fontSize: 14,

    fontFamily: FONTS.semiBold,

    color: "#b6b6b6",
    paddingLeft: 23,
    marginTop: 12,
  },

  devnoxLogo: {
    width: 150,
    height: 70,
  },
});
