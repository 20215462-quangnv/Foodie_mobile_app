import React, { useState, useEffect , useContext, useRef} from "react";
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity, 
    TextInput,
    ScrollView,
    Image,
    Modal,
    FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getAllRecipes, createRecipe, deleteRecipe } from '../controller/RecipeController';
import { getUserFromStorage } from "../controller/UserController.js";
import { colors } from "./styles/RootStyle.js";
import { FoodContext } from "../controller/FoodProviderContext.js";
import WeekCalendar from "./NewScreenTab/Recipetab/Calender.js";
import { getAllShoppingList } from "../controller/ShoppingController.js";


const TaskScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [addingItem, setAddingItem] = useState({});
    const [isSelectionMode, setIsSelectionMode] = useState(false); 
    const [selectedItems, setSelectedItems] = useState(null);
    const [showFoodSelectModal, setShowFoodSelectModal] = useState(false); 
    const { listFood, loading } = useContext(FoodContext);
    const [items, setItems] = useState([]);

    const [user, setUser] = useState({});
    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUserFromStorage(); 
                setUser(user);
                console.log(user);

                const data = await getAllShoppingList();  // Chờ kết quả từ API
                setItems(data.data.map(item => ({
                    id: item.id,
                    name: item.name,
                    note: item.note,
                    date: new Date(item.date),
                    details: item.details,
                    owner_id: item.owner_id,
                    belong_to_group_id: item.belong_to_group_id,
                })));
              
                console.log(items);
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
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.title}>
                    <Image source={{ uri: user.photoUrl }}
                        style={styles.imageWarning}
                        onError={(e) => console.log("Error loading image: ", e.nativeEvent.error)}></Image>
                    <Text style={styles.titleText}>{user.fullName}</Text>
                </View>
               <WeekCalendar style={styles.calender}/>
            </View>

            {/* Body */}
            <View style={styles.body}>
                <View style={styles.mainBody}>
                    <View style={styles.bodyHeader}>
                        <Text style={styles.headerText}>Danh sách nhiệm vụ</Text>
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
                               
                                {items.map((item, index) => (
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
                                            <Text style={styles.itemText}>{item.name}</Text>
                                        </View>

                                        <View style={styles.rightItem}>
                                            <Text style={styles.textRed}>Món ăn: {item.name}</Text>
                                            <Text style={styles.normalText}>Mô tả: {item.note}</Text>
                                            <Text style={styles.normalText}>Tạo bởi: {item.owner_id}</Text>
                                            <Text style={styles.normalText}>Created at: {item.date.toDateString()}</Text>
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
        backgroundColor: colors.themeColor, 
        paddingBottom: 10,
        flexDirection: "column",
        margin: 10,
        borderRadius: 6,
        alignItem: 'center',
    },
    title: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 5,
        flexDirection: 'row',
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    calender: {
        flex: 4,
        alignItems: 'center'
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

export default TaskScreen;
