// Định nghĩa URL của API
import Config from 'react-native-config';
import { DataTable } from 'react-native-paper';
const API_URL = 'http://192.168.1.27:8080/api/recipe';

// Hàm gọi API GET để lấy tất cả các recipe
const bearerAuth = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzQ3NjkyOTgsImV4cCI6MTczNDg1NTY5OH0.e2FDy4j58cqspLbNlbaxl56pjs_8Iq1C7GooOz9-EP8`;
function getAllRecipes() {
  console.log(bearerAuth);
  return fetch(API_URL, {
    method: 'GET',  // Phương thức GET
    headers: {
      'Content-Type': 'application/json',
      // Nếu cần thêm token xác thực, có thể thêm vào header
      // 'Authorization': `Bearer ${token}`,
      'Authorization': bearerAuth
      }
  })
    .then(response => {
      if (response.ok) {
        //console.log(response.json());
        return response.json();  // Nếu mã phản hồi là 200, chuyển đổi phản hồi thành JSON
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);  // Nếu mã phản hồi không phải 200, ném lỗi
      }
    })
    .catch(error => {
      console.error('Error fetching recipes:', error);  // Xử lý lỗi
      throw error;  // Ném lỗi ra ngoài để frontend có thể xử lý
    });
}

// Hàm gọi API POST để tạo một recipe mới
function createRecipe(newRecipe) {
  fetch(API_URL, {
    method: 'POST',  // Phương thức POST
    headers: {
      'Content-Type': 'application/json',
      // Nếu cần thêm token xác thực, có thể thêm vào header
      // 'Authorization': `Bearer ${token}`,
      'Authorization': bearerAuth      
    },
    body: JSON.stringify(newRecipe),  // Dữ liệu sẽ được gửi đi dưới dạng JSON
  })
    .then(response => {
      if (response.ok) {
        return response.json();  // Chuyển phản hồi thành JSON
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .then(data => {
      console.log('Recipe created:', data);  // Xử lý dữ liệu trả về
      return data.data;
    })
    .catch(error => {
      console.error('Error creating recipe:', error);  // Xử lý lỗi
    });
}

// Hàm gọi API PUT để cập nhật một recipe
function updateRecipe(recipeId, updatedRecipe) {
  fetch(`${API_URL}/${recipeId}`, {
    method: 'PUT',  // Phương thức PUT
    headers: {
      'Content-Type': 'application/json',
      // Nếu cần thêm token xác thực, có thể thêm vào header
      // 'Authorization': `Bearer ${token}`,
      'Authorization': bearerAuth      
    },
    body: JSON.stringify(updatedRecipe),  // Dữ liệu sẽ được gửi đi dưới dạng JSON
  })
    .then(response => {
      if (response.ok) {
        return response.json();  // Chuyển phản hồi thành JSON
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .then(data => {
      console.log('Recipe updated:', data);  // Xử lý dữ liệu trả về
      return data.data;
    })
    .catch(error => {
      console.error('Error updating recipe:', error);  // Xử lý lỗi
    });
}

// Hàm gọi API DELETE để xóa một recipe
function deleteRecipe(recipeId) {
  fetch(`${API_URL}/${recipeId}`, {
    method: 'DELETE',  // Phương thức DELETE
    headers: {
      'Content-Type': 'application/json',
      // Nếu cần thêm token xác thực, có thể thêm vào header
      // 'Authorization': `Bearer ${token}`,
      'Authorization': bearerAuth      
    },
  })
    .then(response => {
      if (response.ok) {
        console.log('Recipe deleted successfully');  // Xử lý nếu xóa thành công
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch(error => {
      console.error('Error deleting recipe:', error);  // Xử lý lỗi
    });
}

// Expose các hàm để có thể sử dụng ở nơi khác
export { getAllRecipes, createRecipe, updateRecipe, deleteRecipe };
