import React from "react";
import { SafeAreaView, StatusBar, View, StyleSheet, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ChatScreen from "./page/Chat";
import HomeScreen from "./page/Home";
import StoreScreen from "./page/Store";
import RecipeScreen from "./page/Recipe";
import LoginScreen from "./page/Login";
import Footer from "./layout/Footer"; // Import Footer component
import EditRecipeScreen from "./page/NewScreenTab/Recipetab/EditRecipeScreen";

const Stack = createStackNavigator();

const App = () => {
  const [showFooter, setShowFooter] = React.useState(false);

  return (
    <NavigationContainer
      onStateChange={(state) => {
        if (state) {
          const currentRoute = state.routes[state.index].name;
          setShowFooter(currentRoute !== "Login"); // Chỉ ẩn Footer trên màn Login
        }
      }}
    >
      <SafeAreaView style={styles.container}>
        {/* Hiển thị thanh trạng thái với màu sắc và kiểu chữ */}
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={Platform.OS === "android" ? "transparent" : undefined} 
          translucent={Platform.OS === "android"} 
        />
        <RootNavigator />
        {/* Footer duy nhất */}
        {showFooter && <Footer />}
      </SafeAreaView>
    </NavigationContainer>
  );
};

// Component điều hướng chính
const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Recipe" component={RecipeScreen} />
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="EditRecipe" component={EditRecipeScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Màu nền ứng dụng
  },
});

export default App;
