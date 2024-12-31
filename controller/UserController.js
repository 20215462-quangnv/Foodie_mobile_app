import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken } from "./AuthController";

const BASE_URL = "http://13.229.127.51:8080/api/user";

const getBearerAuth = async () => {
  const token = await getToken();
  return `Bearer ${token}`;
};

const getUserFromStorage = async () => {
  try {
    const userProfile = await AsyncStorage.getItem("userProfile");
    return userProfile ? JSON.parse(userProfile) : null;
  } catch (error) {
    console.error("Error retrieving user profile from storage:", error);
    return null;
  }
};

// Get user profile
async function getUserProfile() {
  try {
    const bearerAuth = await getBearerAuth();
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      await AsyncStorage.setItem("userProfile", JSON.stringify(userData.data));
      return userData;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Update user profile
async function updateUserProfile(profileData) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${BASE_URL}/edit/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
    body: JSON.stringify(profileData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
      throw error;
    });
}

// Update profile photo
async function updateProfilePhoto(photoData) {
  const bearerAuth = await getBearerAuth();
  const formData = new FormData();
  formData.append("photo", photoData);

  return fetch(`${BASE_URL}/edit/profile/photo`, {
    method: "PUT",
    headers: {
      Authorization: bearerAuth,
    },
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error updating profile photo:", error);
      throw error;
    });
}

// Change password
async function changePassword(passwordData) {
  const bearerAuth = await getBearerAuth();

  try {
    const userProfile = await getUserProfile();
    const userId = userProfile.data.id;

    const requestBody = {
      userId: userId,
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword,
    };

    return fetch(`${BASE_URL}/edit/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
      body: JSON.stringify(requestBody),
    }).then(async (response) => {
      const responseData = await response.json();
      if (response.ok) {
        return responseData;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    });
  } catch (error) {
    throw error;
  }
}

// Search users
async function searchUsers(query) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${BASE_URL}/search-user?query=${encodeURIComponent(query)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error searching users:", error);
      throw error;
    });
}

async function getUserByEmail(email) {
  try {
    const bearerAuth = await getBearerAuth();
    const response = await fetch(`${BASE_URL}/search-user?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      return userData;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Get user report by day
async function getUserReport(day) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${BASE_URL}/report/${day}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error fetching user report:", error);
      throw error;
    });
}

// Get all users
async function getAllUsers() {
  const bearerAuth = await getBearerAuth();
  return fetch(`${BASE_URL}/getAll`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error fetching all users:", error);
      throw error;
    });
}

export {
  getUserProfile,
  getUserFromStorage,
  getUserByEmail,
  updateUserProfile,
  updateProfilePhoto,
  changePassword,
  searchUsers,
  getUserReport,
  getAllUsers,
};
