// Định nghĩa URL cơ bản của API
const BASE_API_URL = "http://localhost:8080/api/user/group";

// Hàm gọi API PUT để tạo một nhóm mới
function createGroup(groupData) {
  return fetch(`${BASE_API_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
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
  return fetch(`${BASE_API_URL}/${groupId}/members/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  return fetch(`${BASE_API_URL}/${groupId}/members/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
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
function createSpecificGroup(groupData) {
  return fetch(`${BASE_API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
      console.error("Error creating specific group:", error);
      throw error;
    });
}

// Hàm gọi API GET để lấy thông tin một nhóm
function getGroupById(groupId) {
  return fetch(`${BASE_API_URL}/${groupId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
  return fetch(`${BASE_API_URL}/${groupId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
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
  return fetch(`${BASE_API_URL}/${groupId}/members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
  return fetch(`${BASE_API_URL}/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
  createSpecificGroup,
  getGroupById,
  deleteGroup,
  getGroupMembers,
  getAllGroups,
};
