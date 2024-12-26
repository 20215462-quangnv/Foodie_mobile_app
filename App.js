import React from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ChatScreen from "./page/Chat";
import HomeScreen from "./page/Home";
import StoreScreen from "./page/Store";
import RecipeScreen from "./page/Recipe";
import LoginScreen from "./page/Login";
import CreateGroupScreen from "./page/NewScreenTab/GroupTab/CreateGroupScreen";
import Footer from "./layout/Footer";
import GroupScreen from "./page/GroupScreen";
import EditRecipeScreen from "./page/NewScreenTab/Recipetab/EditRecipeScreen";

const Stack = createStackNavigator();

const App = () => {
  const [showFooter, setShowFooter] = React.useState(false);

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />

        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
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
            name="CreateGroupScreen"
            component={CreateGroupScreen}
            options={{
              title: "Create New Group",
              headerShown: true,
              headerStyle: {
                backgroundColor: "#4EA72E",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="GroupScreen"
            component={GroupScreen}
            options={{
              title: "Group Details",
              headerShown: true,
              headerStyle: {
                backgroundColor: "#4EA72E",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
        </Stack.Navigator>

        {/* Đặt Footer sau Stack.Navigator để nó luôn xuất hiện dưới cùng */}
        <Footer />
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
