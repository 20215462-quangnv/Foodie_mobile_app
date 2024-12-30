import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity, 
    TextInput,
    ScrollView,
    Image,
    Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getAllCategory, updateCategory, deleteCategory, createCategory } from "../../../controller/FoodCategoryController";

const CategoryControllerScreen = ({ navigation }) => {

    const [categories, setCategories] = useState([]);
    const [addingItem, setAddingItem] = useState({});
    const [addItemModalVisible, setAddItemModalVisible] = useState(false);
    const [editedItem, setEditedItem] = useState({});
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [choosingItem, setChoosingItem] = useState();
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    useEffect(()=>{
        async function fetchData() {
        try {
            const data = await getAllCategory(); 
            console.log("unittt: " + data.data);
            setCategories(data.data);
        } catch (error) {
            setError('Error fetching All Unit');
        }
        } 
        fetchData();  
    }, [])
    function convertToAlias(name) {
    
        const removeDiacritics = (str) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

   
        return removeDiacritics(name)
            .toLowerCase() 
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, ""); 
    }
    const handlePress = (item) => {
        setEditedItem(item);
        setEditModalVisible(true);
    }

    const handleBack = () => {
        navigation.navigate('Unit');
    }
    const handlePressItem = (item) => {
        
    }
    const handleLongPressItem = (item) => {
        
    }
    const openAddItemModal = () => {
        setAddItemModalVisible(true);
    }
    const handleDeleteItem = (itemId) => {
         deleteCategory(itemId)
            .then(() => {
               setCategories((prevItems) => prevItems.filter((item) => item.id !== itemId));
                setConfirmModalVisible(false);
                alert('Xóa loại food thành công thành công');
            })
            .catch((error) => {
              alert('Xoá loại food thất bại, thử lại');
                console.error('Failed to delete unit:', error);
            });
    }
    const handleSaveAddedItem = () => {
        const newItem = {
            name: addingItem.name,
            alias: convertToAlias(addingItem.name),
            description: addingItem.description,
        };
        createCategory(newItem)
            .then((createdItem) => {
                console.log("createdValue: " + createdItem);
                setCategories((prevItems) => [...prevItems, newItem]);
                setAddItemModalVisible(false);
                alert('Tạo loại food  mới thành công:', newItem);
            })
            .catch((error) => {
              alert('Tạo loại food  mới thất bại, thử lại');
                console.error('Failed to create unit:', error);
            });
    }

     const handleSaveEditedItem = () => {
         const newItem = {
            id: editedItem.id,
            createdAt: editedItem.createdAt,
            updatedAt: editedItem.updatedAt,
            name: editedItem.name,
            alias: convertToAlias(editedItem.name),
            description: editedItem.description,
            
        };
        updateCategory(newItem, newItem.id)
            .then((createdItem) => {
                setCategories((prevItems) =>
                    prevItems.map((item) =>
                        item.id === newItem.id ? newItem : item
                    )
                );
                setEditModalVisible(false);
                alert('Update loại food thành công:', newItem);
            })
            .catch((error) => {
              alert('Update loại food thất bại, thử lại');
                console.error('Failed to update unit:', error);
            });
    }
    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Icon name="arrow-left" size={30} color="black" />
            </TouchableOpacity>
          <View style = {styles.title}>
                <Text style={styles.titleText}>Food Category</Text>
          </View>
         
        </View>
            <View style={styles.body}>
                <View style={styles.listFood}>
                        <ScrollView style={styles.scrollViewListFood}>
                            <View style={styles.itemHolder}>
                               
                                {categories.map((item, index) => (
                                  
                                    <TouchableOpacity 
                                        key={index} 
                                        style={styles.itemContainer} 
                                        onPress={() => handlePress(item)}
                                         onLongPress={() => handleLongPressItem(item)} // Nhấn giữ
                                    >
                                            <Text style={styles.itemName}>{item.name}:</Text>
                                            <Text style={styles.itemText}>{item.description}</Text>
                                            <TouchableOpacity
                                                onPress={(event) => {
                                                    event.stopPropagation();
                                                    setChoosingItem(item.id);
                                                    setConfirmModalVisible(true);
                                                }}
                                                style={{ padding: 10}}
                                            >
                                               <Icon name="minus-circle" size={24} color="red" ></Icon>
                                            </TouchableOpacity>

                                       
                                    </TouchableOpacity>
                                ))}
                                
                            </View>
                        </ScrollView>
                </View>
                 <TouchableOpacity 
                        style={styles.addButton} 
                        onPress= {openAddItemModal}
                    >
                        <Icon name="plus-circle" size={48} color="#4EA72E" />
                        
                    </TouchableOpacity>
            </View>
            {/* Edit Item Modal*/}
             <Modal
                animationType="fade"
                transparent={true}
                visible={confirmModalVisible}
                onRequestClose={() => setConfirmModalVisible(false)}
            >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Bạn muốn xóa loại này</Text>
                         <View style={styles.buttonHolder}>
                                <TouchableOpacity style={styles.saveButton} onPress={()=>handleDeleteItem(choosingItem)}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmModalVisible(false)}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            </Modal>
            {/* Edit Item Modal*/}
             <Modal
                animationType="fade"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}
            >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Thêm Đơn vị</Text>
                        <Text style={styles.normalText}>Tên</Text>
                            <TextInput
                                style={styles.modalInput}
                                value = {editedItem.name}
                                onChangeText={(text) => setEditedItem({ ...editedItem, name: text })}
                                placeholder="Tên đơn vị"
                        />
                        <Text style={styles.normalText}>Mô tả</Text>
                            <TextInput
                                style={styles.modalInput}
                               value = {editedItem.description}
                            onChangeText={(text) => setEditedItem({ ...editedItem, description: text })}
                                placeholder="Mô tả"
                        />
                         <View style={styles.buttonHolder}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveEditedItem}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            </Modal>
             {/* Add new Item Modal */}
             <Modal
                animationType="fade"
                transparent={true}
                visible={addItemModalVisible}
                onRequestClose={() => setAddItemModalVisible(false)}
            >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Thêm Đơn vị</Text>
                        <Text style={styles.normalText}>Tên</Text>
                            <TextInput
                                style={styles.modalInput}
                              
                                onChangeText={(text) => setAddingItem({ ...addingItem, name: text })}
                                placeholder="Tên đơn vị"
                        />
                        <Text style={styles.normalText}>Mô tả</Text>
                            <TextInput
                                style={styles.modalInput}
                               
                            onChangeText={(text) => setAddingItem({ ...addingItem, description: text })}
                                placeholder="Mô tả"
                        />
                         <View style={styles.buttonHolder}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddedItem}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setAddItemModalVisible(false)}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
     headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    
  },
  container: {
    flex: 1, 
  },
/* header */
  header: {
    flex: 2, 
    backgroundColor: "#4EA72E", 
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    marginBottom: -10,
  },
  avatar: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  normalText: {
    fontSize: 14,
    color: 'white',
    },
   body: {
    flex: 7.5, 
    backgroundColor: "#fff",
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: 10,
    },
    bodyItem: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: "center",
    },
    buttonHolder: {
        width: '80%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    unitBtn: {
         backgroundColor: '#f44336',
    },
    categoryBtn: {
         backgroundColor: '#0086ff',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 50,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        zIndex: 1,
    },
    listFood: {
        flex: 4,
    },
    scrollViewListFood: {
        flex: 1,
        padding: 10,
    },
    itemHolder: {
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "space-between",
        paddingBottom: 50,
    },
    itemContainer: {
        width: '100%', 
        marginBottom: 15,
        padding: 5, 
        borderRadius: 6, 
        overflow: 'hidden',
        backgroundColor: '#fff', 
        shadowColor: '#000',
        flexDirection: 'row',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 3,
        justifyContent: 'space-between'
    },
    imageWarning: {
        height: 80,
        resizeMode: 'cover',
    },
    itemName: {
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "red",
    },
    itemText: {
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
     addButton: {
        position: 'absolute',
        bottom: 20, // Cách cạnh dưới 20px
        right: 20,  // Cách cạnh phải 20px
        justifyContent: 'center', // Căn giữa nội dung
        alignItems: 'center', // Căn giữa nội dung
        zIndex: 10, // Đảm bảo nằm trên cùng
    },
      modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: 300,
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
     buttonHolder: {
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
   
})
export default CategoryControllerScreen