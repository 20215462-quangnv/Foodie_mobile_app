// Định nghĩa URL của API
import Config from 'react-native-config';
import { getUserProfile } from './UserController';
const API_URL = 'http://192.168.0.6:8080/api/fridge';

// Hàm gọi API GET để lấy tất cả các recipe
const bearerAuth = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzM3MzQ2NTYsImV4cCI6MTczMzgyMTA1Nn0.JT2VxufdTmUW7UxSucq3rnaQkPe61QLo-ujqkemnBdc`;
// Hàm gửi yêu cầu GET với groupId



async function getFridgeGroup(groupId) {
    const groupUrl = `${API_URL}/group/${groupId}`;  // Tạo URL cho groupId cụ thể
  
    try {
      const response = await fetch(groupUrl, {
        method: 'GET',  
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}`,  
        },
      });
  
      if (response.ok) {
        const data = await response.json().data;  
        console.log(data);  
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching fridge group:', error);  
    }
  }
  
  async function getAllFridgeGroup() {
    try {
        const userProfile = await getUserProfile();
        const groupIds = userProfile.groupIds;  // Lấy danh sách groupIds từ user profile

        const allGroups = await Promise.all(
            groupIds.map(groupId => getFridgeGroup(groupId))
        );

        console.log(allGroups);  // Tổng hợp dữ liệu từ tất cả groupIds
        return allGroups;
    } catch (error) {
        console.error('Error fetching all fridge groups:', error);
        throw error;
    }
}

export { getFridgeGroup, getAllFridgeGroup };
