import { COLORS, RADIUS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type SmartModalProps = {
  visible: boolean;
  type?: "loading" | "success" | "error" | "confirm";
  title: string;
  message: string;
  confirmText?: string;

  cancelText?: string;

  onConfirm?: () => void;

  onCancel?: () => void;
};

export default function SmartModal({
  visible,
  type = "loading",
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: SmartModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {type === "loading" && (
            <>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="wifi-outline"
                  size={34}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={styles.loader}
              />
            </>
          )}

          {type === "success" && (
            <View>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={34} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
          )}

          {type === "error" && (
            <View>
              <View style={styles.errorIcon}>
                <Ionicons name="close" size={34} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>
          )}

          {type === "confirm" && (
            <>
              <View style={styles.confirmIcon}>
                <Ionicons name="trash-outline" size={34} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonRow}>
                <Pressable style={styles.cancelButton} onPress={onCancel}>
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </Pressable>

                <Pressable style={styles.confirmButton} onPress={onConfirm}>
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,0.35)",

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 24,
  },

  modalCard: {
    width: "100%",

    maxWidth: 350,

    backgroundColor: COLORS.card,

    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.lightBorder,
    paddingVertical: 28,
    paddingHorizontal: 24,

    alignItems: "center",

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,

    shadowRadius: 12,

    elevation: 8,
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 999,

    borderWidth: 2,
    borderColor: COLORS.buttonBorder,

    backgroundColor: "#EDF6DE",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 16,
  },

  loader: {
    marginTop: 16,
  },

  successIcon: {
    width: 72,
    height: 72,

    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: COLORS.buttonBorder,
    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
  },

  errorIcon: {
    width: 72,
    height: 72,

    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.buttonBorder,
    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
  },

  title: {
    fontSize: 22,

    fontWeight: "800",

    color: COLORS.navy,

    textAlign: "center",

    marginBottom: 8,
  },

  message: {
    fontSize: 15,

    color: COLORS.grey,

    textAlign: "center",

    lineHeight: 22,
  },

  confirmIcon: {
    width: 72,
    height: 72,

    borderRadius: 999,
    borderWidth: 2,
    borderColor: COLORS.buttonBorder,
    backgroundColor: COLORS.primary,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 18,
  },

  buttonRow: {
    flexDirection: "row",

    gap: 12,

    width: "100%",

    marginTop: 24,
  },

  cancelButton: {
    flex: 1,

    height: 52,

    borderWidth: 1.5,
    borderRadius: 14,
    borderColor: COLORS.lightBorder,
    backgroundColor: "#F1F1F1",

    justifyContent: "center",
    alignItems: "center",
  },

  confirmButton: {
    flex: 1,

    height: 52,

    borderWidth: 1.5,
    borderRadius: 14,

    borderColor: COLORS.buttonBorder,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    fontWeight: "700",

    color: COLORS.navy,
  },

  confirmText: {
    fontWeight: "700",

    color: "#FFFFFF",
  },
});
