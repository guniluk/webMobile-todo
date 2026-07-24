import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Index = () => {
  const router = useRouter();

  const handleGoToAppIndex = () => {
    if (router.canGoBack()) {
      // Stack 상위에 있는 Root app/index.tsx로 스택을 정리하며 돌아감
      router.dismissAll();
    } else {
      // 스택 기록이 없을 경우 Root index로 replace 이동
      router.replace("/");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>index in tabs</Text>

      <TouchableOpacity style={styles.button} onPress={handleGoToAppIndex}>
        <Text style={styles.buttonText}>Go to app/index</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
