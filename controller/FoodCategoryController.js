import { getToken } from "./AuthController";
import { getUserProfile } from "./UserController";

const API_URL = "http://10.0.2.2:8080/api/admin/category";

const getBearerAuth = async () => {
  const token = await getToken();
  return `Bearer ${token}`;
};

async function getAllCategory() {
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

export { getAllCategory };
