import { COLORS } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export default function ChannelCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.icon} />

        <View style={styles.content}>
          <View style={styles.title} />
          <View style={styles.subtitle} />

          <View style={styles.pillRow}>
            <View style={styles.pill} />
            <View style={styles.smallPill} />
          </View>
        </View>

        <View style={styles.chevron} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120,

    borderRadius: 26,

    backgroundColor: COLORS.card,

    borderWidth: 2,

    borderColor: COLORS.lightBorder,

    marginBottom: 14,

    paddingHorizontal: 20,

    justifyContent: "center",
  },

  row: {
    flexDirection: "row",

    alignItems: "center",
  },

  icon: {
    width: 72,
    height: 72,

    borderRadius: 999,

    backgroundColor: "#E8E8E8",
  },

  content: {
    flex: 1,

    marginLeft: 18,
  },

  title: {
    width: 150,

    height: 20,

    borderRadius: 8,

    backgroundColor: "#E8E8E8",

    marginBottom: 10,
  },

  subtitle: {
    width: 100,

    height: 16,

    borderRadius: 8,

    backgroundColor: "#ECECEC",

    marginBottom: 12,
  },

  pillRow: {
    flexDirection: "row",

    gap: 10,
  },

  pill: {
    width: 90,

    height: 32,

    borderRadius: 999,

    backgroundColor: "#E8E8E8",
  },

  smallPill: {
    width: 70,

    height: 32,

    borderRadius: 999,

    backgroundColor: "#ECECEC",
  },

  chevron: {
    width: 24,

    height: 24,

    borderRadius: 999,

    backgroundColor: "#E8E8E8",
  },
});
