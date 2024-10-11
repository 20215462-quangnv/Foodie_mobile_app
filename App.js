import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import LoginScreen from "./Login";

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <LoginScreen />
      </SafeAreaView>
    </>
  );
};

export default App;
