import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { updateUserProfile } from "../../../controller/UserController";

const EditProfileScreen = ({ route, navigation }) => {
  const { profile } = route.params;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    phoneNumber: profile?.phoneNumber || "",
  });

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      Alert.alert("Error", "Full name is required");
      return;
    }

    try {
      setLoading(true);
      await updateUserProfile({
        ...profile,
        ...formData,
      });
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
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
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) =>
              setFormData({ ...formData, fullName: text })
            }
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.email}
            editable={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, phoneNumber: text })
            }
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Icon name="check" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
  },
  saveButton: {
    backgroundColor: "#4EA72E",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProfileScreen;
