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
import { Login } from "../controller/AuthController";

const LoginScreen = ({navigation}) => {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    try {
      const data = await Login(email, password, navigation);
      if (data?.token) {
        console.log("Login successful:", data);
        
      } else {
        alert("Login failed! Please check your credentials.");
      }
      
    }
    catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://t4.ftcdn.net/jpg/05/38/99/75/360_F_538997597_wXUHi67t6VMLEcVTW2c6D2P9F0e1f6yE.jpg",
        }}
        style={styles.image}
      />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to FOODIES</Text>
        <Text style={styles.subText}>Let's start listing your grocery</Text>
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
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={[styles.button, styles.facebookButton]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

       <Text style={styles.subText}>Đăng nhập bằng phương thức khác</Text>
      <TouchableOpacity style={[styles.button, styles.facebookButton]}>
        <Icon name="facebook" size={24} color="white" />
        <Text style={styles.buttonText}>Sign in with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.emailButton]}>
        <Icon name="envelope" size={24} color="white" />
        <Text style={styles.buttonText}>Sign in with Email</Text>
      </TouchableOpacity>


      <Text style={styles.subText}>Chưa có tài khoản?</Text>
      <TouchableOpacity style={[styles.button, styles.facebookButton]}>
        <Text style={styles.buttonText}>Đăng ký</Text>
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

export default LoginScreen;
