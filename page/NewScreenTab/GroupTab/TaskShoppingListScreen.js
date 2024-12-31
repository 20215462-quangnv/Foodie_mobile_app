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
    createTask, deleteTask, getAllTaskByList
} from "../../../controller/ShoppingController";
import { getFoodsByGroupId }from "../../../controller/FoodController"
import { Picker } from '@react-native-picker/picker';
import { getUserProfile } from "../../../controller/UserController";


const TaskShoppingListScreen = ({ route, navigation }) => {
  const { listId, groupId } = route.params;
  const [tasks, settasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState({});
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [idToMapUrl, setIdToMapUrl] = useState({});
  const [foods, setFoods] = useState([]);
  const [user, setUser] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await getAllTaskByList(listId);
    //   console.log(response.data)
      setLists(response.data.map(item => ({
        id: item.id,
        quantity: item.quantity,
        done: item.done,
        foodName: item.foodName,
        foodImage: item.foodImage
      }))); 
    } catch (error) {
      console.error("Error loading Lists:", error);
      Alert.alert("Error", "Failed to load Lists");
    } finally {
      setLoading(false);
    }
  };

  const loadFoods = async () => {
    try {
      const response = await getFoodsByGroupId(groupId);
      setFoods(response.data.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        description: item.description,
        imageUrl: item.imageUrl
      })))
    }
    catch(err) {
      console.error("Error loading food", err)
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    loadTasks();
  }, []);

  const handleDeleteList = async (listId) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this Task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteShoppingList(ListId);
            loadLists(); // Refresh the list
            Alert.alert("Success", "Task deleted successfully");
          } catch (error) {
            Alert.alert("Error", "Failed to delete Task");
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
//         image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.listiesfeed.com%2F&psig=AOvVaw3TBquWpXhi7sEyyiNo5aWL&ust=1735636849376000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCchaaVz4oDFQAAAAAdAAAAABAE",
//         groupId: groupId,
//         ownerId: user.id,
//         unitName: addingItem.unitName,
//         listCategoryAlias: addingItem.listCategoryAlias
//       }
//       createlist(newItem)
//       .then((createdlist) => {
//           setlists((prevItems) => [...prevItems, createdlist]);
//           setAddItemModalVisible(false);
//           console.log('list successfully added:', createdlist);
//       })
//       .catch((error) => {
//         console.error('Failed to create list:', error);
//       });
//   }

  const rederTask = ({ item }) => (
   
    <View style={styles.foodItem}>
       <View style={styles.foodInfo}>
        <Image  style={styles.imageWarning}  source={{ uri: item.imageUrl }}></Image>
      </View>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <Text style={styles.foodDescription}>{item.quantity}</Text>
        <Text style={styles.foodDescription}>{item.done}</Text>
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
        data={tasks}
        renderItem={rederTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No task found in this list</Text>
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
                        <Text style={styles.modalTitle}>Add Task</Text>
                        <TextInput
                            style={styles.modalInput}
                          
                            onChangeText={(text) => setAddingItem({ ...addingItem, quantity: text })}
                            placeholder="quantity"
                        />
                        <TextInput
                            style={styles.modalInput}
                          
                            onChangeText={(text) => setAddingItem({ ...addingItem, done: text })}
                            placeholder="status"
                          
                        />
                    {addingItem.food &&
                        <View style={styles.foodSelectItem}>
                            <Image source={{ uri: addingItem.food.imageUrl }} style={styles.foodImage} />
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text>{addingItem.food.name}</Text>
                                <Text >({addingItem.food.type})</Text>
                            </View>
                        </View>
                    }
                      
                        <TouchableOpacity
                            style={styles.addFoodButton}
                            onPress={handleShowChooseFood}
                        >
                            <Text>Choose Food</Text>
                        </TouchableOpacity>
                      {showFoodSelectModal && (
                        <View style={styles.foodSelectModal}>
                            <Text style={styles.foodSelectTitle}>Select a Food</Text>
                            {listFood.map((food) => (
                            <TouchableOpacity
                                key={food.id}
                                style={styles.foodSelectItem}
                                onPress={() => {
                                handleChooseFood(food);
                                setShowFoodSelectModal(false); // Đóng modal khi chọn món ăn
                                }}
                            >
                                <Image source={{ uri: food.imageUrl }} style={styles.foodImage} />
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text>{food.name}</Text>
                                    <Text >({food.type})</Text>
                                </View>
                            </TouchableOpacity>
                            ))}
                        </View>
                        )}
                        <View style={styles.buttonHolder}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddedItem}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => { setAddItemModalVisible(false); setShowFoodSelectModal(false) }}>
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
  listItem: {
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
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  listQuantity: {
    fontSize: 14,
    color: "#4EA72E",
    fontWeight: "500",
  },
  listActions: {
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
  listSelectModal: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5,
    padding: 10,
    marginBottom: 50,
},
listSelectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
},
listSelectItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
},
 listImage: {
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
addlistButton: {
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
});

export default TaskShoppingListScreen;
