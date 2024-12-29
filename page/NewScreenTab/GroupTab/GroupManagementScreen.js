import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const GroupManagementScreen = ({ route, navigation }) => {
  const { groupId } = route.params;

  const managementOptions = [
    {
      icon: "list-alt",
      title: "Recipes",
      description: "Manage group recipes",
      onPress: () => {
        // Handle recipes
      },
    },
    {
      icon: "birthday-cake",
      title: "Foods",
      description: "Manage group foods",
      onPress: () => {
        navigation.navigate("GroupFoodScreen", { groupId });
      },
    },
    {
      icon: "calendar",
      title: "Meal Plans",
      description: "Plan meals for the group",
      onPress: () => {
        // Handle meal plans
      },
    },
    {
      icon: "cart-plus",
      title: "Shopping List",
      description: "Manage group shopping list",
      onPress: () => {
        // Handle shopping list
      },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Group Management</Text>
        <Text style={styles.headerSubtitle}>Select an option to manage</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.optionsContainer}>
          {managementOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={option.onPress}
            >
              <View style={styles.optionIconContainer}>
                <Icon name={option.icon} size={24} color="#4EA72E" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
              </View>
              <Icon name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: Platform.OS === "android" ? 40 : 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#4EA72E",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  optionsContainer: {
    padding: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4EA72E15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default GroupManagementScreen;
