import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeColors = {
  background: string;
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
  background: "#F8FAFC",
  card: "#FFFFFF",
  cardBorder: "#E2E8F0",
  text: "#0F172A",
  textSecondary: "#64748B",
  primary: "#2563EB",
  border: "#E2E8F0",
  divider: "#F1F5F9",
  tabBar: "#FFFFFF",
  tabBarBorder: "#E5E7EB",
};

export const darkColors: ThemeColors = {
  background: "#111827",
  card: "#1F2937",
  cardBorder: "#374151",
  text: "#F9FAFB",
  textSecondary: "#9CA3AF",
  primary: "#3B82F6",
  border: "#374151",
  divider: "#374151",
  tabBar: "#1F2937",
  tabBarBorder: "#374151",
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

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;

    setIsDarkMode(newValue);

    try {
      await AsyncStorage.setItem(THEME_KEY, String(newValue));
    } catch (error) {
      console.log("Error saving theme:", error);
    }
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
