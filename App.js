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
import ProfileScreen from "./page/ProfileScreen";
import EditProfileScreen from "./page/NewScreenTab/ProfileTab/EditProfileScreen";
import ChangePasswordScreen from "./page/NewScreenTab/ProfileTab/ChangePasswordScreen";
import TaskDetailsScreen from "./page/NewScreenTab/Recipetab/TaskScreen";
import GroupShoppingListScreen from "./page/NewScreenTab/GroupTab/GroupShoppingListScreen";
import FooterAdmin from "./layout/FooterAdmin";
import AdminHomeScreen from "./page/adminPage/AdminHome";
import UnitScreen from "./page/adminPage/UnitScreen";
import UnitControllerScreen from "./page/adminPage/UnitTab/UnitControllerScreen";
import CategoryControllerScreen from "./page/adminPage/UnitTab/CategoryControllerScreen";
import UserControllerScreen from "./page/adminPage/UserControllerScreen";
import RegisterScreen from "./page/RegisterScreen";
import TaskShoppingListScreen from "./page/NewScreenTab/GroupTab/TaskShoppingListScreen";
const Stack = createStackNavigator();

// Create wrapped component outside of RootNavigator
const WrappedHomeScreen = (props) => (
  <FoodProvider>
    <HomeScreen {...props} />
  </FoodProvider>
);

const App = () => {
  const [showFooter, setShowFooter] = React.useState(false);
  const [showFooterAdmin, setShowFooterAdmin] = React.useState(false);
  return (
    <NavigationContainer
      onStateChange={(state) => {
        if (state) {
          const currentRoute = state.routes[state.index].name;
          setShowFooter(currentRoute !== "Register" && currentRoute !== "Login" && currentRoute !== "AdminHome" && currentRoute !== "Unit" && currentRoute!=="UnitControllerScreen" && currentRoute!=="CategoryControllerScreen"&& currentRoute!=="UserControllerScreen"); // Chỉ ẩn Footer trên màn Login
          setShowFooterAdmin(currentRoute !== "Register" && currentRoute !== "Login");
          setShowFooterAdmin(currentRoute === "AdminHome" || currentRoute === "Unit" || currentRoute==="UnitControllerScreen" || currentRoute==="CategoryControllerScreen"|| currentRoute==="UserControllerScreen"); // Chỉ ẩn Footer trên màn Login
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
        <RootNavigator setShowFooter={setShowFooter} setShowFooterAdmin={setShowFooterAdmin} />
          {showFooter && <Footer />}
          {showFooterAdmin && <FooterAdmin />}
      </SafeAreaView>
      </NavigationContainer>
  );
};

// Component điều hướng chính
const RootNavigator = ({ setShowFooter, setShowFooterAdmin }) => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={(props) => <LoginScreen {...props} setShowFooter={setShowFooter} setShowFooterAdmin={setShowFooterAdmin} />} />
      <Stack.Screen name="Register"  component={(props) => <RegisterScreen {...props} setShowFooter={setShowFooter} setShowFooterAdmin={setShowFooterAdmin} />} />
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
      <Stack.Screen name="Unit" component={UnitScreen} />
      <Stack.Screen name="UnitControllerScreen" component={UnitControllerScreen} />
       <Stack.Screen name="CategoryControllerScreen" component={CategoryControllerScreen} />
         <Stack.Screen name="UserControllerScreen" component={UserControllerScreen} />


      <Stack.Screen name="Recipe"   component = {(props) => (
          <FoodProvider>  
            <RecipeScreen {...props} />
          </FoodProvider>
        )}/>
      <Stack.Screen name="Store"   component = {(props) => (
          <FoodProvider>  
            <StoreScreen {...props} />
          </FoodProvider>
        )} />
      <Stack.Screen name="Home"
        component = {(props) => (
          <FoodProvider>  
            <HomeScreen {...props} />
          </FoodProvider>
        )}
        />
      <Stack.Screen name="Task" component = {(props) => (
          <FoodProvider>  
            <TaskScreen {...props} />
          </FoodProvider>
        )} />
      <Stack.Screen name="Chat"   component = {(props) => (
          <FoodProvider> 
            <ChatScreen {...props} />
          </FoodProvider>
        )} />
      <Stack.Screen name="Plan"  component = {(props) => (
          <FoodProvider> 
            <MealPlannerScreen {...props} />
          </FoodProvider>
        )} />
      <Stack.Screen name="EditRecipe" component = {(props) => (
          <FoodProvider>  
            <EditRecipeScreen {...props} />
          </FoodProvider>
        )} />
      <Stack.Screen name="TaskDetails" component = {(props) => (
          <FoodProvider>  
            <TaskDetailsScreen {...props} />
          </FoodProvider>
        )} />
      <Stack.Screen
        name="CreateMealPlan"
        component = {(props) => (
          <FoodProvider>  
            <CreateMealPlan {...props} />
          </FoodProvider>
        )}
        options={{
          title: "Create Meal Plan",
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="CreateGroupScreen"
       component = {(props) => (
          <FoodProvider>  
            <CreateGroupScreen {...props} />
          </FoodProvider>
        )}
        options={{
          title: "Create Group",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="GroupScreen" component = {(props) => (
          <FoodProvider>  
            <GroupScreen {...props} />
          </FoodProvider>
        )}/>
      <Stack.Screen
        name="GroupManagement"
        component = {(props) => (
          <FoodProvider>  
            <GroupManagementScreen {...props} />
          </FoodProvider>
        )}
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
        component = {(props) => (
          <FoodProvider>  
            <GroupFoodScreen {...props} />
          </FoodProvider>
        )}
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
      <Stack.Screen
        name="ShoppingList"
        component = {(props) => (
          <FoodProvider>  
            <GroupShoppingListScreen {...props} />
          </FoodProvider>
        )}
        options={{
          headerShown: true,
          title: "Shopping List",
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
        name="TaskShoppingListScreen"
        component = {(props) => (
          <FoodProvider>  
            <TaskShoppingListScreen {...props} />
          </FoodProvider>
        )}
        options={{
          headerShown: true,
          title: "Task",
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
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: "Profile",
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
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
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
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          title: "Change Password",
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
