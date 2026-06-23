import {
  Animated,
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { COLORS } from "@/constants/theme";
import { toggleRelayState } from "@/services/relayService";
import { Ionicons } from "@expo/vector-icons";
import { FONTS } from "constants/fonts";
import { useEffect, useRef, useState } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;

type DeviceCardProps = {
  relayId: string;

  name: string;

  type: "light" | "fan" | "socket";
  state: boolean;
  onPress?: () => void;
};

export default function DeviceCard({
  relayId,
  name,
  type,
  state,
  onPress,
}: DeviceCardProps) {
  //const [displayState, setIsOn] = useState(false);

  const [displayState, setDisplayState] = useState(state);

  useEffect(() => {
    setDisplayState(state);
  }, [state]);

  const [loading, setLoading] = useState(false);
  const dotsOpacity = useRef(new Animated.Value(0.3)).current;
  const getImage = () => {
    switch (type) {
      case "light":
        return require("@/assets/images/light.png");

      case "fan":
        return require("@/assets/images/fan.png");

      case "socket":
        return require("@/assets/images/socket.png");

      default:
        return require("@/assets/images/light.png");
    }
  };

  const getIcon = () => {
    switch (type) {
      case "light":
        return "bulb-outline";

      case "fan":
        return "snow-outline";

      case "socket":
        return "flash-outline";

      default:
        return "bulb-outline";
    }
  };

  const handleToggle = async () => {
    if (loading) return;

    const previousState = displayState;
    const nextState = !displayState;

    setDisplayState(nextState); // instant UI update
    setLoading(true);

    try {
      await toggleRelayState(relayId, previousState);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // console.log(error);

      // rollback if write fails
      setDisplayState(previousState);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    let animation: Animated.CompositeAnimation;

    if (loading) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(dotsOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),

          Animated.timing(dotsOpacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );

      animation.start();
    } else {
      dotsOpacity.setValue(1);
    }

    return () => {
      animation?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <Pressable
      onPress={handleToggle}
      style={[styles.card, displayState && styles.activeCard]}
    >
      <ImageBackground
        source={getImage()}
        resizeMode="cover"
        imageStyle={{
          borderRadius: 12,
        }}
        style={styles.image}
      >
        <View
          style={[
            styles.topIcon,

            {
              backgroundColor: displayState ? "#EEF8D9" : "#F3F3F3",

              borderColor: displayState ? COLORS.primary : "#DCDCDC",
            },
          ]}
        >
          <Animated.View
            style={{
              opacity: loading ? dotsOpacity : 1,
            }}
          >
            <Ionicons
              name={getIcon()}
              size={18}
              color={displayState ? COLORS.primary : COLORS.inactive}
            />
          </Animated.View>
        </View>
        <View style={styles.overlay}>
          <Text style={styles.name}>{name}</Text>

          <View
            style={[
              styles.badge,
              displayState ? styles.onBadge : styles.offBadge,
            ]}
          >
            {loading ? (
              <Animated.Text
                style={[
                  styles.loadingDots,

                  {
                    opacity: dotsOpacity,

                    color: displayState ? "#FFFFFF" : COLORS.navy,
                  },
                ]}
              >
                •••
              </Animated.Text>
            ) : (
              <Text
                style={[
                  styles.badgeText,

                  {
                    color: displayState ? "#FFFFFF" : COLORS.navy,
                  },
                ]}
              >
                {displayState ? "ON" : "OFF"}
              </Text>
            )}
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: (SCREEN_WIDTH - 60) / 2,
    height: 170,

    borderRadius: 24,

    overflow: "hidden",

    borderWidth: 2,

    borderColor: COLORS.lightBorder,

    backgroundColor: "#FFF",
  },

  activeCard: {
    borderColor: COLORS.primary,
  },

  image: {
    flex: 1,

    justifyContent: "flex-end",
  },

  overlay: {
    padding: 12,
  },
  topIcon: {
    position: "absolute",

    top: 12,
    left: 12,

    width: 34,
    height: 34,

    borderRadius: 999,

    backgroundColor: "#F3F3F3",

    borderWidth: 1.5,

    borderColor: "#DCDCDC",

    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontFamily: FONTS.bold,

    color: COLORS.navy,
  },

  badge: {
    marginTop: 6,

    width: 52,
    height: 26,

    borderRadius: 999,

    justifyContent: "center",
    alignItems: "center",
  },

  onBadge: {
    backgroundColor: COLORS.primary,

    borderWidth: 1.5,

    borderColor: "#51791598",
  },

  offBadge: {
    backgroundColor: "#ECECEC",

    borderWidth: 1.5,

    borderColor: "#D0D0D0",
  },

  badgeText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    paddingBottom: 2,
  },

  loadingDots: {
    fontSize: 14,

    fontWeight: "900",

    letterSpacing: 1,
  },
});
