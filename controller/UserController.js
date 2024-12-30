import { getToken } from "../controller/AuthController";

const API_URL = "http://192.168.43.107:8080/api/user/profile";

const getBearerAuth = async () => {
  const token = await getToken(); // Lấy token từ AsyncStorage
  return `Bearer ${token}`; // Trả về chuỗi Bearer token
};

function getUserProfile() {
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
          return response.json(); // Nếu mã phản hồi là 200, chuyển đổi phản hồi thành JSON
        } else {
          throw new Error(`HTTP error! status: ${response.status}`); // Nếu mã phản hồi không phải 200, ném lỗi
        }
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error); // Xử lý lỗi
        throw error;
      });
  });
}

export { getUserProfile };
