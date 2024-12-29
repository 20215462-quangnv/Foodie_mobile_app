import React, { createContext, useState, useEffect } from "react";
import { getAllFoodByGroup } from "./FoodController";


export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
    const [listFood, setListFood] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllFoodByGroup();
                setListFood(
                    data
                        .filter(item => item.data && item.data.length > 0)
                        .map(item => {
                            return item.data.map(subItem => ({
                                id: subItem.id,
                                name: subItem.name,
                                type: subItem.type,
                                description: subItem.description,
                                imageUrl: subItem.imageUrl,
                                measureUnit: subItem.measureUnit,
                                foodCategory: subItem.foodCategory.name,
                            }));
                        })
                        .flat()
                );
            } catch (error) {
                console.error("Error fetching food data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <FoodContext.Provider value={{ listFood, loading }}>
            {children}
        </FoodContext.Provider>
    );
};