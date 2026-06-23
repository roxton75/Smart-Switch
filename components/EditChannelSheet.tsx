/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS, SPACING } from "@/constants/theme";
import { FONTS } from "constants/fonts";

import { configureRelay, updateRelay } from "@/services/relayService";
import SmartModal from "./ui/SmartModal";

type Props = {
  visible: boolean;

  relayId: string;
  controllerOnline: boolean;
  relay: any;
  mode: "edit" | "configure";
  onClose: () => void;
};

export default function EditChannelSheet({
  visible,
  relayId,
  relay,
  mode,
  controllerOnline,
  onClose,
}: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => [450], []);

  const [name, setName] = useState("");

  const [location, setLocation] = useState("");

  const [type, setType] = useState("");

  const [saving, setSaving] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [originalName, setOriginalName] = useState("");
  const [originalLocation, setOriginalLocation] = useState("");
  const [originalType, setOriginalType] = useState("");

  const canConfigure =
    name.trim().length > 0 && location.trim().length > 0 && type.length > 0;

  const hasChanges =
    mode === "configure"
      ? canConfigure
      : (name || "").trim() !== (originalName || "") ||
        (location || "").trim() !== (originalLocation || "") ||
        (type || "") !== (originalType || "");

  const handleSave = async () => {
    if (!controllerOnline) {
      return;
    }
    try {
      if (!name.trim()) return;

      if (!location.trim()) return;

      if (!type.trim()) return;

      setSaving(true);

      if (mode === "edit") {
        await updateRelay(relayId, {
          name,
          location,
          type,
        });
      } else {
        await configureRelay(relayId, {
          name,
          location,
          type,
        });
      }

      setSaving(false);

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // console.log(error);

      setSaving(false);
    }
  };

  useEffect(() => {
    if (mode === "configure") {
      setName("");
      setLocation("");
      setType("");

      setOriginalName("");
      setOriginalLocation("");
      setOriginalType("");

      return;
    }

    if (relay) {
      setName(relay.name);
      setLocation(relay.location);
      setType(relay.type);

      setOriginalName(relay.name);
      setOriginalLocation(relay.location);
      setOriginalType(relay.type);
    }
  }, [relay]);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      onClose={onClose}
      backgroundStyle={{
        backgroundColor: "#fcfcfc",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: "#adadad",
        borderLeftColor: "#adadad",
        borderRightColor: "#adadad",
      }}
      handleIndicatorStyle={{
        width: 85,
        height: 5,
        elevation: 1,
        backgroundColor: "#88B04B",
      }}
    >
      <BottomSheetView style={styles.container}>
        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === "edit" ? "Edit Channel" : "Configure Channel"}
          </Text>

          <Pressable
            style={styles.closeButton}
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}
          >
            <Ionicons name="close" size={24} color={COLORS.navy} />
          </Pressable>
        </View>

        <View style={styles.bottomSheetPadding}>
          <Text style={styles.detailsTitle}>Device Info</Text>
          <Text style={styles.subtitle}>
            {mode === "edit"
              ? "Edit your Device Information"
              : "Configure your Device"}
          </Text>

          {/* Device Name */}
          <View style={styles.inputCard}>
            <Ionicons
              name="pricetag-outline"
              size={22}
              color={COLORS.primary}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Device Name</Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter Device Name"
                placeholderTextColor={COLORS.inactive}
                style={styles.input}
              />
            </View>
          </View>

          {/* Location */}

          <View style={styles.inputCard}>
            <Ionicons
              name="location-outline"
              size={22}
              color={COLORS.primary}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Location</Text>

              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Enter Device Location"
                placeholderTextColor={COLORS.inactive}
                style={styles.input}
              />
            </View>
          </View>

          {/* Device Type */}

          <Text style={styles.sectionTitle}>Type of Appliance</Text>

          <View style={styles.typeRow}>
            <Pressable
              onPress={() => setType("light")}
              style={[styles.typeButton, type === "light" && styles.activeType]}
            >
              <Ionicons
                name="bulb-outline"
                size={24}
                color={type === "light" ? COLORS.primary : COLORS.inactive}
              />

              <Text
                style={[
                  styles.typeText,
                  type === "light" && styles.activeTypeText,
                ]}
              >
                Light
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setType("fan")}
              style={[styles.typeButton, type === "fan" && styles.activeType]}
            >
              <Ionicons
                name="snow-outline"
                size={24}
                color={type === "fan" ? COLORS.primary : COLORS.inactive}
              />

              <Text
                style={[
                  styles.typeText,
                  type === "fan" && styles.activeTypeText,
                ]}
              >
                Fan
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setType("socket")}
              style={[
                styles.typeButton,
                type === "socket" && styles.activeType,
              ]}
            >
              <Ionicons
                name="power-outline"
                size={24}
                color={type === "socket" ? COLORS.primary : COLORS.inactive}
              />

              <Text
                style={[
                  styles.typeText,
                  type === "socket" && styles.activeTypeText,
                ]}
              >
                socket
              </Text>
            </Pressable>
          </View>
        </View>
        {/* Save */}

        <Pressable
          style={[
            styles.saveButton,
            (!hasChanges || saving || !controllerOnline) &&
              styles.disabledSaveButton,
          ]}
          onPress={handleSave}
          disabled={!hasChanges || saving || !controllerOnline}
        >
          <Text style={styles.saveText}>
            {saving
              ? mode === "edit"
                ? "Saving..."
                : "Configuring..."
              : mode === "edit"
                ? hasChanges
                  ? "Save Changes"
                  : "No Changes"
                : "Configure Device"}
          </Text>
        </Pressable>

        <SmartModal
          visible={saving}
          type="loading"
          title="Saving Changes"
          message="Updating device information..."
        />

        <SmartModal
          visible={showSuccess}
          type="success"
          title={mode === "edit" ? "Updated" : "Configured"}
          message={
            mode === "edit"
              ? "Device updated successfully."
              : "Device configured successfully."
          }
        />
      </BottomSheetView>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "space-between",
    //padding: 16,
    backgroundColor: COLORS.surface,
  },

  bottomSheetPadding: {
    marginHorizontal: SPACING.lg,
  },

  header: {
    height: 54,

    backgroundColor: COLORS.card,

    justifyContent: "center",

    alignItems: "center",

    borderBottomColor: COLORS.lightBorder,

    paddingBottom: 15,

    marginBottom: 15,
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.09,

    shadowRadius: 4,

    elevation: 3,
  },

  title: {
    fontSize: 24,

    color: COLORS.navy,

    fontFamily: FONTS.headingExtra,
    textAlign: "center",
  },

  closeButton: {
    position: "absolute",

    right: 24,

    top: 10,
  },

  label: {
    fontSize: 13,

    color: COLORS.grey,

    marginBottom: 4,
  },

  inputCard: {
    flexDirection: "row",

    backgroundColor: COLORS.card,

    alignItems: "center",

    minHeight: 72,

    gap: 12,

    borderWidth: 1.5,

    borderColor: COLORS.lightBorder,

    borderRadius: 18,

    paddingHorizontal: 16,

    paddingVertical: 12,

    marginBottom: 14,
  },

  detailsTitle: {
    fontSize: 20,

    fontFamily: FONTS.heading,

    color: COLORS.primary,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.grey,
    marginBottom: 12,

    //marginTop: -4,
  },
  sectionTitle: {
    fontSize: 18,

    fontFamily: FONTS.heading,

    color: COLORS.navy,

    marginBottom: 12,
  },

  typeRow: {
    flexDirection: "row",

    gap: 10,
  },

  typeButton: {
    flex: 1,

    height: 72,

    borderRadius: 18,

    borderWidth: 1.5,

    backgroundColor: COLORS.card,

    borderColor: COLORS.lightBorder,

    justifyContent: "center",

    alignItems: "center",
  },

  activeType: {
    backgroundColor: "#EDF6DE",

    borderColor: COLORS.primary,
  },

  saveButton: {
    height: 56,

    marginHorizontal: SPACING.lg,

    marginTop: 24,

    marginBottom: 24,

    borderWidth: 2,

    borderRadius: 18,

    borderColor: COLORS.buttonBorder,

    backgroundColor: COLORS.primary,

    justifyContent: "center",

    alignItems: "center",
  },

  saveText: {
    color: "#FFF",

    fontSize: 16,

    fontFamily: FONTS.bold,
  },
  input: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.navy,
    padding: 0,
  },
  typeText: {
    marginTop: 6,
    fontFamily: FONTS.semiBold,
    color: COLORS.grey,
  },

  activeTypeText: {
    color: COLORS.primary,
  },

  disabledSaveButton: {
    backgroundColor: COLORS.inactive,
    borderColor: COLORS.buttonBorder,
  },
});
