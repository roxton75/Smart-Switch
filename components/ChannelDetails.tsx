import { FONTS } from "@/constants/fonts";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  relay: any;
  relayId: string;

  onEdit: () => void;
  onRemove: () => void;
  onConfigure?: () => void;

  unassigned?: boolean;
};
export default function ChannelDetails({
  relay,
  relayId,
  unassigned,
  onRemove,
  onEdit,
  onConfigure,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.channelInfo}>
          <View>
            <Text style={styles.label}>Channel</Text>

            <Text style={styles.value}>
              {relayId.replace("_", " ").toUpperCase()}
            </Text>
          </View>
        </View>

        {unassigned ? (
          <View style={styles.actionRow}>
            <Pressable style={styles.configureButton} onPress={onConfigure}>
              <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />

              <Text style={styles.configureText}>Configure</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <Pressable style={styles.editButton} onPress={onEdit}>
              <Ionicons name="create-outline" size={18} color={COLORS.navy} />

              <Text style={styles.editText} onPress={onEdit}>
                Edit
              </Text>
            </Pressable>

            <Pressable style={styles.deleteButton} onPress={onRemove}>
              <Ionicons name="trash-outline" size={18} color="#ffffff" />

              <Text style={styles.deleteText}>Remove</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  channelInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 2,
    paddingBottom: 2,
    paddingLeft: 2,
  },

  label: {
    color: COLORS.grey,
    fontFamily: FONTS.semiBold,
  },

  value: {
    color: COLORS.navy,
    fontFamily: FONTS.bold,
  },
  divider: {
    height: 2.5,

    backgroundColor: COLORS.grey,

    marginVertical: 10,
  },
  actionRow: {
    flexDirection: "row",

    justifyContent: "flex-end",

    paddingTop: 6,

    gap: 10,
  },

  editButton: {
    flexDirection: "row",
    fontFamily: FONTS.semiBold,
    alignItems: "center",

    gap: 6,

    height: 36,

    paddingHorizontal: 14,

    borderRadius: 999,

    backgroundColor: "#F3F3F3",

    borderWidth: 1.5,

    borderColor: COLORS.inactive,
  },

  deleteButton: {
    flexDirection: "row",
    fontFamily: FONTS.semiBold,
    alignItems: "center",

    gap: 6,

    height: 36,

    paddingHorizontal: 14,

    borderRadius: 999,

    backgroundColor: COLORS.primary,

    borderWidth: 1,

    borderColor: COLORS.buttonBorder,
  },

  editText: {
    fontSize: 13,
    paddingBottom: 1,
    fontFamily: FONTS.bold,

    color: COLORS.navy,
  },

  deleteText: {
    fontSize: 13,
    paddingBottom: 1,
    fontFamily: FONTS.bold,

    color: COLORS.card,
  },
  configureButton: {
    flexDirection: "row",

    alignItems: "center",

    gap: 6,

    height: 36,

    paddingHorizontal: 16,

    borderRadius: 999,

    backgroundColor: COLORS.primary,

    borderWidth: 1,

    borderColor: COLORS.buttonBorder,
  },

  configureText: {
    fontSize: 13,

    fontFamily: FONTS.bold,

    color: "#FFFFFF",
  },
});
