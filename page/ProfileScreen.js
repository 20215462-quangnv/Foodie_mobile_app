import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getUserProfile } from "../controller/UserController";

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      setProfile(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#4EA72E" />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.photoContainer}>
          {profile?.photoUrl ? (
            <Image
              source={{ uri: profile.photoUrl }}
              style={styles.profilePhoto}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {profile?.fullName?.charAt(0) || "U"}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.editPhotoButton}
            onPress={() => navigation.navigate("EditPhoto")}
          >
            <Icon name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.name}>{profile?.fullName || "User"}</Text>
        <Text style={styles.email}>{profile?.email || ""}</Text>
        <Text style={styles.phoneNumber}>
          {profile?.phoneNumber || "No phone number"}
        </Text>
      </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#4EA72E",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  photoContainer: {
    position: "relative",
    marginBottom: -50,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarText: {
    fontSize: 40,
    color: "#4EA72E",
    fontWeight: "bold",
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
  profileInfo: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  phoneNumber: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  actions: {
    paddingHorizontal: 20,
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
