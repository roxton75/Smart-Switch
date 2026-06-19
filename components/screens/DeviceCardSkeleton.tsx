import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function DeviceCardSkeleton() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity,
        },
      ]}
    >
      <View style={styles.iconPlaceholder} />

      <View style={styles.textLarge} />

      <View style={styles.textSmall} />

      <View style={styles.badgePlaceholder} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: (SCREEN_WIDTH - 60) / 2,
    height: 170,

    borderRadius: 24,

    backgroundColor: "#EFEFEF",

    borderWidth: 2.5,

    borderColor: "#E3E3E3",

    padding: 12,

    justifyContent: "space-between",
  },

  iconPlaceholder: {
    width: 42,
    height: 42,

    borderRadius: 999,

    backgroundColor: "#D9D9D9",

    alignSelf: "flex-end",
  },

  textLarge: {
    width: "70%",
    height: 16,

    borderRadius: 8,

    backgroundColor: "#D9D9D9",
  },

  textSmall: {
    width: "45%",
    height: 12,

    borderRadius: 8,

    backgroundColor: "#D9D9D9",

    marginTop: -20,
  },

  badgePlaceholder: {
    width: 52,
    height: 26,

    borderRadius: 999,

    backgroundColor: "#D9D9D9",
  },
});
