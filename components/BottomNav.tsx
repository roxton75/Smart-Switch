// // import { Animated, Pressable, StyleSheet, View } from "react-native";

// // import { useEffect, useRef } from "react";

// // import { Ionicons } from "@expo/vector-icons";

// // import { COLORS } from "@/constants/theme";

// // type BottomNavProps = {
// //   activeTab: string;

// //   setActiveTab: (tab: string) => void;
// // };

// // export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
// //   const translateX = useRef(
// //     new Animated.Value(activeTab === "devices" ? 70 : 0),
// //   ).current;

// //   useEffect(() => {
// //     Animated.spring(translateX, {
// //       toValue: activeTab === "devices" ? 70 : 0,

// //       useNativeDriver: true,

// //       friction: 8,
// //       tension: 80,
// //     }).start();
// //   }, [activeTab, translateX]);

// //   return (
// //     <View style={styles.wrapper}>
// //       <View style={styles.container}>
// //         <Animated.View
// //           style={[
// //             styles.activePill,
// //             {
// //               transform: [
// //                 {
// //                   translateX,
// //                 },
// //               ],
// //             },
// //           ]}
// //         />

// //         {/* HOME */}
// //         <Pressable style={styles.tab} onPress={() => setActiveTab("home")}>
// //           <Ionicons
// //             name="home-outline"
// //             size={24}
// //             color={activeTab === "home" ? COLORS.navy : "#FFFFFF"}
// //           />
// //         </Pressable>

// //         {/* DEVICES */}
// //         <Pressable style={styles.tab} onPress={() => setActiveTab("devices")}>
// //           <Ionicons
// //             name="grid-outline"
// //             size={22}
// //             color={activeTab === "devices" ? COLORS.navy : "#FFFFFF"}
// //           />
// //         </Pressable>
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   wrapper: {
// //     position: "absolute",

// //     bottom: 35,

// //     left: 0,
// //     right: 0,

// //     alignItems: "center",

// //     justifyContent: "center",
// //   },

// //   container: {
// //     width: 150,
// //     height: 70,

// //     backgroundColor: COLORS.primary,

// //     borderRadius: 999,

// //     flexDirection: "row",

// //     alignItems: "center",
// //     justifyContent: "space-between",

// //     paddingHorizontal: 12,

// //     position: "relative",

// //     shadowColor: "#000",

// //     shadowOffset: {
// //       width: 0,
// //       height: 6,
// //     },

// //     shadowOpacity: 0.1,
// //     shadowRadius: 10,

// //     elevation: 8,
// //   },

// //   activePill: {
// //     position: "absolute",

// //     width: 52,
// //     height: 52,

// //     borderRadius: 999,

// //     backgroundColor: "#FFFFFF",

// //     left: 10,
// //   },

// //   tab: {
// //     width: 50,
// //     height: 50,

// //     justifyContent: "center",
// //     alignItems: "center",

// //     zIndex: 2,
// //   },
// // });
// import { Animated, Pressable, StyleSheet, View } from "react-native";

// import { useEffect, useRef } from "react";

// import { Ionicons } from "@expo/vector-icons";

// import { COLORS } from "@/constants/theme";

// type BottomNavProps = {
//   activeTab: string;

//   setActiveTab: (tab: string) => void;
// };

// export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
//   const translateX = useRef(
//     new Animated.Value(activeTab === "devices" ? 72 : 0),
//   ).current;

//   useEffect(() => {
//     Animated.spring(translateX, {
//       toValue: activeTab === "devices" ? 72 : 0,

//       useNativeDriver: true,

//       friction: 7,
//       tension: 70,
//     }).start();
//   }, [activeTab]);

//   return (
//     <View style={styles.wrapper}>
//       <View style={styles.container}>
//         {/* ACTIVE INDICATOR */}
//         <Animated.View
//           style={[
//             styles.activePill,
//             {
//               transform: [
//                 {
//                   translateX,
//                 },
//               ],
//             },
//           ]}
//         />

//         {/* HOME */}
//         <Pressable style={styles.tab} onPress={() => setActiveTab("home")}>
//           <Ionicons
//             name="home-outline"
//             size={26}
//             color={activeTab === "home" ? COLORS.navy : "#FFFFFF"}
//           />
//         </Pressable>

//         {/* DEVICES */}
//         <Pressable style={styles.tab} onPress={() => setActiveTab("devices")}>
//           <Ionicons
//             name="grid-outline"
//             size={24}
//             color={activeTab === "devices" ? COLORS.navy : "#FFFFFF"}
//           />
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     position: "absolute",

//     bottom: 34,

//     left: 0,
//     right: 0,

//     alignItems: "center",
//   },

//   container: {
//     width: 158,
//     height: 74,

//     backgroundColor: COLORS.primary,

//     borderRadius: 999,

//     flexDirection: "row",

//     alignItems: "center",
//     justifyContent: "space-between",

//     paddingHorizontal: 15,

//     position: "relative",

//     shadowColor: "#000", 

//     shadowOffset: {
//       width: 0,
//       height: 8,
//     },

//     shadowOpacity: 0.12,
//     shadowRadius: 14,

//     elevation: 10,
//   },

//   activePill: {
//     position: "absolute",

//     width: 56,
//     height: 56,

//     borderRadius: 999,

//     backgroundColor: "#FFFFFF",

//     left: 15,

//     top: 9,
//   },

//   tab: {
//     width: 56,
//     height: 56,

//     justifyContent: "center",
//     alignItems: "center",

//     zIndex: 2,
//   },
// });
