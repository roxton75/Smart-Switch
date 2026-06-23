import { FONTS } from "@/constants/fonts";
import { COLORS, RADIUS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
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

  onClose?: () => void;
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
  onClose,
}: SmartModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (type === "error") {
              onClose?.();
            }
          }}
        >
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
        <View style={styles.modalCard}>
          {type === "loading" && (
            <>
              <View style={styles.iconContainer}>
                <Ionicons name="wifi-outline" size={34} color={COLORS.card} />
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
            <View style={styles.content}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={34} color="#FFFFFF" />
              </View>

              <Text style={styles.title}>{title}</Text>

              <Text style={styles.message}>{message}</Text>
            </View>
          )}

          {type === "error" && (
            <View style={styles.content}>
              <View style={styles.errorIcon}>
                <Ionicons
                  name="cloud-offline-outline"
                  size={34}
                  color="#FFFFFF"
                />
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

  content: {
    width: "100%",

    alignItems: "center",

    justifyContent: "center",
  },

  okButton: {
    marginTop: 24,
    fontFamily: FONTS.semiBold,
    width: "100%",

    height: 52,

    borderRadius: 14,

    backgroundColor: COLORS.primary,

    justifyContent: "center",

    alignItems: "center",
  },

  okButtonText: {
    color: "#FFFFFF",

    fontSize: 15,

    fontFamily: FONTS.bold,
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 999,

    borderWidth: 2,
    borderColor: COLORS.buttonBorder,

    backgroundColor: COLORS.primary,

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

    borderWidth: 2,
    borderColor: COLORS.buttonBorder,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 16,
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

    marginBottom: 16,
  },

  title: {
    fontSize: 22,

    fontFamily: FONTS.heading,

    color: COLORS.navy,

    textAlign: "center",

    marginBottom: 8,
  },

  message: {
    fontSize: 15,
    fontFamily: FONTS.medium,
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

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 16,
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
    fontFamily: FONTS.semiBold,
    borderWidth: 1.5,
    borderRadius: 14,
    borderColor: COLORS.lightBorder,
    backgroundColor: "#F1F1F1",

    justifyContent: "center",
    alignItems: "center",
  },

  confirmButton: {
    flex: 1,
    fontFamily: FONTS.semiBold,
    height: 52,

    borderWidth: 1.5,
    borderRadius: 14,

    borderColor: COLORS.buttonBorder,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    fontFamily: FONTS.bold,

    color: COLORS.navy,
  },

  confirmText: {
    fontFamily: FONTS.bold,

    color: "#FFFFFF",
  },
});
