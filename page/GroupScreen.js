import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

// Mock API call to fetch recipes for the group
const fetchRecipes = async (page, limit = 10) => {
  // Mock data simulating API response
  const recipes = Array.from({ length: limit }, (_, i) => ({
    id: `recipe-${page * limit + i}`,
    owner: `Owner ${page * limit + i}`,
    name: `Recipe Name ${page * limit + i}`,
    description: `This is a detailed description of Recipe ${page * limit + i}`,
    createdDate: new Date(Date.now() - i * 3600000).toISOString(), // Mock timestamp
  }));
  return recipes;
};

const GroupScreen = () => {
  const [recipes, setRecipes] = useState([]); // Recipes state
  const [page, setPage] = useState(0); // Current page for pagination
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // Whether there's more data to load

  // Fetch recipes when the component mounts or when `page` changes
  useEffect(() => {
    const loadRecipes = async () => {
      if (loading || !hasMore) return; // Prevent duplicate loading
      setLoading(true);
      try {
        const newRecipes = await fetchRecipes(page);
        if (newRecipes.length === 0) {
          setHasMore(false); // No more data
        } else {
          setRecipes((prev) => [...newRecipes, ...prev]); // Append new recipes at the top
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
      setLoading(false);
    };
    loadRecipes();
  }, [page]);

  // Handler for loading more recipes
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Render item for each recipe
  const renderItem = ({ item }) => {
    return (
      <View style={styles.recipeContainer}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.owner
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </Text>
        </View>
        {/* Content */}
        <View style={styles.recipeContent}>
          <Text style={styles.recipeName}>{item.name}</Text>
          <Text style={styles.recipeDescription}>{item.description}</Text>
          <Text style={styles.recipeDate}>
            {new Date(item.createdDate).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Recipes List */}
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore} // Trigger loading more data
        onEndReachedThreshold={0.5} // Load more when 50% near the end
        ListFooterComponent={loading && <ActivityIndicator />} // Show loader
        inverted // Show newest recipe at the bottom
      />
    </View>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  recipeContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
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
  recipeContent: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#6c757d",
  },
  recipeDate: {
    fontSize: 12,
    color: "#adb5bd",
    marginTop: 5,
  },
});
