import { getToken, setToken } from "../controller/AuthController";
import { getUserFromStorage } from "./UserController";
const API_URL = "http://13.229.127.51:8080/api/user/shopping";

// Hàm để lấy Bearer token
const getBearerAuth = async () => {
  const token = await getToken(); // Lấy token từ AsyncStorage
  return `Bearer ${token}`; // Trả về chuỗi Bearer token
};
const getUser = async () => {
  const user = await getUserFromStorage(); // Lấy token từ AsyncStorage
  return user.id; // Trả về chuỗi Bearer token
};

function createShoppingList(data) {
  return getBearerAuth().then((bearerAuth) => {
    console.log("bearerAuth: " + bearerAuth);
    const data1 = JSON.stringify({
      name: data.name,
      note: data.note,
      date: data.date.toISOString(),
      assignToUserId: data.assignToUserId,
      belongToGroupId: data.belongToGroupId,
      ownerId: data.ownerId
    });
    console.log(data1)
    const groupUrl = `${API_URL}/`;
    return fetch(groupUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
      body: data1
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error creating shopping list:", error);
        throw error;
      });
  });
}

function createTask(data) {
  return getBearerAuth().then((bearerAuth) => {
    console.log("bearerAuth: " + bearerAuth);
    // console.log(userId);
    const groupUrl = `${API_URL}/task?listId=${data.listId}`;
    return fetch(groupUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
      body: JSON.stringify({
        foodId: data.foodId,
        quantity: data.quantity,
        done: data.done,
      })
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error creating task:", error);
        throw error;
      });
  });
}

function getAllShoppingList() {
  return getBearerAuth().then((bearerAuth) => {
    console.log("bearerAuth: " + bearerAuth);
    return getUser().then((userId) => {
      console.log(userId);
      const groupUrl = `${API_URL}/user/${userId}`;
      return fetch(groupUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: bearerAuth,
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("reasscasdvasdf: " + response);
            return response.json();
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        })
        .catch((error) => {
          console.error("Error fetching shopping list:", error);
          throw error;
        });
    });
  });
}

function updateTask(taskId, updatedTask) {
  console.log("Id   :", taskId);
  return getBearerAuth().then((bearerAuth) => {
    return fetch(`${API_URL}/task/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
      body: JSON.stringify(updatedTask),
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
        console.log("Task updated:", data);
        return data.data;
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  });
}

function updateList(listId, data) {
  console.log("Id   :", listId);
  return getBearerAuth().then((bearerAuth) => {
    return fetch(`${API_URL}/${listId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
      body: JSON.stringify({
        name: data.name,
        note: data.note,
        date: data.date,
        assignToUserId: data.assignToUserId,
        belongToGroupId: data.belongToGroupId,
        ownerId: data.ownerId
      })
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
        console.log("List updated:", data);
        return data;
      })
      .catch((error) => {
        console.error("Error updating list:", error);
      });
  });
}



function getAllShoppingListByGroup(groupId) {
  return getBearerAuth().then((bearerAuth) => {
    console.log("bearerAuth: " + bearerAuth);
    // console.log(userId);
    const groupUrl = `${API_URL}/group/${groupId}`;
    return fetch(groupUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("reasscasdvasdf: " + response);
          return response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching shopping list:", error);
        throw error;
      });
  });
}

function getAllTaskByList(listId) {
  return getBearerAuth().then((bearerAuth) => {
    console.log("bearerAuth: " + bearerAuth);
    // console.log(userId);
    const groupUrl = `${API_URL}/${listId}`;
    return fetch(groupUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        throw error;
      });
  });
}

function deleteTask(taskId) {
  return getBearerAuth().then((bearerAuth) => {
    return fetch(`${API_URL}/task/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Task deleted successfully");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error deleting Task:", error);
      });
  });
}

function deleteShoppingList(listId) {
  return getBearerAuth().then((bearerAuth) => {
    return fetch(`${API_URL}/${listId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("List deleted successfully");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error deleting List:", error);
      });
  });
}

export { getAllTaskByList, getAllShoppingList, updateTask, getAllShoppingListByGroup, createShoppingList, createTask, updateList, deleteShoppingList, deleteTask };
