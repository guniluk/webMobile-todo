import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Sun, Moon, Monitor } from "lucide-react-native";
import { useTheme, ThemeMode } from "../../hooks/useTheme";

const SettingsScreen = () => {
  const { colors, themeMode, setThemeMode } = useTheme();

  const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: "system", label: "시스템 설정", icon: Monitor },
    { mode: "light", label: "라이트 모드", icon: Sun },
    { mode: "dark", label: "다크 모드", icon: Moon },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>설정</Text>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          테마 설정
        </Text>
        <View style={styles.optionsContainer}>
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = themeMode === option.mode;
            return (
              <TouchableOpacity
                key={option.mode}
                style={[
                  styles.optionButton,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected
                      ? colors.primaryLight
                      : colors.surface,
                  },
                ]}
                onPress={() => setThemeMode(option.mode)}
                activeOpacity={0.7}
              >
                <Icon
                  color={isSelected ? colors.primary : colors.textSecondary}
                  size={20}
                />
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: isSelected ? colors.primary : colors.text,
                      fontWeight: isSelected ? "600" : "400",
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: 10,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
  },
});

