import * as Haptics from "expo-haptics";
import { Pressable, PressableProps } from "react-native";

type HapticTabProps = PressableProps & {
  children: React.ReactNode;
};

export function HapticTab(props: HapticTabProps) {
  return (
    <Pressable
      {...props}
      onPress={(event) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPress?.(event);
      }}
    />
  );
}
