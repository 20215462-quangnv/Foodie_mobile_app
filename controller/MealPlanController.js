const API_URL = 'http://localhost:8080/api/meal';

module.exports = {
    getMealPlan : async (groupId, date) => {
        try {
            const response = await fetch(`${API_URL}?date=${date}&groupId=${groupId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
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
    },
    createMealPlan : async (newPlan) => {
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
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
    },
    deleteMealPlan : async (planId) => {
        try {
            const response = await fetch(`${API_URL}?Id=${planId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
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
    },
    updateMealPlan : async (planId) => {
        try {
            const response = await fetch(`${API_URL}?Id=${planId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
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
    },
    getAllMealPlan : async (listGroup) => {
        try {
            const queryString = listGroup.map(group => `groupIds=${group.id}`).join('&');
            const endpoint = `http://localhost:8080/api/meal/groups?${queryString}`;

            // Fetch request
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
}