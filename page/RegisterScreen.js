import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "./styles/RootStyle";
import { Register } from "../controller/AuthController";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = ({ navigation, setShowFooter, setShowFooterAdmin }) => {

    const [email, setEmail] = useState();
    const [phoneNumber, setphoneNumber] = useState();
    const [fullName, setFullName] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

  const handleRegister = async () => {
    if (!email || !password || !fullName || !password || !confirmPassword) {
      alert("Please enter full information");
      return;
    }
    if (password !== confirmPassword) {
      alert("Please confirm your correct password");
      return;
    }

      try {
        const body = {
            email: email,
            phoneNumber: phoneNumber,
            fullName: fullName,
            password: password,
            language: 'vn',
            timezone: 7,
            deviceId: 'string',
        }
      const data = await Register(body, navigation);
      if (data?.token) {
          console.log("Register successful:", data);
           Alert.alert("Register successful!", [
        {
            text: "OK",
            onPress:  () => {
                navigation.navigate("Login");
            },
        },
        ]);
          
      } else {
        alert("Register failed! Please check your credentials.");
      }
      
    }
    catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to FOODIES</Text>
        <Text style={styles.subText}>Create your account</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your gmail"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

          <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        keyboardType="numeric"
        value={phoneNumber}
        onChangeText={(text) => setphoneNumber(text)}
          />
        <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />

       <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
          />
          <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />

      <TouchableOpacity style={[styles.button, styles.facebookButton]} onPress={handleRegister}>
        <Text style={styles.buttonText}>Tạo tài khoản</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "white",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 50,
    borderRadius: 10,
    marginBottom: 15,
  },
  facebookButton: {
    backgroundColor: "#3b5998",
  },
  emailButton: {
    backgroundColor: "#db4437",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default RegisterScreen;
