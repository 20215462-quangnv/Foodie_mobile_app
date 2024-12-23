const API_URL = 'http://192.168.0.6:8080/api/user/profile';

const bearerAuth = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzQ5NTQ1ODQsImV4cCI6MTczNTA0MDk4NH0.rJpLbh4hbUt5g5wRqQBYKVLimiqmublL-ypIQ5zg3hw`;
function getUserProfile() {
    console.log(bearerAuth);
    return fetch(API_URL, {
      method: 'GET',  // Phương thức GET
      headers: {
        'Content-Type': 'application/json',
        // Nếu cần thêm token xác thực, có thể thêm vào header
        // 'Authorization': `Bearer ${token}`,
        'Authorization': bearerAuth
      },
    })
      .then(response => {
        if (response.ok) {
          console.log(response);
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

export {getUserProfile};
  
