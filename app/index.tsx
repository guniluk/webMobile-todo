import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>index in roots</Text>
      <View
        style={{
          marginBottom: 20,
          marginTop: 20,
          padding: 20,
          backgroundColor: "pink",
        }}
      >
        <Link href="/about">Visit about page</Link>
      </View>

      <View style={{ padding: 20, backgroundColor: "green" }}>
        <Link href="/(tabs)">
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Visit tabs page
          </Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  content: {
    color: "red",
    fontSize: 20,
  },
});
