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

const brightColors = [
  "#4EA72E", // Your app's green
  "#FF6B6B", // Coral red
  "#4ECDC4", // Turquoise
  "#45B7D1", // Sky blue
  "#96C93D", // Lime green
  "#FFA41B", // Orange
  "#845EC2", // Purple
  "#FF9671", // Peach
  "#00C9A7", // Mint
  "#008F7A", // Teal
];

const getRandomBrightColor = (userId) => {
  // Use userId to consistently get same color for same user
  const index = userId
    ? userId
        .toString()
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : 0;
  return brightColors[index % brightColors.length];
};

const GroupScreen = ({ route }) => {
  const { groupId } = route.params; // Get groupId from route params
  const [recipes, setRecipes] = useState([]);
  const [groupDetails, setGroupDetails] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGroupData = async () => {
      setLoading(true);
      try {
        const response = await getGroupById(groupId);
        console.log("Fetched group:", response.data);
        const groupRecipes = response.data.groupRecipes || [];
        // Extract the group name and description
        const { name, description } = response.data;

        setGroupDetails({ name, description });

        const recipeDetailsPromises = groupRecipes.map(async (groupRecipe) => {
          const recipeResponse = await getRecipeById(groupRecipe.recipeId);
          console.log("Fetched recipe:", recipeResponse.data);
          return recipeResponse.data;
        });

        const allRecipes = await Promise.all(recipeDetailsPromises);
        setRecipes(allRecipes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [groupId]);

  const renderItem = ({ item }) => {
    const createdAt = new Date(item.createdAt);
    const formattedDate = createdAt.toLocaleString("en-US", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const avatarColor = getRandomBrightColor(item.author?.id);

    return (
      <View style={styles.bubbleContainer}>
        <Text style={styles.authorFullName}>{item.author?.fullName}</Text>
        <View style={styles.contentContainer}>
          <View
            style={[styles.avatarContainer, { backgroundColor: avatarColor }]}
          >
            <Text style={styles.avatarText}>
              {item.author?.fullName?.split(" ")[0]?.[0]?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.bubble}>
            <Text style={styles.recipeTitle}>Recipe</Text>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeDescription}>{item.description}</Text>
          </View>
        </View>
        <Text style={styles.timestamp}>{formattedDate}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Group Info */}
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{groupDetails.name}</Text>
        <Text style={styles.groupDescription}>{groupDetails.description}</Text>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Unique key
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
  groupInfo: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  groupName: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#343a40",
    marginBottom: 5,
  },
  groupDescription: {
    fontSize: 16,
    color: "#6c757d",
  },
  bubbleContainer: {
    flexDirection: "column",
    padding: 10,
    marginBottom: 15,
    alignItems: "flex-start",
  },
  authorFullName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#343a40",
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 40,
  },
  bubble: {
    backgroundColor: "#4EA72E15", // Very light green with opacity
    padding: 10,
    borderRadius: 15,
    maxWidth: "80%",
    position: "relative",
    alignItems: "flex-start",
    borderLeftWidth: 3,
    borderLeftColor: "#4EA72E",
  },
  recipeTitle: {
    backgroundColor: "#4EA72E30", // Semi-transparent green
    padding: 5,
    borderRadius: 8,
    marginBottom: 8,
    fontWeight: "bold",
    fontSize: 14,
    color: "#4EA72E",
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
    marginTop: 10,
    alignSelf: "center",
    width: "100%",
    textAlign: "center",
  },
});

export default GroupScreen;
