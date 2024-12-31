import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  getFoodsByGroupId,
  deleteFood,
  createFood,
  updateFood,
} from "../../../controller/FoodController";
import { getAllUnit } from "../../../controller/measureUnitController";
import { Picker } from '@react-native-picker/picker';
import { getAllCategory } from "../../../controller/FoodCategoryController";


const GroupFoodScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState({});
  const [editingItem, setEditingItem] = useState({});
  const [selectedItem, setSelectedItem] = useState();
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [unit, setUnit] = useState([]);
  const [category, setCategory] = useState([]);

  const [user, setUser] = useState(null);
  useEffect(() => {
      async function fetchData() {
        try {
          const data = await getUserFromStorage();  
          setUser(data)
        } catch (error) {
          setError('Error fetching recipes');
        }
      } 
      fetchData();  
  }, []); 

  useEffect(()=>{
    async function fetchData() {
      try {
        const data = await getAllUnit();  
        setUnit(data.data);
      } catch (error) {
        setError('Error fetching Unit');
      }
    } 
    fetchData();  
  },[])

  useEffect(()=>{
    async function fetchData() {
      try {
        const data = await getAllCategory();  
        setCategory(data.data);
      } catch (error) {
        setError('Error fetching Unit');
      }
    } 
    fetchData();  
  },[])



  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const response = await getFoodsByGroupId(groupId);
      console.log(response.data)
      setFoods(response.data);
    } catch (error) {
      console.error("Error loading foods:", error);
      Alert.alert("Error", "Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFood = async (foodId) => {
    Alert.alert("Delete Food", "Are you sure you want to delete this food?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFood(foodId);
            loadFoods(); // Refresh the list

            Alert.alert("Success", "Food deleted successfully");
          } catch (error) {
            Alert.alert("Error", "Failed to delete food");
          }
        },
      },
    ]);
  };

  const [selectedUnit, setSelectedUnit] = useState(unit[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState(category[0]?.id || null);

  const openAddItemModal = () => {
    setAddItemModalVisible(true);
    setAddingItem({});
  };
  const handleSaveAddedItem = () => {
      const newItem = {
        name: addingItem.name,
        type: addingItem.type,
        description: addingItem.description,
        image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.foodiesfeed.com%2F&psig=AOvVaw3TBquWpXhi7sEyyiNo5aWL&ust=1735636849376000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCchaaVz4oDFQAAAAAdAAAAABAE",
        groupId: groupId,
        ownerId: user.id,
        unitName: addingItem.unitName,
        foodCategoryAlias: addingItem.foodCategoryAlias
      }
      createFood(newItem)
      .then((createdFood) => {
          setFoods((prevItems) => [...prevItems, createdFood.data]);
          Alert.alert("Success", "Food deleted successfully");
          setAddItemModalVisible(false);
          console.log('Food successfully added:', createdFood.data);
      })
      .catch((error) => {
        console.error('Failed to create food:', error);
      });
  }

  const handleSaveEditedItem = (foodId, ownerId) => {
    const newItem = {
      name: editingItem.name,
      type: editingItem.type,
      description: editingItem.description,
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.foodiesfeed.com%2F&psig=AOvVaw3TBquWpXhi7sEyyiNo5aWL&ust=1735636849376000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCchaaVz4oDFQAAAAAdAAAAABAE",
      groupId: groupId,
      ownerId: ownerId,
      unitName: editingItem.unitName,
      foodCategoryAlias: editingItem.foodCategoryAlias
    }
    updateFood(foodId, newItem)
    .then((updatedFood) => {
        const newFoods = foods;
        for (let i = 0; i < newFoods.length; i++) {
          if (newFoods[i].id === updatedFood.data.id) {
            newFoods[i] = updatedFood.data
          }
        }
        setFoods(newFoods);
        Alert.alert("Success", "Food deleted successfully");
        setEditItemModalVisible(false);
        console.log('Food successfully updated:', updatedFood.data);
    })
    .catch((error) => {
      console.error('Failed to update food:', error);
    });
  }

  const handleEditFood = (item) => {
    setSelectedItem(item)
    setEditingItem({
      name: item.name,
      type: item.type,
      description: item.description,
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.foodiesfeed.com%2F&psig=AOvVaw3TBquWpXhi7sEyyiNo5aWL&ust=1735636849376000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCchaaVz4oDFQAAAAAdAAAAABAE",
      groupId: item.groupId,
      ownerId: item.owner.id,
      unitName: item.unitName,
      foodCategoryAlias: item.foodCategoryAlias
    })
    setEditItemModalVisible(true);
    setEditingItem({});
  }

  const renderFoodItem = ({ item }) => (
   
    <View style={styles.foodItem}>
       <View style={styles.foodInfo}>
        <Image  style={styles.imageWarning}  source={{ uri: item.imageUrl }}></Image>
      </View>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDescription}>{item.type}</Text>
        <Text style={styles.foodDescription}>{item.description}</Text>
      </View>
      <View style={styles.foodActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditFood(item)}
        >
          <Icon name="edit" size={20} color="#4EA72E" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteFood(item.id)}
        >
          <Icon name="trash" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#4EA72E" />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={foods}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No foods found in this group</Text>
        }
      />

      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={openAddItemModal}
      >
        <Icon name="plus" size={20} color="#fff" />
      </TouchableOpacity>


       <Modal
          animationType="fade"
          transparent={true}
          visible={addItemModalVisible}
          onRequestClose={() => setAddItemModalVisible(false)}
        >
              <View style={styles.modalBackground}>
                <ScrollView style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Add Item</Text>
                    <TextInput
                        style={styles.modalInput}
                      
                        onChangeText={(text) => setAddingItem({ ...addingItem, name: text })}
                        placeholder="Food Name"
                    />
                    <TextInput
                        style={styles.modalInput}
                        
                        onChangeText={(text) => setAddingItem({ ...addingItem, type: text })}
                        placeholder="Food type"
                        
                    />
                      <TextInput
                        style={styles.modalInput}
                        
                        onChangeText={(text) => setAddingItem({ ...addingItem, description: text })}
                        placeholder="Food des"
                    />

                  <Text style={styles.label}>Select a unit:</Text>
                    <Picker
                        selectedValue={selectedUnit}
                        style={styles.picker}
                        onValueChange={(itemValue) =>  setAddingItem({...addingItem, unitName: itemValue })}
                    >
                        {unit.map((item) => (
                            <Picker.Item label={item.unitName} value={item.id} key={item.id} />
                        ))}
                    </Picker>
                    <Text style={styles.selected}>
                        Selected Unit: {unit.find((u) => u.id === selectedUnit)?.unitName || 'None'}
                    </Text>
                      
                    <Text style={styles.label}>Select a category:</Text>
                    <Picker
                        selectedValue={selectedUnit}
                        style={styles.picker}
                        onValueChange={(itemValue) => setAddingItem({...addingItem, foodCategoryAlias: itemValue})}
                    >
                        {category.map((item) => (
                            <Picker.Item label={item.name} value={item.id} key={item.id} />
                        ))}
                    </Picker>
                    <Text style={styles.selected}>
                        Selected Unit: {unit.find((u) => u.id === selectedUnit)?.name || 'None'}
                    </Text>
                
                    <View style={styles.buttonHolder}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddedItem}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => { setAddItemModalVisible(false) }}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                
                    
                </ScrollView> 
              </View>
            </Modal>
            

            <Modal
              animationType="fade"
              transparent={true}
              visible={editItemModalVisible}
              onRequestClose={() => setEditItemModalVisible(false)}
            >
              <View style={styles.modalBackground}>
                <ScrollView style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Edit Food</Text>
                    <TextInput
                        style={styles.modalInput}
                        defaultValue={selectedItem?.name || ''}
                        onChangeText={(text) => setEditingItem({ ...editingItem, name: text })}
                        placeholder="Food Name"
                    />
                    <TextInput
                        style={styles.modalInput}
                        defaultValue={selectedItem?.type || ''}
                        onChangeText={(text) => setEditingItem({ ...editingItem, type: text })}
                        placeholder="Food type"
                        
                    />
                      <TextInput
                        style={styles.modalInput}
                        defaultValue={selectedItem?.description || ''}
                        onChangeText={(text) => setEditingItem({ ...editingItem, description: text })}
                        placeholder="Food des"
                    />

                  <Text style={styles.label}>Select a unit:</Text>
                    <Picker
                        selectedValue={selectedUnit}
                        style={styles.picker}
                        onValueChange={(itemValue) =>  setEditingItem({...editingItem, unitName: itemValue })}
                    >
                        {unit.map((item) => (
                            <Picker.Item label={item.unitName} value={item.id} key={item.id} />
                        ))}
                    </Picker>
                    <Text style={styles.selected}>
                        Selected Unit: {unit.find((u) => u.id === selectedUnit)?.unitName || 'None'}
                    </Text>
                      
                    <Text style={styles.label}>Select a category:</Text>
                    <Picker
                        selectedValue={selectedUnit}
                        style={styles.picker}
                        onValueChange={(itemValue) => setEditingItem({...editingItem, foodCategoryAlias: itemValue})}
                    >
                        {category.map((item) => (
                            <Picker.Item label={item.name} value={item.id} key={item.id} />
                        ))}
                    </Picker>
                    <Text style={styles.selected}>
                        Selected Unit: {unit.find((u) => u.id === selectedUnit)?.name || 'None'}
                    </Text>
                
                    <View style={styles.buttonHolder}>
                        <TouchableOpacity style={styles.saveButton} onPress={() => {handleSaveEditedItem(selectedItem.id, selectedItem.owner.id)}}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => { setEditItemModalVisible(false) }}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                
                    
                </ScrollView> 
              </View>
            </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    padding: 15,
  },
  foodItem: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  foodQuantity: {
    fontSize: 14,
    color: "#4EA72E",
    fontWeight: "500",
  },
  foodActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 10,
    marginLeft: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
  floatingAddButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4EA72E",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  foodSelectModal: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    padding: 10,
    marginBottom: 50,
},
foodSelectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
},
foodSelectItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
},
 foodImage: {
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: 'cover',
},
modalBackground: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
},
modalContainer: {
  maxHeight: "80%",
  width: "90%",
  backgroundColor: "#fff",
  borderRadius: 15,
  padding: 20,
  margin: 20,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
modalTitle: {
  fontSize: 24,
  fontWeight: "700",
  color: "#333",
  marginBottom: 20,
  textAlign: "center"
},
modalInput: {
  borderWidth: 1,
  borderColor: "#E0E0E0",
  borderRadius: 8,
  padding: 12,
  marginBottom: 15,
  fontSize: 16,
  backgroundColor: "#F8F9FA"
},
buttonHolder: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 20,
  paddingHorizontal: 10
},
addFoodButton: {
  marginTop: 48,
  marginBottom: 12,
  padding: 10,
  backgroundColor: "#4CAF50",
  borderRadius: 5,
  alignItems: 'center',
  textAlign: 'center',
},
saveButton: {
  backgroundColor: "#4EA72E",
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 8,
  elevation: 2
},
saveButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600"
},
cancelButton: {
  backgroundColor: "#E23131",
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 8,
  elevation: 2
},
cancelButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600"
},
label: {
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
  marginBottom: 8,
  marginTop: 10
},
picker: {
  height: 50,
  width: "100%",
  backgroundColor: "#F8F9FA",
  borderRadius: 8,
  marginBottom: 10
},
selected: {
  fontSize: 14,
  color: "#666",
  marginBottom: 15
},
imageWarning: {
  borderRadius: 10,
  height: 80,
  width: 'auto',
  resizeMode: 'cover',
  marginRight: 20
  // borderWidth: 1,
  // borderColor: "#000", 
},
});

export default GroupFoodScreen;
