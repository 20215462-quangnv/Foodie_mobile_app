import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from "../controller/AuthController";

const API_URL = "http://192.168.43.107:8080/api/user";

const getBearerAuth = async () => {
  const token = await getToken(); // Lấy token từ AsyncStorage
  return `Bearer ${token}`; // Trả về chuỗi Bearer token
};
const getUserFromStorage = async () => {
  try {
    const userProfile = await AsyncStorage.getItem('userProfile');
    return userProfile ? JSON.parse(userProfile) : null;
  } catch (error) {
    console.error('Error retrieving user profile from storage:', error);
    return null;
  }
};


async function getUserProfile() {
  try {
    const bearerAuth = await getBearerAuth();
    const response = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearerAuth,
      },
    });

    if (response.ok) {
      const userData = await response.json(); 
      // Lưu dữ liệu vào AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(userData.data));
      return userData;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const bearerAuth = await getBearerAuth();
    const response = await fetch(`${API_URL}/search-user?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearerAuth,
      },
    });

    if (response.ok) {
      const userData = await response.json(); 
      // Lưu dữ liệu vào AsyncStorage
      return userData;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export { getUserProfile, getUserFromStorage, getUserByEmail };
