import { getToken } from "./AuthController";

const API_URL = "http://192.168.43.107:8080/api/admin/unit";

const getBearerAuth = async () => {
  const token = await getToken();
  return `Bearer ${token}`;
};

async function getAllUnit() {
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
function createUnit(newUnit) {
  return getBearerAuth().then(bearerAuth => {
    return fetch(`${API_URL}?unitName=${newUnit.unitName}&toGram=${newUnit.toGram}&description=${newUnit.description}`, {
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
function updateUnit(editedUnit, unitId) {
  return getBearerAuth().then(bearerAuth => {
    return fetch(`${API_URL}/${unitId}`, {
      method: 'PUT',  
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearerAuth,      
      },
      body: JSON.stringify(editedUnit)
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

function deleteUnit(unitId) {
  return getBearerAuth().then(bearerAuth => {
    return fetch(`${API_URL}/${unitId}`, {
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


export {getAllUnit, createUnit, updateUnit, deleteUnit};

