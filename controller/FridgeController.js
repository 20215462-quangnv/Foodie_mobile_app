import { getToken } from "../controller/AuthController";
import { getUserProfile } from './UserController';
const API_URL = 'http://192.168.0.6:8080/api/fridge';

const getBearerAuth = async () => {
  const token = await getToken();
  return `Bearer ${token}`;
};

async function getFridgeGroup(groupId) {
    const groupUrl = `${API_URL}/group/${groupId}`;
  
    try {
      const bearerAuth = await getBearerAuth();
      const response = await fetch(groupUrl, {
        method: 'GET',  
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearerAuth,
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
      console.error('Error fetching fridge group:', error);  
    }
}
  
async function getAllFridgeGroup() {
    try {
        const bearerAuth = await getBearerAuth();
        const userProfile = await getUserProfile();
        const groupIds = userProfile.data.groupIds; 
      console.log(groupIds);
        const allGroups = await Promise.all(
            groupIds.map(groupId => 
                getFridgeGroup(groupId, bearerAuth)
            )
        );
        console.log("allGroupFridge "+allGroups);
      return allGroups;
      
    } catch (error) {
        console.error('Error fetching all fridge groups:', error);
        throw error;
    }
}

export { getFridgeGroup, getAllFridgeGroup };
