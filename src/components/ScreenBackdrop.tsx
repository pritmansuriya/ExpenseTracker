import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

const linePositions = [0, 28, 56, 84, 112, 140, 168, 196];

export default function ScreenBackdrop() {
  const { colors } = useTheme();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={colors.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.linework}>
        {linePositions.map((top) => (
          <View
            key={top}
            style={[
              styles.line,
              { top, backgroundColor: colors.backgroundPattern },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linework: {
    position: "absolute",
    top: 0,
    right: -190,
    width: 520,
    height: 240,
    overflow: "hidden",
    transform: [{ rotate: "-18deg" }],
  },
  line: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: 1,
  },
});
