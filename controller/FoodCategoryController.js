import { getToken } from "./AuthController";
const API_URL = "http://192.168.0.6:8080/api/admin/category";

const getBearerAuth = async () => {
  const token = await getToken();
  return `Bearer ${token}`;
};

async function getAllCategory() {
  const bearerAuth = await getBearerAuth();
  return fetch(`${API_URL}`, {
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
      console.error(`Error fetching unit error:`, error);
      throw error;
    });
}

function createCategory(newUnit) {
  return getBearerAuth().then(bearerAuth => {
    return fetch(`${API_URL}?name=${newUnit.name}&alias=${newUnit.alias}&description=${newUnit.description}`, {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearerAuth,      
      }
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
      console.log('Unit created:', data);  
      return data.data;
    })
    .catch(error => {
      console.error('Error creating Unit:', error);  
    });
  });
}
function updateCategory(editedCategory, categoryId) {
  return getBearerAuth().then(bearerAuth => {
    return fetch(`${API_URL}/${categoryId}`, {
      method: 'PUT',  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearerAuth,      
      },
      body: JSON.stringify(editedCategory)
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
      console.log('Unit updated:', data);  
      return data.data;
    })
    .catch(error => {
      console.error('Error updating Unit:', error);  
    });
  });
}

function deleteCategory(categoryId) {
  return getBearerAuth().then(bearerAuth => {
    return fetch(`${API_URL}/${categoryId}`, {
      method: 'DELETE',  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearerAuth,      
      },
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
      console.log('Unit updated:', data);  
      return data.data;
    })
    .catch(error => {
      console.error('Error updating Unit:', error);  
    });
  });
}

export {getAllCategory, createCategory, updateCategory, deleteCategory};

