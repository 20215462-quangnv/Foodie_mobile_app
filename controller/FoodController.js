// Định nghĩa URL của API
import Config from "react-native-config";
import { getUserProfile } from "./UserController";
const API_URL = "http://192.168.0.6:8080/api/user/food";

// Hàm gọi API GET để lấy tất cả các recipe
const bearerAuth = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzUwNDc0NzMsImV4cCI6MTczNTEzMzg3M30.l8kLlTpFFtACXXeA6azw04YD_9LVfeWjOujzdRZrydc`;
// Hàm gửi yêu cầu GET với groupId

async function getFoodByGroup(groupId) {
  const groupUrl = `${API_URL}/group/${groupId}`; // Tạo URL cho groupId cụ thể

  try {
    const response = await fetch(groupUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching fridge group:", error);
  }
}

async function getAllFoodByGroup() {
  try {
    const userProfile = await getUserProfile();
    console.log(userProfile);
    const groupIds = userProfile.data.groupIds; // Lấy danh sách groupIds từ user profile
    console.log(groupIds);
    const allGroups = await Promise.all(
      groupIds.map((groupId) => getFoodByGroup(groupId).data)
    );

    console.log("all " + allGroups); // Tổng hợp dữ liệu từ tất cả groupIds
    return allGroups;
  } catch (error) {
    console.error("Error fetching all fridge groups:", error);
    throw error;
  }
}

export { getAllFoodByGroup, getFoodByGroup };
