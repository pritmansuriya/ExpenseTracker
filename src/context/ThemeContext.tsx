import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

export type ThemeColors = {
  background: string;
  backgroundGradient: readonly [string, string, string];
  backgroundPattern: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  divider: string;
  tabBar: string;
  tabBarBorder: string;
};

export const lightColors: ThemeColors = {
  background: "#F2F6F2",
  backgroundGradient: ["#E7F2ED", "#F4F6F0", "#FFF0E7"],
  backgroundPattern: "rgba(35, 91, 73, 0.07)",
  card: "#FFFFFF",
  cardBorder: "#DCE8E1",
  text: "#14231F",
  textSecondary: "#64756D",
  primary: "#2563EB",
  border: "#DCE8E1",
  divider: "#EAF0EB",
  tabBar: "#FFFFFF",
  tabBarBorder: "#E5E7EB",
};

export const darkColors: ThemeColors = {
  background: "#111D1A",
  backgroundGradient: ["#10231F", "#14262A", "#211F1C"],
  backgroundPattern: "rgba(196, 225, 213, 0.055)",
  card: "#1B2926",
  cardBorder: "#34443F",
  text: "#F4F7F2",
  textSecondary: "#A5B4AC",
  primary: "#3B82F6",
  border: "#34443F",
  divider: "#2B3A35",
  tabBar: "#1B2926",
  tabBarBorder: "#34443F",
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "darkmode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);

        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === "true");
        }
      } catch (error) {
        console.log("Error loading theme:", error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    Appearance.setColorScheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = async () => {
    setIsDarkMode((prev) => {
      const nextValue = !prev;

      AsyncStorage.setItem(THEME_KEY, String(nextValue)).catch((error) => {
        console.log("Error saving theme:", error);
      });

      return nextValue;
    });
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
