import { getToken } from "../controller/AuthController";
const API_URL = "http://192.168.43.107:8080/api/recipe";

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
          //console.log(response.json());
          return response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error); // Xử lý lỗi
        throw error; // Ném lỗi ra ngoài để frontend có thể xử lý
      });
  });
}

function getRecipeById(recipeId) {
  return getBearerAuth().then((bearerAuth) => {
    return fetch(`${API_URL}/${recipeId}`, {
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
        console.error(`Error fetching recipe with ID ${recipeId}:`, error);
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
        console.log("Recipe created:", data); // Xử lý dữ liệu trả về
        return data.data;
      })
      .catch((error) => {
        console.error("Error creating recipe:", error);
      });
  });
}

function updateRecipe(recipeId, updatedRecipe) {
  console.log("Id   :", recipeId);
  return fetch(`${API_URL}/${recipeId}`, {
    method: "PUT", // Phương thức PUT
    headers: {
      "Content-Type": "application/json",
      // Nếu cần thêm token xác thực, có thể thêm vào header
      // 'Authorization': `Bearer ${token}`,
      Authorization: bearerAuth,
    },
    body: JSON.stringify(updatedRecipe), // Dữ liệu sẽ được gửi đi dưới dạng JSON
  })
    .then((response) => {
      if (response.ok) {
        console.log(response);
        return response.json(); // Chuyển phản hồi thành JSON
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .then((data) => {
      console.log("Recipe updated:", data); // Xử lý dữ liệu trả về
      return data.data;
    })
    .catch((error) => {
      console.error("Error updating recipe:", error); // Xử lý lỗi
    });
}

function deleteRecipe(recipeId) {
  console.log("recipeId " + recipeId);
  return fetch(`${API_URL}/${recipeId}`, {
    method: "DELETE", // Phương thức DELETE
    headers: {
      "Content-Type": "application/json",
      // Nếu cần thêm token xác thực, có thể thêm vào header
      // 'Authorization': `Bearer ${token}`,
      Authorization: bearerAuth,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Recipe deleted successfully"); // Xử lý nếu xóa thành công
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Error deleting recipe:", error);
    });
}
export {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
};
