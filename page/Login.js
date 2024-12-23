import React from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const LoginScreen = ({navigation}) => {
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
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={[styles.button, styles.facebookButton]}>
        <Icon name="facebook" size={24} color="white" />
        <Text style={styles.buttonText}>Sign in with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.emailButton]}>
        <Icon name="envelope" size={24} color="white" />
        <Text style={styles.buttonText}>Sign in with Email</Text>
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
    backgroundColor: "#f5f5f5",
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
