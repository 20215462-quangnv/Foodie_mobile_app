import { getToken } from "./AuthController";

const API_URL = "http://10.0.2.2:8080/api/user/food";

const getBearerAuth = async () => {
  const token = await getToken();
  return `Bearer ${token}`;
};

// Create food
async function createFood(foodData) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
    body: JSON.stringify(foodData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error creating food:", error);
      throw error;
    });
}

// Update food
async function updateFood(foodId, foodData) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${API_URL}/update/${foodId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
    body: JSON.stringify(foodData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error updating food:", error);
      throw error;
    });
}

// Get food by ID
async function getFoodById(foodId) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${API_URL}/${foodId}`, {
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
      console.error(`Error fetching food with ID ${foodId}:`, error);
      throw error;
    });
}

// Get foods by group ID
async function getFoodsByGroupId(groupId) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${API_URL}/group/${groupId}`, {
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
      console.error(`Error fetching foods for group ${groupId}:`, error);
      throw error;
    });
}

// Delete food
async function deleteFood(foodId) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${API_URL}/delete/${foodId}`, {
    method: "DELETE",
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
      console.error(`Error deleting food with ID ${foodId}:`, error);
      throw error;
    });
}

export { createFood, updateFood, getFoodById, getFoodsByGroupId, deleteFood };
