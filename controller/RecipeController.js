import { getToken } from "../controller/AuthController";
const API_URL = "http://192.168.0.6:8080/api/recipe";

// Hàm để lấy Bearer token
const getBearerAuth = async () => {
  const token = await getToken(); // Lấy token từ AsyncStorage
  return `Bearer ${token}`; // Trả về chuỗi Bearer token
};

function getAllRecipes() {
  return getBearerAuth().then((bearerAuth) => {
    return fetch(API_URL, {
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
        console.error("Error fetching recipes:", error);
        throw error;
      });
  });
}

function getRecipeById(groupId) {
  return getBearerAuth().then((bearerAuth) => {
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
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching recipes by group:", error);
        throw error;
      });
  });
}

function createRecipe(newRecipe) {
  return getBearerAuth().then((bearerAuth) => {
    return fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
      body: JSON.stringify(newRecipe),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .then((data) => {
        console.log("Recipe created:", data);
        return data.data;
      })
      .catch((error) => {
        console.error("Error creating recipe:", error);
      });
  });
}

function updateRecipe(recipeId, updatedRecipe) {
  console.log("Id   :", recipeId);
  return getBearerAuth().then((bearerAuth) => {
    return fetch(`${API_URL}/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
      body: JSON.stringify(updatedRecipe),
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
        console.log("Recipe updated:", data);
        return data.data;
      })
      .catch((error) => {
        console.error("Error updating recipe:", error);
      });
  });
}

function deleteRecipe(recipeId) {
  console.log("recipeId " + recipeId);
  return getBearerAuth().then((bearerAuth) => {
    return fetch(`${API_URL}/${recipeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Recipe deleted successfully");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error deleting recipe:", error);
      });
  });
}

export {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
};
