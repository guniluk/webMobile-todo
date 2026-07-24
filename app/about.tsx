import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const about = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.textContent}>about in roots</Text>
      <View style={{ marginTop: 20, padding: 20, backgroundColor: "blue" }}>
        <Link href="/" style={{ color: "white", fontWeight: "bold" }}>
          Index at Root
        </Link>
      </View>
      <View style={{ marginTop: 20, padding: 20, backgroundColor: "yellow" }}>
        <Link href="/(tabs)" style={{ color: "black", fontWeight: "bold" }}>
          Index at Tabs
        </Link>
      </View>
    </View>
  );
};

export default about;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
  textContent: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
