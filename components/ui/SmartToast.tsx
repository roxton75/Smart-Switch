import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

type SmartToastProps = {
  visible: boolean;
  type?: "success" | "error";
  title: string;
  message: string;
};

export default function SmartToast({
  visible,
  type = "success",
  title,
  message,
}: SmartToastProps) {
  const translateY = useRef(new Animated.Value(100)).current;

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          type === "error" ? styles.errorToast : styles.successToast,
        ]}
      >
        <Ionicons
          name={type === "error" ? "warning-outline" : "checkmark-circle"}
          size={22}
          color="#88B04B"
          style={styles.icon}
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    left: 20,
    right: 20,
    bottom: 100,

    zIndex: 9999,
  },

  toast: {
    flexDirection: "row",

    alignItems: "center",

    padding: 8,

    borderRadius: 18,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,

    shadowRadius: 6,

    elevation: 8,
  },

  icon: {
    marginLeft: 6,
  },

  successToast: {
    backgroundColor: COLORS.card,
  },

  errorToast: {
    backgroundColor: COLORS.card,
  },

  textContainer: {
    marginLeft: 12,
    flex: 1,
  },

  title: {
    color: COLORS.navy,
    fontWeight: "700",
    fontSize: 15,
  },

  message: {
    color: COLORS.inactive,
    fontSize: 12,
    marginTop: 1,
  },
});
