import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

export type ThemeMode = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "@webmobile_todo_theme_mode";

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryLight: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
  statusBar: "light" | "dark" | "auto" | "inverted";
  shadow: string;
}

export const Colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    background: "#F8F9FA",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    text: "#1C1C1E",
    textSecondary: "#8E8E93",
    border: "#E5E5EA",
    primary: "#007AFF",
    primaryLight: "#E5F1FF",
    accent: "#5856D6",
    error: "#FF3B30",
    success: "#34C759",
    warning: "#FF9500",
    statusBar: "dark",
    shadow: "rgba(0, 0, 0, 0.05)",
  },
  dark: {
    background: "#121214",
    surface: "#1C1C1E",
    card: "#2C2C2E",
    text: "#F2F2F7",
    textSecondary: "#8E8E93",
    border: "#3A3A3C",
    primary: "#0A84FF",
    primaryLight: "#152E4D",
    accent: "#5E5CE6",
    error: "#FF453A",
    success: "#30D158",
    warning: "#FF9F0A",
    statusBar: "light",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
};

interface ThemeContextType {
  themeMode: ThemeMode;
  colorScheme: "light" | "dark";
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

//! 1. Context 생성
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

//! 2. Context Provider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useSystemColorScheme() ?? "light";
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  // 저장된 테마 모드 복원
  useEffect(() => {
    const loadSavedThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (
          savedMode &&
          (savedMode === "light" ||
            savedMode === "dark" ||
            savedMode === "system")
        ) {
          setThemeModeState(savedMode as ThemeMode);
        }
      } catch (error) {
        console.error("Failed to load theme mode from AsyncStorage:", error);
      }
    };
    loadSavedThemeMode();
  }, []);

  // 테마 모드 변경 및 AsyncStorage 저장
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error("Failed to save theme mode to AsyncStorage:", error);
    }
  };

  const activeColorScheme: "light" | "dark" =
    themeMode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : themeMode;

  const isDark = activeColorScheme === "dark";
  const colors = Colors[activeColorScheme];

  const toggleTheme = () => {
    const nextMode: ThemeMode =
      themeMode === "system"
        ? systemColorScheme === "dark"
          ? "light"
          : "dark"
        : themeMode === "dark"
          ? "light"
          : "dark";

    setThemeMode(nextMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        colorScheme: activeColorScheme,
        isDark,
        colors,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

//! 3. useContext 사용
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  // ThemeProvider가 없을 경우를 대비한 Fallback
  const systemColorScheme = useSystemColorScheme() ?? "light";
  if (!context) {
    const isDark = systemColorScheme === "dark";
    return {
      themeMode: "system",
      colorScheme: isDark ? "dark" : "light",
      isDark,
      colors: isDark ? Colors.dark : Colors.light,
      setThemeMode: () => {},
      toggleTheme: () => {},
    };
  }

  return context;
};
