import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getUserProfile } from "../controller/UserController";
import { getAllRecipes } from "../controller/RecipeController";
import { getAllGroups } from "../controller/GroupController";

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalGroups: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load user profile
      const profileResponse = await getUserProfile();
      setProfile(profileResponse.data);
      const userId = profileResponse.data.id;

      // Load recipes created by user
      const recipesResponse = await getAllRecipes();
      const userRecipes = recipesResponse.data.filter(
        (recipe) => recipe.author.id === userId
      );

      // Load groups where user is a member
      const groupsResponse = await getAllGroups();
      const userGroups = groupsResponse.data.filter((group) =>
        group.members.some((member) => member.id === userId)
      );

      setStats({
        totalRecipes: userRecipes.length,
        totalGroups: userGroups.length,
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      Alert.alert("Error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Icon name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#4EA72E" />
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {profile?.fullName?.charAt(0) || "U"}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.fullName || "User"}</Text>
        <Text style={styles.email}>{profile?.email || ""}</Text>
        <Text style={styles.phoneNumber}>
          {profile?.phoneNumber || "No phone number"}
        </Text>
      </View>

      {/* Dashboard Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Activity Dashboard</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="book"
            title="Recipes"
            value={stats.totalRecipes}
            color="#4EA72E"
          />
          <StatCard
            icon="users"
            title="Groups"
            value={stats.totalGroups}
            color="#FF6B6B"
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("EditProfile", { profile })}
        >
          <Icon name="edit" size={20} color="#4EA72E" />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Icon name="lock" size={20} color="#4EA72E" />
          <Text style={styles.actionText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#4EA72E",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4EA72E",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  phoneNumber: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#333",
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    padding: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
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
  actionText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
