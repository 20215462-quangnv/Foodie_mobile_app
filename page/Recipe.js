import React, { useState, useEffect , useContext} from "react";
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getAllRecipes, createRecipe, deleteRecipe } from '../controller/RecipeController';
import { getUserProfile } from "../controller/UserController.js";
import { colors } from "./styles/RootStyle.js";
import { getAllFoodByGroup } from "../controller/FoodController.js";
import { FoodContext } from "../controller/FoodProviderContext.js";


const RecipeScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [addItemModalVisible, setAddItemModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [addingItem, setAddingItem] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false); 
    const [selectedItems, setSelectedItems] = useState(null);
    const [showFoodSelectModal, setShowFoodSelectModal] = useState(false);
    //Get User Profile
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
    const { listFood, loading } = useContext(FoodContext);
    const [items, setItems] = useState([]);
    useEffect(() => {
        async function fetchData() {
          try {
            const data = await getAllRecipes();  // Chờ kết quả từ API
            setItems(data.data.map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                htmlContent: item.htmlContent,
                author: item.author,
                food: item.food,  
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
              })));  
          } catch (error) {
            setError('Error fetching recipes');  
          }
        }
        
        fetchData();  
    }, []);  
    const openFilterModal = () => {
        setFilterModalVisible(true);
    };

    const openAddItemModal = () => {
        setAddItemModalVisible(true);
        setAddingItem({});
    };
    const handleChooseFood = (food) => {
        setAddingItem({ ...addingItem, food: food })
    }

    const handleSaveAddedItem = () => {
        // setAddingItem(null);
        
        const newItem = {
            name: addingItem.name,
            description: addingItem.description,
            htmlContent: addingItem.content,
            foodId: addingItem.food.id,  
            authorId: user.id,  
        };
        createRecipe(newItem)
        .then((createdRecipe) => {
            setItems((prevItems) => [...prevItems, createdRecipe]);
            setShowFoodSelectModal(false);
            setAddItemModalVisible(false);
          
            console.log('Item successfully added:', createdRecipe);
            
          
        })
        .catch((error) => {
          console.error('Failed to create recipe:', error);
        });
    };
    
    const applyFilter = () => {
        const filteredItemsList = filteredItems();
        setItems(filteredItemsList);
        setFilterModalVisible(false);
    };
    const handleLongPress = (item) => {
        setIsSelectionMode(true); 
        setSelectedItems([item.id]); 
    };
    const handlePress = (item) => {
        if (isSelectionMode) {
            toggleSelectItem(item.id); 
        } else {
            console.log(item);
            handleShowEditRecipe(item);
        }
    };
    const handleShowEditRecipe = (item) => {
        navigation.navigate('EditRecipe', {editedItem : item, listFood: listFood});
    };
    const toggleSelectItem = (itemId) => {
        setSelectedItems((prevSelected) => {
        if (prevSelected.includes(itemId)) {
            return prevSelected.filter((id) => id !== itemId); 
        } else {
            return [...prevSelected, itemId]; 
        }
        });
    };
    const selectAllItems = () => {
        if (selectedItems.length === items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map(item => item.id)); 
        }
    };
    const cancelSelection = () => {
        setIsSelectionMode(false);
        setSelectedItems([]);
    };

    const handleDeleteSelectedItems = () => {
        console.log("selectedItems "+  selectedItems);
        Promise.all(
            selectedItems.map(item => deleteRecipe(item))
          )
          .then(() => {
            const newItems = items.filter(item => !selectedItems.includes(item.id));
            setItems(newItems); 
            cancelSelection(); 
            console.log('Selected items deleted successfully');
          })
          .catch(error => {
            console.error('Error deleting selected items:', error);
          });
    };


  const handleShowChooseFood = () => {
    if (showFoodSelectModal) {
      setShowFoodSelectModal(false);
    }
    else setShowFoodSelectModal(true);
  }
   
    const filteredItems = () => {
        let result = [...items];
        switch (selectedFilter) {
            case 'quantity_desc':
                result = filteredItems.sort((a, b) => b.quantity - a.quantity);
                break;
            case 'quantity_asc':
                result = filteredItems.sort((a, b) => a.quantity - b.quantity);
                break;
            case 'date_asc':
                result = filteredItems.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'date_desc':
                result = filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'expired':
                result = filteredItems.filter(item => item.state === "Expired");
                break;
            default:
                break;
        }
        if (searchQuery.trim()) {
            result = filteredItems.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
        }
        return result;
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Recipe</Text>
                </View>
            </View>

            {/* Body */}
            <View style={styles.body}>
                <View style={styles.searchbarContainer}>
                    <View style={styles.searchBar}>
                        <TouchableOpacity style={styles.searchButton}>
                            <Icon name="search" size={20} color="black" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.inputSearch}
                            placeholder="Search..."
                            value={searchQuery}
                            onChangeText={(text) => setSearchQuery(text)}
                        />
                    </View>
                    <View style={styles.filter}>
                        <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
                            <Icon name="filter" size={32} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.mainBody}>
                    <View style={styles.bodyHeader}>
                        <Text style={styles.headerText}>DANH SÁCH CÔNG THỨC</Text>
                         {isSelectionMode && (
                                    <View style={styles.cancelButtonContainer}>
                                        <TouchableOpacity
                                            style={styles.selectAllContainer}
                                            onPress={selectAllItems}
                                        >
                                        <MaterialCommunityIcons
                                            name={selectedItems.length === items.length ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                            size={24}
                                            color="black"
                                        />
                                        <Text style={styles.selectAllText}>All</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleDeleteSelectedItems} style={styles.deleteButton}>
                                            <Text style={styles.deleteButtonText}>Delete Selected Items</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={cancelSelection} style={styles.cancelButton}>
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                    </View>
                    <View style={styles.listFood}>
                        <ScrollView style={styles.scrollViewListFood}>
                            <View style={styles.itemHolder}>
                               
                                {filteredItems().map((item, index) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        style={styles.itemContainer} 
                                        onPress={() => handlePress(item)}
                                         onLongPress={() => handleLongPress(item)} // Nhấn giữ
                                    >
                                        <View style={styles.leftItem}>
                                            {isSelectionMode && (
                                                <TouchableOpacity
                                                    style={styles.checkboxContainer}
                                                    onPress={() => toggleSelectItem(item.id)}
                                                >
                                                <MaterialCommunityIcons
                                                    name={selectedItems.includes(item.id) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={24}
                                                    color="black"
                                                />
                                                </TouchableOpacity>
                                            )}
                                            <Image
                                                source={{ uri: item.food.imageUrl }}
                                                style={styles.imageWarning}
                                                onError={(e) => console.log("Error loading image: ", e.nativeEvent.error)}
                                            />
                                            <Text style={styles.itemText}>{item.name}</Text>
                                        </View>

                                        <View style={styles.rightItem}>
                                            <Text style={styles.textRed}>Món ăn: {item.food.name}</Text>
                                            <Text style={styles.normalText}>Mô tả: {item.description}</Text>
                                            <Text style={styles.normalText}>Tạo bởi: {item.author.fullName}</Text>
                                            <Text style={styles.normalText}>Created at: {new Date(item.createdAt).toDateString()}</Text>
                                        </View>
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
            </View>
             {/* Add new Item Modal */}
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
                                placeholder="Recipe Name"
                            />
                            <TextInput
                                style={styles.modalInput}
                               
                                onChangeText={(text) => setAddingItem({ ...addingItem, description: text })}
                                placeholder="Recipe Description"
                               
                            />
                            <TextInput
                                style={styles.modalInputContent}
                                multiline={true}
                                onChangeText={(text) => setAddingItem({ ...addingItem, content: text })}
                                placeholder="Recipe Content"
                               
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
            {/* Filter Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                   <View style={styles.modalBackground}>
                    <View style={styles.filterModalContainer}>
                        <Text style={styles.modalTitle}>Filter Options</Text>
                        
                        {/* Filter Options (Radio Buttons) */}
                        <TouchableOpacity 
                            onPress={() => setSelectedFilter('quantity_desc')} 
                            style={styles.filterOption}
                        >
                            <View style={styles.checkboxContainer}>
                            <MaterialCommunityIcons
                                        name={selectedFilter === 'quantity_desc' ? 'radiobox-marked' : 'radiobox-blank'}
                                        size={24}
                                        color={selectedFilter === 'quantity_desc' ? 'blue' : 'gray'}
                                    />
                                <Text style={styles.filterOptionText}>Quantity từ cao đến thấp</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => setSelectedFilter('quantity_asc')} 
                            style={styles.filterOption}
                        >
                            <View style={styles.checkboxContainer}>
                            <MaterialCommunityIcons
                                        name={selectedFilter === 'quantity_asc' ? 'radiobox-marked' : 'radiobox-blank'}
                                        size={24}
                                        color={selectedFilter === 'daquantity_asc' ? 'blue' : 'gray'}
                                    />
                                <Text style={styles.filterOptionText}>Quantity từ thấp đến cao</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => setSelectedFilter('date_asc')} 
                            style={styles.filterOption}
                        >
                            <View style={styles.checkboxContainer}>
                            <MaterialCommunityIcons
                                        name={selectedFilter === 'date_asc' ? 'radiobox-marked' : 'radiobox-blank'}
                                        size={24}
                                        color={selectedFilter === 'date_asc' ? 'blue' : 'gray'}
                                    />
                                <Text style={styles.filterOptionText}>Ngày hết hạn gần nhất</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => setSelectedFilter('date_desc')} 
                            style={styles.filterOption}
                        >
                            <View style={styles.checkboxContainer}>
                            <MaterialCommunityIcons
                                        name={selectedFilter === 'date_desc' ? 'radiobox-marked' : 'radiobox-blank'}
                                        size={24}
                                        color={selectedFilter === 'date_desc' ? 'blue' : 'gray'}
                                    />
                                <Text style={styles.filterOptionText}>Ngày hết hạn xa nhất</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => setSelectedFilter('expired')} 
                            style={styles.filterOption}
                        >
                            <View style={styles.checkboxContainer}>
                                <MaterialCommunityIcons
                                        name={selectedFilter === 'expired' ? 'radiobox-marked' : 'radiobox-blank'}
                                        size={24}
                                        color={selectedFilter === 'expired' ? 'blue' : 'gray'}
                                    />
                                <Text style={styles.filterOptionText}>Đã hết hạn</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Apply and Cancel Buttons */}
                        <View style={styles.buttonHolder}>
                            <TouchableOpacity style={styles.saveButton} onPress={applyFilter}>
                                <Text style={styles.applyButtonText}>Apply</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setFilterModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Footer */}
           
        </View>
    );
};

const styles = StyleSheet.create({
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    normalText: {
        fontSize: 16,
        fontFamily: colors.fontFamily,
    },
    container: {
        flex: 1, 
        backgroundColor: colors.background,
    },
    header: {
        flex: 2.5, 
        backgroundColor: "#4EA72E", 
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        margin: 10,
        borderRadius: 6,
    },
    title: {
        flex: 4,
        alignItems: 'center',
        marginBottom: 5,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    body: {
        flex: 7.5, 
        backgroundColor: colors.background,
        justifyContent: "center", 
        alignItems: "center", 
    },
    searchbarContainer: {
        flex: 1,
        width: "100%",
        padding: 10, 
        flexDirection: 'row',
        alignItems: 'center', 
    },
    searchBar: {
        borderWidth: 2, 
        borderColor: '#696969', 
        borderRadius: 10, 
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    searchButton: {
        margin: 5,
    },
    inputSearch: {
        flex: 1,
    },
    filter: {
        width: 40, 
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    mainBody: {
        flex: 11,
        width: "100%", 
    },
    bodyHeader: {
        alignItems: "center",
        paddingBottom: 10,
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
    },
    imageWarning: {
        height: 80,
        resizeMode: 'cover',
        // borderWidth: 1,
        // borderColor: "#000", 
    },
    itemText: {
        textAlign: 'center',
        padding: 10,
        fontSize: 16,
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: '#ff5722',
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButtonContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
    selectAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        paddingLeft: 10,
    },
    selectAllText: {
        fontSize: 16,
        marginLeft: 10,
    },
    addButton: {
        position: 'absolute',
        bottom: 20, // Cách cạnh dưới 20px
        right: 20,  // Cách cạnh phải 20px
        justifyContent: 'center', // Căn giữa nội dung
        alignItems: 'center', // Căn giữa nội dung
        zIndex: 10, // Đảm bảo nằm trên cùng
    },
    leftItem: {
        flex: 2,
        overflow: 'hidden',
        flexDirection: "column",
    },
    rightItem: {
        flex: 3,
        overflow: 'hidden',
        paddingLeft: 10,
    },
    textRed: {
        color: "#E23131",
        fontWeight: 'bold',
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
    filterModalContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    filterOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
    },
    filterOptionText: {
        fontSize: 16,
        color: "#333",
    },
    applyFilterButton: {
        backgroundColor: '#4EA72E',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    applyFilterText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: 'orange',  // Visual highlight when selected
        borderColor: 'orange',
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
});

export default RecipeScreen;