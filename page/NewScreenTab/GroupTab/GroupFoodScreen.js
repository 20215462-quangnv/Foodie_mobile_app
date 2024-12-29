import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  getFoodsByGroupId,
  deleteFood,
  createFood,
} from "../../../controller/FoodController";

const GroupFoodScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const response = await getFoodsByGroupId(groupId);
      setFoods(response.data);
    } catch (error) {
      console.error("Error loading foods:", error);
      Alert.alert("Error", "Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFood = async (foodId) => {
    Alert.alert("Delete Food", "Are you sure you want to delete this food?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFood(foodId);
            loadFoods(); // Refresh the list
            Alert.alert("Success", "Food deleted successfully");
          } catch (error) {
            Alert.alert("Error", "Failed to delete food");
          }
        },
      },
    ]);
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.foodItem}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDescription}>{item.description}</Text>
        <Text style={styles.foodQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <View style={styles.foodActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("EditFood", { foodId: item.id })}
        >
          <Icon name="edit" size={20} color="#4EA72E" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteFood(item.id)}
        >
          <Icon name="trash" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#4EA72E" />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={foods}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No foods found in this group</Text>
        }
      />

      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={() => navigation.navigate("CreateFood", { groupId })}
      >
        <Icon name="plus" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    padding: 15,
  },
  foodItem: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  foodQuantity: {
    fontSize: 14,
    color: "#4EA72E",
    fontWeight: "500",
  },
  foodActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 10,
    marginLeft: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
  floatingAddButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4EA72E",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default GroupFoodScreen;
