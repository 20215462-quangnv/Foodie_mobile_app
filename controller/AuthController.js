import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.43.107:8080/api/user/auth/login";
import { useNavigation } from "@react-navigation/native";

// Lưu token vào AsyncStorage
const setToken = async (token) => {
  try {
    await AsyncStorage.setItem("userToken", token);
    console.log("Token saved successfully!");
  } catch (error) {
    console.error("Failed to save token:", error);
  }
};

// Lấy token từ AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (token !== null) {
      return token;
    } else {
      console.log("No token found");
      return null;
    }
  } catch (error) {
    console.error("Failed to retrieve token:", error);
    return null;
  }
};

// Đăng nhập và lưu token
async function Login(email, password, navigation) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.token) {
        // Lưu token vào AsyncStorage sau khi đăng nhập thành công
        await setToken(data.token);
        
        return data;
      } else {
        throw new Error("Token not found in response");
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.log("Login failed due to error:", error.message);
  }
}

async function Register(body, navigation) {
  try {
    const response = await fetch("http://192.168.43.107:8080/api/user/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.user) {
        // Lưu token vào AsyncStorage sau khi đăng nhập thành công
        console.log("Register success");
        return data;
      } else {
        throw new Error("Token not found in response");
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.log("Regíter failed due to error:", error.message);
  }
}

export { Login, setToken, getToken, Register};
