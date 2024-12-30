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
import { changePassword } from "../../../controller/UserController";

const ChangePasswordScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async () => {
    if (
      !formData.oldPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return;
    }

    if (formData.newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      console.log("=== Change Password Request ===");
      console.log("Sending password data:", {
        oldPassword: "***",
        newPassword: "***",
        passwordLength: formData.newPassword.length,
      });

      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      Alert.alert("Success", "Password changed successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Change Password Error in Screen:", error);
      Alert.alert(
        "Error",
        "Failed to change password. Please check your current password."
      );
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
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            value={formData.oldPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, oldPassword: text })
            }
            placeholder="Enter current password"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            value={formData.newPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, newPassword: text })
            }
            placeholder="Enter new password"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text })
            }
            placeholder="Confirm new password"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleChangePassword}
        >
          <Icon name="lock" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Change Password</Text>
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

export default ChangePasswordScreen;
