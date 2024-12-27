import React from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./Login";
import ChatScreen from "./page/Chat";
import HomeScreen from "./page/Home";
import StoreScreen from "./page/Store";
import RecipeScreen from "./page/Recipe";
import MealPlannerScreen from "./page/MealPlan";
import Footer from "./layout/Footer"; // Import Footer component

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Recipe"
            component={RecipeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Store"
            component={StoreScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Plan"
            component={MealPlannerScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>

        {/* Đặt Footer sau Stack.Navigator để nó luôn xuất hiện dưới cùng */}
        <Footer />
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
