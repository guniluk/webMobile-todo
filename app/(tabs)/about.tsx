import React from "react";
import { StyleSheet, Text, View } from "react-native";

const about = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>about in tabs</Text>
    </View>
  );
};

export default about;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
