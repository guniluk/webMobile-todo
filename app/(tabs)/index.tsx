import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";

export default function HomeScreen() {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Section */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Todos</Text>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeButton, { backgroundColor: colors.surface }]}
          activeOpacity={0.7}
          accessibilityLabel="Toggle Theme"
        >
          {isDark ? (
            <Sun color={colors.warning} size={22} />
          ) : (
            <Moon color={colors.text} size={22} />
          )}
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={[styles.content, { color: colors.text }]}>
          {isDark ? "Dark Mode Active 🌙" : "Light Mode Active ☀️"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  themeButton: {
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 18,
    fontWeight: "600",
  },
});
