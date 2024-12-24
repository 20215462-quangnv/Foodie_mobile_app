// Định nghĩa URL cơ bản của API
const API_URL = "http://10.0.2.2:8080/api/user/group";
const bearerAuth = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzUwNDc0NzMsImV4cCI6MTczNTEzMzg3M30.l8kLlTpFFtACXXeA6azw04YD_9LVfeWjOujzdRZrydc`;

// Hàm gọi API PUT để update nhóm
function updateGroup(groupData) {
  return fetch(`${API_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
    body: JSON.stringify(groupData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Error creating group:", error);
      throw error;
    });
}

// Hàm gọi API POST để thêm một thành viên vào nhóm
function addMemberToGroup(groupId, userId) {
  return fetch(`${API_URL}/${groupId}/members/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log(`User ${userId} added to group ${groupId} successfully.`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Error adding member to group:", error);
      throw error;
    });
}

// Hàm gọi API DELETE để xóa một thành viên khỏi nhóm
function removeMemberFromGroup(groupId, userId) {
  return fetch(`${API_URL}/${groupId}/members/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log(
          `User ${userId} removed from group ${groupId} successfully.`
        );
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Error removing member from group:", error);
      throw error;
    });
}

// Hàm gọi API POST để tạo một nhóm cụ thể (ví dụ tạo nhóm nâng cao)
function createGroup(groupData) {
  return fetch(
    `${API_URL}/create?name=${groupData.name}&description=${groupData.description}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerAuth,
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Error creating specific group:", error);
      throw error;
    });
}

// Hàm gọi API GET để lấy thông tin một nhóm
function getGroupById(groupId) {
  return fetch(`${API_URL}/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error(`Error fetching group with ID ${groupId}:`, error);
      throw error;
    });
}

// Hàm gọi API DELETE để xóa một nhóm
function deleteGroup(groupId) {
  return fetch(`${API_URL}/${groupId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Group ${groupId} deleted successfully.`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error(`Error deleting group with ID ${groupId}:`, error);
      throw error;
    });
}

// Hàm gọi API GET để lấy danh sách tất cả thành viên trong nhóm
function getGroupMembers(groupId) {
  return fetch(`${API_URL}/${groupId}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error(
        `Error fetching members of group with ID ${groupId}:`,
        error
      );
      throw error;
    });
}

// Hàm gọi API GET để lấy danh sách tất cả các nhóm
function getAllGroups() {
  return fetch(`${API_URL}/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .catch((error) => {
      console.error("Error fetching all groups:", error);
      throw error;
    });
}

// Xuất các hàm để sử dụng ở nơi khác
export {
  createGroup,
  addMemberToGroup,
  removeMemberFromGroup,
  updateGroup,
  getGroupById,
  deleteGroup,
  getGroupMembers,
  getAllGroups,
};
