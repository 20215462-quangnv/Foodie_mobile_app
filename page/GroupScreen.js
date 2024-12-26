import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getGroupById } from "../controller/GroupController";
import { getRecipeById } from "../controller/RecipeController";

const GroupScreen = ({ route }) => {
  const { groupId } = route.params; // Lấy groupId từ route.params
  const [groupRecipes, setGroupRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const loadGroupData = async () => {
      setLoading(true);
      try {
        const response = await getGroupById(groupId);
        const groupRecipes = response.data.groupRecipes;
        console.log("Fetched groupRecipes:", groupRecipes);

        if (!groupRecipes) {
          console.error("groupRecipes is undefined or null");
          return; // Dừng việc thực thi nếu không có dữ liệu
        }

        if (!Array.isArray(groupRecipes)) {
          console.error("groupRecipes is not an array:", groupRecipes);
          return;
        }

        const recipeDetailsPromises = groupRecipes.map(async (groupRecipe) => {
          console.log(
            "Fetching recipe details for recipe:",
            groupRecipe.recipeId
          );
          const response = getRecipeById(groupRecipe.recipeId);
          const recipeDetails = response.data;
          return {
            ...recipeDetails,
          };
        });

        const allRecipes = await Promise.all(recipeDetailsPromises);
        console.log("All recipes:", allRecipes);
        setRecipes(allRecipes);
      } catch (error) {
        console.error("Error fetching group or recipe data:", error);
      }
      setLoading(false);
    };

    loadGroupData();
  }, [groupId]);

  const renderItem = ({ item }) => (
    <View style={styles.bubbleContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.author?.fullName?.split(" ")[0]?.[0]?.toUpperCase()}
        </Text>
      </View>
      <View style={styles.bubble}>
        <Text style={styles.recipeName}>{item.name}</Text>
        <Text style={styles.recipeDescription}>{item.description}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={loading && <ActivityIndicator />}
        inverted
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  bubbleContainer: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6c757d",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bubble: {
    backgroundColor: "#f4f7fa",
    padding: 10,
    borderRadius: 15,
    maxWidth: "80%",
    position: "relative",
    marginRight: 15,
    marginLeft: 10,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "#adb5bd",
    marginTop: 5,
  },
});

export default GroupScreen;
