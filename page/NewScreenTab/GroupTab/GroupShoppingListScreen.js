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
    getAllShoppingListByGroup
} from "../../../controller/ShoppingController";
import { getAllUnit } from "../../../controller/measureUnitController";
import { Picker } from '@react-native-picker/picker';
import { getAllCategory } from "../../../controller/FoodCategoryController";
import { getUserProfile } from "../../../controller/UserController";


const GroupShoppingListScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState({});
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);

  const [user, setUser] = useState(null);
  useEffect(() => {
      async function fetchData() {
        try {
          const data = await getUserProfile();  
          setUser(data.data)
        } catch (error) {
          setError('Error fetching recipes');
        }
      } 
      fetchData();  
  }, []); 



  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const response = await getAllShoppingListByGroup(groupId);
    //   console.log(response.data)
      setLists(response.data.map(item => ({
        id: item.id,
        name: item.name,
        note: item.note,
        date: new Date(item.date),
        details: item.details,
        owner_id: item.owner_id,
        belong_to_group_id: item.belong_to_group_id,
        assignToUserId: item.assign_to_user_id
      }))); 
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


  const openAddItemModal = () => {
    setAddItemModalVisible(true);
    setAddingItem({});
  };
//   const handleSaveAddedItem = () => {
//       const newItem = {
//         name: addingItem.name,
//         type: addingItem.type,
//         description: addingItem.description,
//         image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.foodiesfeed.com%2F&psig=AOvVaw3TBquWpXhi7sEyyiNo5aWL&ust=1735636849376000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCchaaVz4oDFQAAAAAdAAAAABAE",
//         groupId: groupId,
//         ownerId: user.id,
//         unitName: addingItem.unitName,
//         foodCategoryAlias: addingItem.foodCategoryAlias
//       }
//       createFood(newItem)
//       .then((createdFood) => {
//           setFoods((prevItems) => [...prevItems, createdFood]);
//           setAddItemModalVisible(false);
//           console.log('Food successfully added:', createdFood);
//       })
//       .catch((error) => {
//         console.error('Failed to create food:', error);
//       });
//   }

  const renderFoodItem = ({ item }) => (
   
    <View style={styles.foodItem}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDescription}>Số nhiệm vụ: {item.details.length}</Text>
        <Text style={styles.foodDescription}>{item.note}</Text>
        <Text style={styles.foodDescription}>{item.date.toISOString().split('T')[0]}</Text>
      </View>
      <View style={styles.foodActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("EditFood", { foodId: item.id })}
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
        data={lists}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id.toString()}
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


       {/* <Modal
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
                                onValueChange={(itemValue) =>  setAddingItem({...addingItem, unitName: itemValue.toString()})}
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
                                onValueChange={(itemValue) => setAddingItem({...addingItem, foodCategoryAlias: itemValue.toString()})}
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
                  </Modal> */}
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
  backgroundColor: "rgba(0, 0, 0, 0.5)",
},
modalContainer: {
  flex: 1,
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 10,
  width: 360,
  margin: 50,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
modalInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  marginBottom: 10,
  borderRadius: 5,
},
modalInputContent: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  marginBottom: 10,
  borderRadius: 5,
  flex: 1,
},
buttonHolder: {
  marginTop: 'auto',
  flexDirection: 'row',
  justifyContent: 'space-between',
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
  padding: 10,
  borderRadius: 5,
},
saveButtonText: {
  color: "#fff",
},
cancelButton: {
  backgroundColor: "#E23131",
  padding: 10,
  borderRadius: 5,
},
cancelButtonText: {
  color: "#fff",
},
label: {
  fontSize: 18,
  marginBottom: 10,
},
picker: {
  height: 50,
  width: 200,
},
selected: {
  marginTop: 20,
  fontSize: 16,
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

export default GroupShoppingListScreen;
