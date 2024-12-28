import { getToken } from "../controller/AuthController";
import { getUserProfile } from "./UserController";
const API_URL = "http://192.168.0.6:8080/api/user/food";

const getBearerAuth = async () => {
  const token = await getToken();
  return `Bearer ${token}`;
};
async function getFoodByGroup(groupId) {
  const groupUrl = `${API_URL}/group/${groupId}`; // Tạo URL cho groupId cụ thể

  try {
    const bearerAuth = await getBearerAuth();
    const response = await fetch(groupUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching food by group:", error);
  }
}

async function getAllFoodByGroup() {
  try {
    const userProfile = await getUserProfile();
    console.log(userProfile);
    const groupIds = userProfile.data.groupIds; // Lấy danh sách groupIds từ user profile
    console.log(groupIds);
    const allGroups = await Promise.all(
      groupIds.map((groupId) => getFoodByGroup(groupId))
    );
    return allGroups;
  } catch (error) {
    console.error("Error fetching all fridge groups:", error);
    throw error;
  }
}

export { getAllFoodByGroup, getFoodByGroup };
