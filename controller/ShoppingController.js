import { getToken, setToken } from "../controller/AuthController";
import { getUserFromStorage } from "./UserController";
const API_URL = 'http://192.168.0.6:8080/api/user/shopping';

// Hàm để lấy Bearer token
const getBearerAuth = async () => {
  const token = await getToken();  // Lấy token từ AsyncStorage
  return `Bearer ${token}`;  // Trả về chuỗi Bearer token
};
const getUser = async () => {
  const user = await getUserFromStorage();  // Lấy token từ AsyncStorage
  return user.id;  // Trả về chuỗi Bearer token
};

function getAllShoppingList() {
 
  return getBearerAuth().then(bearerAuth => {
      return getUser().then(userId => {
        const groupUrl = `${API_URL}/user/${userId}`; 
          return fetch(groupUrl, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': bearerAuth,
              },
          })
              .then(response => {
                  if (response.ok) {
                      return response.json();
                  } else {
                      throw new Error(`HTTP error! status: ${response.status}`);
                  }
              })
              .catch(error => {
                  console.error('Error fetching shopping list:', error);
                  throw error;
              });
      });
  });
}

function updateTask(taskId, updatedTask) {
  console.log('Id   :', taskId); 
  return getBearerAuth().then(bearerAuth => {
    return fetch(`${API_URL}/${taskId}`, {
      method: 'PUT',  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearerAuth,      
      },
      body: JSON.stringify(updatedTask),  
    })
    .then(response => {
      if (response.ok) {
        console.log(response);
        return response.json();  
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .then(data => {
      console.log('Task updated:', data);  
      return data.data;
    })
    .catch(error => {
      console.error('Error updating task:', error); 
    });
  });
}


export { getAllShoppingList, updateTask };
