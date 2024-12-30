import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  getUserProfile,
  updateProfilePhoto,
  getUserReport,
} from "../controller/UserController";
import { getAllRecipes } from "../controller/RecipeController";
import { getAllGroups } from "../controller/GroupController";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalGroups: 0,
  });
  const [reportDays, setReportDays] = useState("7");
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    loadReportData(reportDays);
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

  const loadReportData = async (days) => {
    try {
      const response = await getUserReport(days);
      setReportData(response.data);
    } catch (error) {
      console.error("Error loading report:", error);
    }
  };

  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon name={icon} size={20} color={color} />
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const handleChangePhoto = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your photos"
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const photoData = {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "profile-photo.jpg",
        };

        try {
          await updateProfilePhoto(photoData);
          await loadDashboardData();
          Alert.alert("Success", "Profile photo updated successfully");
        } catch (error) {
          Alert.alert("Error", "Failed to update profile photo");
        }
      }
    } catch (error) {
      console.error("Error updating photo:", error);
      Alert.alert("Error", "Failed to access photo library");
    }
  };

  if (loading) {
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#4EA72E" />
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {profile?.photoUrl ? (
              <Image
                source={{ uri: profile.photoUrl }}
                style={styles.avatarImage}
                onError={() => {
                  // If image fails to load, show initial
                  <Text style={styles.avatarText}>
                    {profile?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </Text>;
                }}
              />
            ) : (
              <Text style={styles.avatarText}>
                {profile?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            )}
            <TouchableOpacity
              style={styles.editPhotoButton}
              onPress={handleChangePhoto}
            >
              <Icon name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.name}>{profile?.fullName || "User"}</Text>
        <Text style={styles.email}>{profile?.email || ""}</Text>
        <Text style={styles.phoneNumber}>
          {profile?.phoneNumber || "No phone number"}
        </Text>
      </View>

      {/* Dashboard Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Activity Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="book"
            title="My Recipes"
            value={stats.totalRecipes}
            subtitle="Total created recipes"
            color="#4EA72E"
          />
          <StatCard
            icon="users"
            title="My Groups"
            value={stats.totalGroups}
            subtitle="Active memberships"
            color="#FF6B6B"
          />
        </View>
      </View>

      {/* Analytics */}
      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.daysInputContainer}>
            <TextInput
              style={styles.daysInput}
              value={reportDays}
              onChangeText={(text) => setReportDays(text)}
              keyboardType="numeric"
              placeholder="Days"
            />
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => loadReportData(reportDays)}
            >
              <Icon name="refresh" size={16} color="#4EA72E" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="shopping-cart"
            title="Shopping Lists"
            value={reportData?.shoppingLists?.length || 0}
            subtitle={`Last ${reportDays} days`}
            color="#FFA41B"
          />
          <StatCard
            icon="check-circle"
            title="Completed Items"
            value={
              reportData?.shoppingLists?.reduce(
                (acc, list) =>
                  acc + list.details.filter((item) => item.done).length,
                0
              ) || 0
            }
            subtitle="Items checked off"
            color="#4ECDC4"
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
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: -5,
  },
  statCard: {
    flex: 1,
    minHeight: 120,
    margin: 5,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  statTitle: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statSubtitle: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
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
  avatarSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4EA72E",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  analyticsContainer: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  analyticsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  daysInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  daysInput: {
    width: 60,
    height: 36,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4EA72E",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
