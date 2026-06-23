import { COLORS, RADIUS, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

import Animated, { LinearTransition } from "react-native-reanimated";

import { FONTS } from "@/constants/fonts";
import { removeRelay } from "@/services/relayService";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ChannelDetails from "./ChannelDetails";
import SmartModal from "./ui/SmartModal";

type Props = {
  relayId: string;
  relay: any;

  expanded: boolean;

  onPress: () => void;
  onEditRelay: (relay: any) => void;
  onConfigureRelay: (relay: any) => void;
};

export default function ChannelCard({
  relayId,
  relay,
  expanded,
  onPress,
  onEditRelay,
   onConfigureRelay,
}: Props) {
  const active = relay.state;
  const assigned = relay.assigned;
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removing, setRemoving] = useState(false);
  const handleRemove = () => {
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    try {
      setShowRemoveModal(false);

      setRemoving(true);

      await removeRelay(relayId);

      setRemoving(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // console.log(error);

      setRemoving(false);
    }
  };

  const getIcon = () => {
    switch (relay.type) {
      case "light":
        return "bulb-outline";

      case "fan":
        return "snow-outline";

      case "socket":
        return "power-outline";

      default:
        return "add-circle-outline";
    }
  };

  return (
    <Animated.View
      layout={LinearTransition.springify()}
      style={[
        styles.card,
        active && styles.activeCard,
        !assigned && styles.unassignedCard,
      ]}
    >
      <Pressable onPress={onPress}>
        <View style={{ padding: SPACING.md }}>
          <View style={styles.header}>
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={getIcon()}
                  size={28}
                  color={active ? COLORS.primary : COLORS.inactive}
                />
              </View>

              <View>
                <Text style={styles.title}>
                  {assigned ? relay.name : relayId.replace("_", " ")}
                </Text>

                <Text style={styles.subtitle}>
                  {assigned ? relay.location : "No Device Assigned"}
                </Text>

                {assigned && (
                  <View style={styles.pillRow}>
                    <View style={styles.typePill}>
                      <Text style={styles.statePillText}>
                        {relay.type.toUpperCase()}
                      </Text>
                    </View>
                    <View
                      style={[styles.statePill, relay.state && styles.stateOn]}
                    >
                      <Text
                        style={[
                          styles.typePillText,
                          relay.state && styles.stateOnText,
                        ]}
                      >
                        {relay.state ? "ON" : "OFF"}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={22}
              color={COLORS.navy}
            />
          </View>

          {expanded && assigned && (
            <View style={styles.detailsContainer}>
              <ChannelDetails
                relayId={relayId}
                relay={relay}
                onRemove={() => handleRemove()}
                onEdit={() =>
                  onEditRelay({
                    relayId,
                    relay,
                  })
                }
              />
            </View>
          )}

          {/* {expanded && !assigned && (
            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  color: COLORS.grey,
                  fontFamily: FONTS.medium,
                }}
              >
                This channel is not configured yet.
              </Text>
            </View>
          )} */}
          {expanded && !assigned && (
            <View style={styles.detailsContainer}>
              <ChannelDetails
                relayId={relayId}
                relay={relay}
                onRemove={() => {}}
                onEdit={() => {}}
                onConfigure={() =>
                  onConfigureRelay({
                    relayId,
                    relay,
                  })
                }
                unassigned
              />
            </View>
          )}
        </View>
      </Pressable>
      <SmartModal
        visible={showRemoveModal}
        type="confirm"
        title="Remove Device"
        message={`Remove ${relay.name} from this channel?`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemove}
        onCancel={() => setShowRemoveModal(false)}
      />

      <SmartModal
        visible={removing}
        type="loading"
        title="Removing Device"
        message="Please wait..."
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F1F1F6",

    borderRadius: RADIUS.md,

    borderWidth: 2,

    borderColor: COLORS.lightBorder,
    overflow: "hidden",
    marginBottom: 12,
  },

  cardBackground: {
    flex: 1,
  },

  cardBackgroundImage: {
    borderRadius: RADIUS.md,
    opacity: 0.55,
  },

  activeCard: {
    borderColor: COLORS.primary,
  },

  unassignedCard: {
    borderStyle: "dotted",
  },

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  left: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,
  },

  title: {
    fontSize: 16,

    fontFamily: FONTS.bold,

    color: COLORS.navy,
  },

  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,

    color: COLORS.grey,
  },
  iconCircle: {
    width: 48,

    height: 48,

    borderWidth: 2,

    borderColor: COLORS.lightBorder,

    marginRight: 4,

    borderRadius: 999,

    justifyContent: "center",

    alignItems: "center",
  },

  pillRow: {
    flexDirection: "row",

    gap: 6,

    marginTop: 8,
  },

  typePill: {
    width: 64,
    paddingVertical: 2,

    alignItems: "center",

    borderRadius: 999,

    backgroundColor: "#F3F3F3",

    borderWidth: 1,

    borderColor: "#E3E3E3",
  },

  statePill: {
    width: 42,
    alignItems: "center",
    paddingVertical: 2,
    borderRadius: 999,

    backgroundColor: "#F3F3F3",

    borderWidth: 1,

    borderColor: "#E3E3E3",
  },

  stateOn: {
    backgroundColor: "#EDF6DE",

    borderColor: COLORS.primary,
  },

  typePillText: {
    fontSize: 11,
    paddingBottom: 1,
    fontFamily: FONTS.bold,

    color: COLORS.grey,
  },

  statePillText: {
    fontSize: 11,
    paddingBottom: 1,
    fontFamily: FONTS.bold,

    color: COLORS.navy,
  },

  stateOnText: {
    color: COLORS.primary,
  },

  detailsContainer: {
    marginTop: 14,

    borderTopWidth: 1.5,

    borderTopColor: "#e6e6e6",

    paddingTop: 6,

    overflow: "hidden",
  },

  detailsBg: {
    position: "absolute",

    width: "100%",

    height: "100%",

    opacity: 0.35,
  },
});
