// import { router } from "expo-router";
// import { useEffect, useRef } from "react";
// import { Animated, Image, StyleSheet, Text, View } from "react-native";

// export default function SplashScreen() {
//   const logoScale = useRef(new Animated.Value(0.8)).current;
//   const logoOpacity = useRef(new Animated.Value(0)).current;

//   const logoTranslateX = useRef(new Animated.Value(0)).current;

//   const textOpacity = useRef(new Animated.Value(0)).current;
//   const textTranslateX = useRef(new Animated.Value(-80)).current;

//   const bottomOpacity = useRef(new Animated.Value(0)).current;

//   const screenOpacity = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     Animated.sequence([
//       Animated.parallel([
//         Animated.spring(logoScale, {
//           toValue: 1,
//           friction: 7,
//           tension: 60,
//           useNativeDriver: true,
//         }),

//         Animated.timing(logoOpacity, {
//           toValue: 1,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//       ]),

//       Animated.parallel([
//         Animated.timing(logoTranslateX, {
//           toValue: -80,
//           duration: 700,
//           useNativeDriver: true,
//         }),

//         Animated.timing(textOpacity, {
//           toValue: 1,
//           duration: 700,
//           useNativeDriver: true,
//         }),

//         Animated.timing(textTranslateX, {
//           toValue: 0,
//           duration: 700,
//           useNativeDriver: true,
//         }),
//       ]),

//       Animated.timing(bottomOpacity, {
//         toValue: 1,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setTimeout(() => {
//         Animated.timing(screenOpacity, {
//           toValue: 0,
//           duration: 400,
//           useNativeDriver: true,
//         }).start(() => {
//           router.replace("/(tabs)");
//         });
//       }, 1500);
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <Animated.View
//       style={[
//         styles.container,
//         {
//           opacity: screenOpacity,
//         },
//       ]}
//     >
//       <View style={styles.centerContainer}>
//         <Animated.Image
//           source={require("@/assets/images/logo.png")}
//           style={[
//             styles.logo,
//             {
//               opacity: logoOpacity,
//               transform: [{ scale: logoScale }, { translateX: logoTranslateX }],
//             },
//           ]}
//         />

//         <Animated.View
//           style={{
//             opacity: textOpacity,
//             transform: [{ translateX: textTranslateX }],
//           }}
//         >
//           <Text style={styles.title}>SMART</Text>
//           <Text style={styles.title}>SWITCH</Text>
//         </Animated.View>
//       </View>

//       <Animated.View
//         style={[
//           styles.devnoxContainer,
//           {
//             opacity: bottomOpacity,
//           },
//         ]}
//       >
//         <Text style={styles.developedBy}>Developed by</Text>

//         <Image
//           source={require("@/assets/images/devnox.png")}
//           style={styles.devnoxLogo}
//           resizeMode="contain"
//         />
//       </Animated.View>
//     </Animated.View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   centerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   logo: {
//     width: 100,
//     height: 100,
//   },

//   title: {
//     fontSize: 34,
//     fontWeight: "800",
//     color: "#2F3A58",
//     letterSpacing: 1,
//     lineHeight: 36,
//   },

//   devnoxContainer: {
//     position: "absolute",
//     bottom: 50,
//     alignItems: "center",
//   },

//   developedBy: {
//     fontSize: 15,
//     color: "#666",
//     marginBottom: 12,
//   },

//   devnoxLogo: {
//     width: 220,
//     height: 70,
//   },
// });

import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text } from "react-native";

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;

  const bottomOpacity = useRef(new Animated.Value(0)).current;
  const bottomTranslateY = useRef(new Animated.Value(20)).current;

  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1.03,
          duration: 800,
          useNativeDriver: true,
        }),

        Animated.timing(bottomOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),

        Animated.timing(bottomTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(screenOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          router.replace("/(tabs)");
        });
      }, 1500);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: screenOpacity,
        },
      ]}
    >
      <Animated.Image
        source={require("@/assets/images/logo.png")}
        resizeMode="contain"
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.devnoxContainer,
          {
            opacity: bottomOpacity,
            transform: [
              {
                translateY: bottomTranslateY,
              },
            ],
          },
        ]}
      >
        <Text style={styles.developedBy}>Developed by</Text>

        <Image
          source={require("@/assets/images/devnox.png")}
          resizeMode="contain"
          style={styles.devnoxLogo}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 440,
    height: 280,
  },

  devnoxContainer: {
    position: "absolute",

    bottom: 60,

    alignItems: "center",
  },

  developedBy: {
    fontSize: 14,

    fontWeight: "600",

    color: "#b6b6b6",
    paddingLeft: 23,
    marginTop: 12,
  },

  devnoxLogo: {
    width: 150,
    height: 70,
  },
});
