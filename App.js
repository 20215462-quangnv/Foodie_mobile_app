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
import TaskScreen from "./page/ListTask";
import LoginScreen from "./page/Login";
import Footer from "./layout/Footer"; // Import Footer component
import EditRecipeScreen from "./page/NewScreenTab/Recipetab/EditRecipeScreen";
import { FoodProvider } from "./controller/FoodProviderContext";
import MealPlannerScreen from "./page/MealPlan";
import CreateMealPlan from "./page/NewScreenTab/mealPlanTab/CreateNewPlanScreen";
import CreateGroupScreen from "./page/NewScreenTab/GroupTab/CreateGroupScreen";
import GroupScreen from "./page/GroupScreen";
import GroupManagementScreen from "./page/NewScreenTab/GroupTab/GroupManagementScreen";
import GroupFoodScreen from "./page/NewScreenTab/GroupTab/GroupFoodScreen";
import TaskDetailsScreen from "./page/NewScreenTab/Recipetab/TaskScreen";
const Stack = createStackNavigator();

const App = () => {
  const [showFooter, setShowFooter] = React.useState(false);

  return (
    <FoodProvider> 
    <NavigationContainer
      onStateChange={(state) => {
        if (state) {
          const currentRoute = state.routes[state.index].name;
          setShowFooter(currentRoute !== "Login"); // Chỉ ẩn Footer trên màn Login
        }
      }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={
            Platform.OS === "android" ? "transparent" : undefined
          }
          translucent={Platform.OS === "android"}
        />
        <RootNavigator />
        {showFooter && <Footer />}
      </SafeAreaView>
      </NavigationContainer>
      </FoodProvider> 
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
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={(props) => (
          <FoodProvider>
            <HomeScreen {...props} />
          </FoodProvider>
        )}
      />
      <Stack.Screen name="Task" component={TaskScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Plan" component={MealPlannerScreen} />
      <Stack.Screen name="EditRecipe" component={EditRecipeScreen} />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <Stack.Screen
        name="CreateMealPlan"
        component={CreateMealPlan}
        options={{
          title: "Create Meal Plan",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="CreateGroupScreen"
        component={CreateGroupScreen}
        options={{
          title: "Create Group",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="GroupScreen" component={GroupScreen} />
      <Stack.Screen
        name="GroupManagement"
        component={GroupManagementScreen}
        options={{
          title: "Group Management",
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
        name="GroupFoodScreen"
        component={GroupFoodScreen}
        options={{
          headerShown: true,
          title: "Group Foods",
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
