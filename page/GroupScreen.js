import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

// Mock API call to fetch a group
const fetchGroupDetails = async (groupId) => {
  const response = await fetch(`/api/group/${groupId}`);
  const data = await response.json();
  return data.data.groupRecipes; // Return groupRecipes
};

// Fetch recipe details by recipeId
const fetchRecipeDetails = async (recipeId) => {
  const response = await fetch(`/api/recipe/${recipeId}`);
  const data = await response.json();
  return data.data; // Return the recipe details
};

const GroupScreen = ({ groupId }) => {
  const [groupRecipes, setGroupRecipes] = useState([]); // Group recipes data
  const [loading, setLoading] = useState(false); // Loading state
  const [recipes, setRecipes] = useState([]); // Array of recipes to display

  // Fetch group details and recipes
  useEffect(() => {
    const loadGroupData = async () => {
      setLoading(true);
      try {
        // Fetch the group recipes first
        const groupRecipes = await fetchGroupDetails(groupId);
        // For each recipeId, fetch its details
        const recipeDetailsPromises = groupRecipes.map(async (groupRecipe) => {
          const recipeDetails = await fetchRecipeDetails(groupRecipe.recipeId);
          return {
            ...recipeDetails,
            timestamp: groupRecipe.timestamp,
          };
        });
        const allRecipes = await Promise.all(recipeDetailsPromises);
        setRecipes(allRecipes);
      } catch (error) {
        console.error("Error fetching group or recipe data:", error);
      }
      setLoading(false);
    };

    loadGroupData();
  }, [groupId]);

  // Render each recipe item as a bubble
  const renderItem = ({ item }) => {
    return (
      <View style={styles.bubbleContainer}>
        {/* Owner Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.owner?.fullName?.split(" ")[0]?.[0]?.toUpperCase()}
          </Text>
        </View>
        {/* Recipe bubble */}
        <View style={styles.bubble}>
          <Text style={styles.recipeName}>{item.name}</Text>
          <Text style={styles.recipeDescription}>{item.description}</Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* FlatList showing all recipes in the group */}
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={loading && <ActivityIndicator />}
        inverted // Show newest recipe at the bottom
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
