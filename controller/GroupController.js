import { getToken } from "./AuthController";

// Base URL for the API
const API_URL = "http://10.0.2.2:8080/api/user/group";

const getBearerAuth = async () => {
  const token = await getToken();
  return `Bearer ${token}`;
};

// Update group
async function updateGroup(groupData) {
  const bearerAuth = await getBearerAuth();
  return fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
    body: JSON.stringify({
      id: groupData.id,
      name: groupData.name,
      description: groupData.description,
      enable: true,
    }),
  })
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      }
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    })
    .catch((error) => {
      console.error("Error updating group:", error);
      throw error;
    });
}

// Add member to group
async function addMemberToGroup(groupId, email) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${API_URL}/${groupId}/members?email=${email}`, {
    method: "POST",
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
      console.error("Error adding member to group:", error);
      throw error;
    });
}

// Remove member from group
async function removeMemberFromGroup(groupId, userId) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${API_URL}/${groupId}/members/${userId}`, {
    method: "DELETE",
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
      console.error("Error removing member from group:", error);
      throw error;
    });
}

// Create group
async function createGroup(groupData) {
  const bearerAuth = await getBearerAuth();
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
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error creating group:", error);
      throw error;
    });
}

// Get group by ID
async function getGroupById(groupId) {
  const bearerAuth = await getBearerAuth();
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
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error(`Error fetching group with ID ${groupId}:`, error);
      throw error;
    });
}

// Delete group
async function deleteGroup(groupId) {
  const bearerAuth = await getBearerAuth();
  return fetch(`${API_URL}/${groupId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerAuth,
    },
  })
    .then(async (response) => {
      if (response.ok) {
        try {
          return await response.json();
        } catch {
          return true;
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error(`Error deleting group with ID ${groupId}:`, error);
      throw error;
    });
}

// Get group members
async function getGroupMembers(groupId) {
  const bearerAuth = await getBearerAuth();
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
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error(
        `Error fetching members of group with ID ${groupId}:`,
        error
      );
      throw error;
    });
}

// Get all groups
async function getAllGroups() {
  const bearerAuth = await getBearerAuth();
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
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    })
    .catch((error) => {
      console.error("Error fetching all groups:", error);
      throw error;
    });
}

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
