import { getToken } from "../controller/AuthController";
import { getUserFromStorage } from "./UserController";
const API_URL = "http://13.229.127.51:8080/api/fridge";

const getBearerAuth = async () => {
  const token = await getToken();
  return `Bearer ${token}`;
};

async function getFridgeGroup(groupId) {
  const groupUrl = `${API_URL}/group/${groupId}`;

  try {
    const bearerAuth = await getBearerAuth();
    const response = await fetch(groupUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("fridge: " + data);
      return data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching fridge group:", error);
  }
}

async function getAllFridgeGroup() {
  try {
    const bearerAuth = await getBearerAuth();
    const userProfile = await getUserFromStorage();
    const groupIds = userProfile.groupIds;
    console.log(groupIds);
    const allGroups = await Promise.all(
      groupIds.map((groupId) => getFridgeGroup(groupId, bearerAuth))
    );
    console.log("allGroupFridge " + allGroups);
    return allGroups;
  } catch (error) {
    console.error("Error fetching all fridge groups:", error);
    throw error;
  }
}
function createFridgeItem(newItem) {
  return getBearerAuth().then((bearerAuth) => {
    return fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .then((data) => {
        console.log("Item created:", data);
        return data.data;
      })
      .catch((error) => {
        console.error("Error creating fridge item:", error);
      });
  });
}
function updateFridgeItem(fridgeItemId, updatedFridgeItem) {
  console.log("Id   :", fridgeItemId);
  return getBearerAuth().then((bearerAuth) => {
    return fetch(`${API_URL}/${fridgeItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
      body: JSON.stringify(updatedFridgeItem),
    })
      .then((response) => {
        if (response.ok) {
          console.log(response);
          return response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .then((data) => {
        console.log("Fridge Item updated:", data);
        return data.data;
      })
      .catch((error) => {
        console.error("Error updating Fridge Item:", error);
      });
  });
}
function deleteFridgeItem(fridgeItemId) {
  console.log("fridgeItemId " + fridgeItemId);
  return getBearerAuth().then((bearerAuth) => {
    return fetch(`${API_URL}/${fridgeItemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Fridge Item deleted successfully");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error deleting Fridge Item:", error);
      });
  });
}

export {
  getFridgeGroup,
  getAllFridgeGroup,
  createFridgeItem,
  updateFridgeItem,
  deleteFridgeItem,
};
