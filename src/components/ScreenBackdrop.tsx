import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

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
      <View style={styles.patternLayer}>
        <Text
          style={[
            styles.currencyMark,
            styles.currencyTopLeft,
            { color: colors.backgroundPattern },
          ]}
        >
          ₹
        </Text>
        <Text
          style={[
            styles.currencyMark,
            styles.currencyCenterRight,
            { color: colors.backgroundPattern },
          ]}
        >
          ₹
        </Text>
        <Text
          style={[
            styles.currencyMark,
            styles.currencyBottomRight,
            { color: colors.backgroundPattern },
          ]}
        >
          ₹
        </Text>
        <TrendMark color={colors.backgroundPattern} position="topRight" />
        <TrendMark color={colors.backgroundPattern} position="bottomLeft" />
      </View>
    </View>
  );
}

function TrendMark({
  color,
  position,
}: {
  color: string;
  position: "topRight" | "bottomLeft";
}) {
  return (
    <View
      style={[
        styles.chartMark,
        position === "topRight" ? styles.topRightChart : styles.bottomLeftChart,
      ]}
    >
      <View
        style={[
          styles.chartSegment,
          styles.segmentOne,
          { backgroundColor: color },
        ]}
      />
      <View
        style={[
          styles.chartSegment,
          styles.segmentTwo,
          { backgroundColor: color },
        ]}
      />
      <View
        style={[
          styles.chartSegment,
          styles.segmentThree,
          { backgroundColor: color },
        ]}
      />
      <View
        style={[styles.chartPoint, styles.pointOne, { backgroundColor: color }]}
      />
      <View
        style={[styles.chartPoint, styles.pointTwo, { backgroundColor: color }]}
      />
      <View
        style={[
          styles.chartPoint,
          styles.pointThree,
          { backgroundColor: color },
        ]}
      />
      <View
        style={[
          styles.chartPoint,
          styles.pointFour,
          { backgroundColor: color },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  patternLayer: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },

  currencyMark: {
    position: "absolute",
    fontSize: 46,
    fontWeight: "700",
  },

  currencyTopLeft: {
    top: "14%",
    left: "9%",
  },

  currencyCenterRight: {
    top: "47%",
    right: "8%",
    fontSize: 38,
  },

  currencyBottomRight: {
    bottom: "10%",
    right: "29%",
    fontSize: 34,
  },

  chartMark: {
    position: "absolute",
    width: 150,
    height: 100,
  },

  topRightChart: {
    top: "13%",
    right: "7%",
  },

  bottomLeftChart: {
    bottom: "14%",
    left: "3%",
    transform: [{ scale: 0.82 }],
  },

  chartSegment: {
    position: "absolute",
    height: 1.5,
    borderRadius: 1,
  },

  segmentOne: {
    top: 66,
    left: 8,
    width: 48,
    transform: [{ rotate: "-22deg" }],
  },

  segmentTwo: {
    top: 44,
    left: 48,
    width: 49,
    transform: [{ rotate: "-31deg" }],
  },

  segmentThree: {
    top: 18,
    left: 91,
    width: 47,
    transform: [{ rotate: "-22deg" }],
  },

  chartPoint: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
  },

  pointOne: {
    top: 72,
    left: 6,
  },

  pointTwo: {
    top: 50,
    left: 51,
  },

  pointThree: {
    top: 23,
    left: 95,
  },

  pointFour: {
    top: 2,
    left: 136,
  },
});
