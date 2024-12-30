import { getToken } from "./AuthController";

const BASE_URL = "http://10.0.2.2:8080/api/user";

const getBearerAuth = async () => {
  const token = await getToken();
  return `Bearer ${token}`;
};

// Get user profile
async function getUserProfile() {
  const bearerAuth = await getBearerAuth();
  return fetch(`${BASE_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  })
    .then(async (response) => {
      const responseData = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Data:", JSON.stringify(responseData, null, 2));

      if (response.ok) {
        return responseData;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
      throw error;
    });
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

// Send notification
async function sendNotification(notificationData) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${BASE_URL}/send-notification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
    body: JSON.stringify(notificationData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
      throw error;
    });
}

// Save notification token
async function saveNotificationToken(token) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${BASE_URL}/save-notification-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
    body: JSON.stringify({ token }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error saving notification token:", error);
      throw error;
    });
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
  updateUserProfile,
  updateProfilePhoto,
  changePassword,
  sendNotification,
  saveNotificationToken,
  searchUsers,
  getUserReport,
  getAllUsers,
};
