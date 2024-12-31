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
  Pressable
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from "react-native-vector-icons/FontAwesome";
import {
    getAllShoppingListByGroup, createShoppingList, createTask, updateList, deleteShoppingList, deleteTask
} from "../../../controller/ShoppingController";
import {getGroupMembers} from "../../../controller/GroupController";
import { Picker } from '@react-native-picker/picker';
import { getUserProfile } from "../../../controller/UserController";


const GroupShoppingListScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const [members, setMembers] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState({});
  const [editingItem, setEditingItem] = useState({});
  const [selectedItem, setSelectedItem] = useState();
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [idToNameMap, setIdToNameMap] = useState({})

  const [user, setUser] = useState(null);
  useEffect(() => {
      async function fetchData() {
        try {
          const data = await getUserProfile();
          // console.log(members)
          setUser(data.data)
        } catch (error) {
          setError('Error fetching recipes');
        }
      } 
      fetchData();  
  }, []); 

  useEffect(() => {
    const map = members.reduce((acc, member) => {
      acc[member.id] = member.fullName;
      return acc;
    }, {});
    setIdToNameMap(map);
  }, [members]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getGroupMembers(groupId);
        setMembers(response.data);
      } catch (err) {
        console.error("Can't fetch members", err);
      }
    };
  
    fetchMembers();
  }, []);
  

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      const response = await getAllShoppingListByGroup(groupId);
    //   console.log(response.data)
      setLists(response.data.map(item => ({
        id: item.id,
        name: item.name,
        note: item.note,
        date: item.date,
        details: item.details,
        owner_id: item.owner_id,
        belong_to_group_id: item.belong_to_group_id,
        assignToUserId: item.assign_to_user_id
      }))); 
    } catch (error) {
      console.error("Error loading Lists:", error);
      Alert.alert("Error", "Failed to load Lists");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, day) => {
    setShowDatePicker(false)
    setAddingItem({...addingItem, date: day})
    console.log(addingItem)
  }

  const handleEditDateChange = (event, day) => {
    setShowDatePicker(false)
    setEditingItem({...editingItem, date: day})
    console.log(editingItem)
  }

  const handleSaveEditedItem = (itemId, itemOwner) => {
    // console.log('hello')
    const newItem = {
      name: editingItem.name,
      note: editingItem.note,
      date: editingItem.date,
      assignToUserId: editingItem.assignToUserId,
      belongToGroupId: groupId,
      ownerId: itemOwner
  }
    updateList(itemId, newItem)
    .then((editedlist) => {
        const newList = lists;
        for (let i = 0; i < newList.length; i++) {
          if (newList[i].id === editedlist.data.id) {
            newList[i] = editedlist.data
          }
        }
        setLists(newList);
        setEditItemModalVisible(false);
        console.log('list successfully added:', editedlist);
    })
    .catch((error) => {
      console.error('Failed to create list:', error);
    });
  }

  const handleEditList = (item) => {
    setSelectedItem(item)
    setEditItemModalVisible(true);
    setEditingItem({});
  }

  const handleDeleteList = async (listId) => {
    Alert.alert("Delete List", "Are you sure you want to delete this List?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteShoppingList(listId);
            loadLists(); // Refresh the list
            Alert.alert("Success", "List deleted successfully");
          } catch (error) {
            Alert.alert("Error", "Failed to delete List");
          }
        },
      },
    ]);
  };


  const openAddItemModal = () => {
    setAddItemModalVisible(true);
    setAddingItem({});
  };
  const handleSaveAddedItem = () => {
      const newItem = {
          name: addingItem.name,
          note: addingItem.note,
          date: addingItem.date,
          assignToUserId: addingItem.assignToUserId,
          belongToGroupId: groupId,
          ownerId: user.id
      }
      createShoppingList(newItem)
      .then((createdlist) => {
          setLists((prevItems) => [...prevItems, createdlist.data]);
          setAddItemModalVisible(false);
          console.log('list successfully added:', createdlist);
      })
      .catch((error) => {
        console.error('Failed to create list:', error);
      });
  }

  const rederList = ({ item }) => (
   
    <Pressable
      onLongPress={() => navigation.navigate("TaskShoppingListScreen", { listId: item.id, groupId: groupId })}
      delayLongPress={500} // 500ms delay để kích hoạt long press
    >
      <View style={styles.listItem}>
        <View style={styles.listInfo}>
          <Text style={styles.listName}>{item.name}</Text>
          <Text style={styles.listDescription}>Số nhiệm vụ: {item.details.length}</Text>
          <Text style={styles.listDescription}>{item.note}</Text>
          <Text style={styles.listDescription}>{item.date.split('T')[0]}</Text>
          <Text style={styles.listDescription}>Phân công: {idToNameMap[item?.assignToUserId]}</Text>
        </View>
        <View style={styles.listActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditList(item)}
          >
            <Icon name="edit" size={20} color="#4EA72E" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteList(item.id)}
          >
            <Icon name="trash" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
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
        renderItem={rederList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No lists found in this group</Text>
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
                <Text style={styles.modalTitle}>Add List Task</Text>
                <TextInput
                    style={styles.modalInput}
                  
                    onChangeText={(text) => setAddingItem({ ...addingItem, name: text })}
                    placeholder="list Name"
                />
                <TextInput
                    style={styles.modalInput}
                    
                    onChangeText={(text) => setAddingItem({ ...addingItem, note: text })}
                    placeholder="list Note"
                    
                />
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icon name="calendar" size={20} color="#4EA72E" />
                    <Text style={styles.datePickerButtonText}>
                      {addingItem.date?.toLocaleDateString() || ""}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                <Text style={styles.modalSubtitle}>Select Member</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.membersList}
                >
                  {members.map((member) => (
                    <TouchableOpacity
                      key={member.id}
                      style={[
                        styles.memberItem,
                        addingItem.assignToUserId === member.id && styles.memberItemSelected, // Đổi màu nếu được chọn
                      ]}
                      onPress={() => setAddingItem({ ...addingItem, assignToUserId: member.id })}
                    >
                      <Image source={{ uri: member.photoUrl }} style={styles.photoUrl} />
                      <Text style={styles.memberName}>{member.fullName}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
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
                <Text style={styles.modalTitle}>Edit List Task</Text>
                <TextInput
                    style={styles.modalInput}
                  
                    onChangeText={(text) => setEditingItem({ ...editingItem, name: text })}
                    placeholder="list Name"
                />
                <TextInput
                    style={styles.modalInput}
                    
                    onChangeText={(text) => setEditingItem({ ...editingItem, note: text })}
                    placeholder="list Note"
                    
                />
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icon name="calendar" size={20} color="#4EA72E" />
                    <Text style={styles.datePickerButtonText}>
                      {editingItem.date?.toLocaleDateString() || ""}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={handleEditDateChange}
                  />
                )}
                <Text style={styles.modalSubtitle}>Select Member</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  style={styles.membersList}
                >
                  {members.map((member) => (
                    <TouchableOpacity
                      key={member.id}
                      style={[
                        styles.memberItem,
                        editingItem.assignToUserId === member.id && styles.memberItemSelected, // Đổi màu nếu được chọn
                      ]}editingItem
                      onPress={() => setEditingItem({ ...editingItem, assignToUserId: member.id })}
                    >
                      <Image source={{ uri: member.photoUrl }} style={styles.photoUrl} />
                      <Text style={styles.memberName}>{member.fullName}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.buttonHolder}>
                    <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveEditedItem(selectedItem?.id, selectedItem?.owner_id)}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Tạo overlay mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginTop: 15,
    marginBottom: 10,
  },
  membersList: {
    flexGrow: 0,
    marginBottom: 20,
  },

  memberItem: {
    alignItems: 'center',
    marginRight: 15,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    width: 100,
  },

  memberItemSelected: {
    backgroundColor: '#e6f3ff',
    borderColor: '#2196F3',
  },

  photoUrl: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },

  memberName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
    width: '45%',
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  cancelButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },

  datePickerButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default GroupShoppingListScreen;
