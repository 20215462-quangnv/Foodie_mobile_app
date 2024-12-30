import { getToken } from "../controller/AuthController";
import { getUserProfile } from "./UserController";
const API_URL = 'http://192.168.43.107:8080/api/meal';

const getBearerAuth = async () => {
    const token = await getToken(); // Lấy token từ AsyncStorage
    return `Bearer ${token}`; // Trả về chuỗi Bearer token
  };

    const getMealPlan = async (groupId, date) => {
        try {
            const bearerAuth = await getBearerAuth();
            const response = await fetch(`${API_URL}?date=${date}&groupId=${groupId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': bearerAuth,
                },
            })
            if (response.ok) {
                console.log('fetch meal-plan thanh cong')
                return response.json();
            }
            else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (error) {
            console.error('Error fetching meal-plan:', error); 
            throw error;
        }
    };
    const createMealPlan = async (newPlan) => {
        try {
            const bearerAuth = await getBearerAuth();
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': bearerAuth,
                },
                body: JSON.stringify(newPlan)
            })
            if (response.ok) {
                console.log('tao meal-plan thanh cong')
                return response.json();
            }
            else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (error) {
            console.error('Error creating meal-plan:', error); 
            throw error;
        }
    };
    const deleteMealPlan = async (planId) => {
        try {
            const bearerAuth = await getBearerAuth();
            const response = await fetch(`${API_URL}/${planId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': bearerAuth,
                },
            })
            if (response.ok) {
                console.log('xoa mealPlan thanh cong')
                return response.json();
            }
            else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (error) {
            console.error('Error deleting meal-plan:', error); 
            throw error;
        }
    };
    const updateMealPlan = async (planId) => {
        try {
            const bearerAuth = await getBearerAuth();
            const response = await fetch(`${API_URL}?Id=${planId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': bearerAuth,
                },
            })
            if (response.ok) {
                console.log('update mealPlan thanh cong')
                return response.json();
            }
            else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (error) {
            console.error('Error updating meal-plan:', error); 
            throw error;
        }
    };
    const getAllMealPlan = async (listGroup) => {
        try {
            const bearerAuth = await getBearerAuth();
            const queryString = listGroup.map(group => `groupIds=${group.id}`).join('&');
            const endpoint = `${API_URL}/groups?${queryString}`;

            // Fetch request
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerAuth,
                  },
            });
            if (response.ok) {
                console.log('fetch meal-plan thanh cong')
                return response.json();
            }
            else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        catch (error) {
            console.error('Error fetching meal-plan:', error); 
            throw error;
        }
    }

export {
    getMealPlan,
    deleteMealPlan,
    updateMealPlan,
    getAllMealPlan,
    createMealPlan
}