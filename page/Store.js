import React, { useState, useEffect, useContext} from "react";
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
//import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Footer from '../layout/Footer';
import { FoodContext } from "../controller/FoodProviderContext.js";
import { getUserFromStorage } from "../controller/UserController.js";
import {getAllFridgeGroup, createFridgeItem, updateFridgeItem, deleteFridgeItem} from "../controller/FridgeController.js" 

const StoreScreen = ({ navigation }) => {
    const checkExpired = (expiredDate) => {
        const today = new Date();
        const expirationDate = new Date(expiredDate);
        const timeDifference = expirationDate - today;
        const daysLeft = timeDifference / (1000 * 60);
        return daysLeft;
    };

    const [items, setItems] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    useEffect(() => {
        async function fetchData() {
            try {
                const userProfileeee = await getUserFromStorage();
                setUserProfile(userProfileeee);
            const data = await getAllFridgeGroup();  
            setItems(data
            .filter(item => item.data && item.data.length > 0)  // Loại bỏ các item không thỏa mãn điều kiện
            .map(item => {
                console.log(item.data.length);
                console.log(item.data[0].food);
                console.log(new Date(item.data[0].expiredDate));
               return item.data.map(subItem => {
                const expiredDate = new Date(subItem.expiredDate); 
                   return {
                    id: subItem.id,
                    foodName: subItem.foodName,
                    quantity: subItem.quantity,
                    note: subItem.note,
                    foodId: subItem.foodId,
                    ownerId: subItem.ownerId,
                    expiredDate: expiredDate,
                    food: subItem.food,
                };
            });

            })
            .flat()
            );

          } catch (error) {
            setError('Error fetching fridge');  
          }
        }
        
        fetchData(); 
  }, []);


    // Popup state
    const [modalVisible, setModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [addItemModalVisible, setAddItemModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedItem, setEditedItem] = useState({});
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [addingItem, setAddingItem] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false); 
    const [selectedItems, setSelectedItems] = useState(null);
    const [showFoodSelectModal, setShowFoodSelectModal] = useState(false);
    const { listFood, loading } = useContext(FoodContext);
    

    const openModal = (item) => {
        setSelectedItem(item);
        setEditedItem(item);  // Pre-fill the popup with the current item's properties
        setModalVisible(true);
    };
    const openFilterModal = () => {
        setFilterModalVisible(true);
    };

    const openAddItemModal = () => {
      
        setAddItemModalVisible(true);
        setAddingItem({});
    };

  const handleShowChooseFood = () => {
    if (showFoodSelectModal) {
      setShowFoodSelectModal(false);
    }
    else setShowFoodSelectModal(true);
  }
    const handleSave = () => {
         const newItem = {
            foodName: editedItem.foodName,
            quantity: editedItem.quantity,
            useWithin: checkExpired(editedItem.expiredDate),
            note: editedItem.note,
            foodId: editedItem.food.id,
            ownerId:  userProfile.id,
         };
        console.log("edit within: " + newItem.useWithin);
        updateFridgeItem(editedItem.id, newItem)
            .then((update) => {
            update.expiredDate = new Date(update.expiredDate)
            setItems((prevItems) => [...prevItems, update]);
            setShowFoodSelectModal(false);
            setModalVisible(false);
            alert('Update thực phẩm thành công:', update);
            console.log('Fridge Item successfully added:', update);
        })
            .catch((error) => {
              alert('Update thực phẩm thất bại, thử lại');
          console.error('Failed to create Fridge Item:', error);
        });
    };
    const handleSaveAddedItem = () => {
        
        const newItem = {
            foodName: addingItem.name,
            quantity: addingItem.quantity,
            useWithin: checkExpired(addingItem.expiredDate),
            note: addingItem.note,
            foodId: addingItem.food.id,
            ownerId:  userProfile.id,
        };
        createFridgeItem(newItem)
            .then((createdItem) => {
            createdItem.expiredDate = new Date(createdItem.expiredDate)
            setItems((prevItems) => [...prevItems, createdItem]);
            setShowFoodSelectModal(false);
            setAddItemModalVisible(false);
             alert('Tạo thực phẩm thành công:', createdItem);
            console.log('Fridge Item successfully added:', createdItem);
            
          
        })
            .catch((error) => {
              alert('Tạo thực phẩm thất bại, thử lại');
          console.error('Failed to create Fridge Item:', error);
        });
    };
    
    const applyFilter = () => {
        // Apply multiple filters from the selectedFilters array
        console.log("Selected Filters:", selectedFilter);
         // Get the filtered list of items based on selected filters
        const filteredItemsList = filteredItems();

        // Update the state with the filtered list of items
        setItems(filteredItemsList);
        setFilterModalVisible(false);
    };
    const handleLongPress = (item) => {
        setIsSelectionMode(true); // Bật chế độ chọn
        setSelectedItems([item.id]); // Bắt đầu với item được nhấn giữ
    };
    const handlePress = (item) => {
        if (isSelectionMode) {
            toggleSelectItem(item.id); // Chọn/bỏ chọn nếu đang ở chế độ chọn
        } else {
            openModal(item); // Thực hiện hành động khi nhấn
        }
    };

    const toggleSelectItem = (itemId) => {
        setSelectedItems((prevSelected) => {
        if (prevSelected.includes(itemId)) {
            return prevSelected.filter((id) => id !== itemId); // Bỏ chọn nếu đã chọn
        } else {
            return [...prevSelected, itemId]; // Thêm vào danh sách đã chọn
        }
        });
    };
    const selectAllItems = () => {
        if (selectedItems.length === items.length) {
            setSelectedItems([]); // Nếu tất cả đã chọn, thì bỏ chọn
        } else {
            setSelectedItems(items.map(item => item.id)); // Chọn tất cả item
        }
    };
    const cancelSelection = () => {
        setIsSelectionMode(false);
        setSelectedItems([]); // Dọn dẹp các item đã chọn
    };

    const deleteSelectedItems = () => {
         Promise.all(
            selectedItems.map(item => deleteFridgeItem(item))
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
    const handleChooseFood = (food) => {
        setAddingItem({ ...addingItem, food: food })
    }
    const handleChooseEditingItem = (food) => {
        setAddingItem({ ...editedItem, food: food })
    }


    // Filter logic for sorting and filtering items based on multiple filters
    const filteredItems = () => {
        let filteredItems = [...items]; // Assuming items is your original list

// Assuming selectedFilter is the current selected filter
        // Example selected filter, could come from your state

        switch (selectedFilter) {
            case 'none':
                filteredItems = [...items];
                break;
            case 'quantity_desc':
                filteredItems = filteredItems.sort((a, b) => b.quantity - a.quantity);
                break;
            case 'quantity_asc':
                filteredItems = filteredItems.sort((a, b) => a.quantity - b.quantity);
                break;
            case 'date_asc':
                filteredItems = filteredItems.sort((a, b) => new Date(a.expiredDate) - new Date(b.expiredDate));
                break;
            case 'date_desc':
                filteredItems = filteredItems.sort((a, b) => new Date(b.expiredDate) - new Date(a.expiredDate));
                break;
            case 'expired':
                filteredItems = filteredItems.filter(item => checkExpired(item.expiredDate)/1400 < 0);
                break;
            default:
                break;
        }

        //console.log(filteredItems);

        if (searchQuery.trim()) {
            filteredItems = filteredItems.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filteredItems;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>Store</Text>
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
                        <Text style={styles.headerText}>DANH SÁCH THỰC PHẨM</Text>
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
                                        <TouchableOpacity onPress={deleteSelectedItems} style={styles.deleteButton}>
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
                                            <Text style={styles.itemText}>{item.foodName}</Text>
                                        </View>

                                        <View style={styles.rightItem}>
                                           {checkExpired(item.expiredDate)/1440 < 0 && 
                                                (<Text style={styles.textRed}>ĐÃ HẾT HẠN</Text>)
                                            }
                                             {checkExpired(item.expiredDate)/1440 >= 0 && checkExpired(item.expiredDate)/1440 <= 2 && 
                                                <Text style={styles.textOrange}>SẮP HẾT HẠN</Text>
                                            }
                                            
                                            <Text style={styles.normalText}>Số lượng: {item.quantity}</Text>
                                            <Text style={styles.normalText}>Hết hạn: {item.expiredDate.getDate()}-{item.expiredDate.getMonth()+1}-{item.expiredDate.getFullYear()}</Text>
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

            {/* Popup Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Item</Text>
                        <Text style={styles.modalTitle}>Tên</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={editedItem.foodName}
                                onChangeText={(text) => setEditedItem({ ...editedItem, foodName: text })}
                                placeholder="Item Name"
                        />
                         <Text style={styles.modalTitle}>Số lượng</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={editedItem.quantity?.toString()}
                                onChangeText={(text) => setEditedItem({ ...editedItem, quantity: parseInt(text) })}
                                placeholder="Quantity"
                                keyboardType="numeric"
                        />
                         {/* <Text style={styles.modalTitle}>Số ngày còn lại</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={editedItem.useWithin}
                                onChangeText={(text) => setEditedItem({ ...editedItem, useWithin: parseInt(text) })}
                                keyboardType="numeric"
                                placeholder="Số ngày còn lại"
                        /> */}
                          {/* <TextInput
                        style={styles.modalInput}
                        
                        onChangeText={(text) => setEditedItem({ ...editedItem, expiredDate: text })}
                        placeholder="Expiration Date"
                    /> */}
                      <TouchableOpacity
                            style={styles.modalInput}
                            onPress={() => setShowDatePicker(true)} // Show date picker when pressed
                        >
                            <Text>{editedItem.expiredDate ? editedItem.expiredDate.toLocaleString() : "Expiration Date"}</Text>
                    </TouchableOpacity>
                    
                        {showDatePicker && (
                            <DateTimePickerModal
                                isVisible={showDatePicker}
                                style={styles.modalInput}
                                date={editedItem.expiredDate ? new Date(editedItem.expiredDate) : new Date()} // Ensure it's a Date object
                                mode="datetime"
                                //display="default"
                                onConfirm={(date) => {
                                    
                                    // setShowDatePicker(false);
                                    setEditedItem({ ...editedItem, expiredDate: date });
                                    console.log("date   "+date);
                                    setShowDatePicker(false);
                                    
                                }}
                                onCancel={() => {
                                    
                                    setShowDatePicker(false);
                                }}
                            />
                        )}
                         <Text style={styles.normalText}>Note</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={editedItem.note}
                                multiline={true}
                                onChangeText={(text) => setEditedItem({ ...editedItem, note: text})}
                                placeholder="Chú ý"
                        />
                         {editedItem.food &&
                            <View style={styles.foodSelectItem}>
                                <Image source={{ uri: editedItem.food.imageUrl }} style={styles.foodImage} />
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text>{editedItem.food.name}</Text>
                                    <Text >({editedItem.food.type})</Text>
                                </View>
                            </View>
                        }
                            <TouchableOpacity
                                style={styles.addFoodButton}
                                onPress={handleShowChooseFood}
                            >
                                <Text>Change Food</Text>
                        </TouchableOpacity>
                          {showFoodSelectModal && (
                            <ScrollView style={styles.foodSelectModal}>
                                <Text style={styles.foodSelectTitle}>Select a Food</Text>
                                {listFood.map((food) => (
                                <TouchableOpacity
                                    key={food.id}
                                    style={styles.foodSelectItem}
                                    onPress={() => {
                                    handleChooseEditingItem(food);
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
                            </ScrollView>
                            )}

                            <View style={styles.buttonHolder}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
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
                        <Text style={styles.modalTitle}>Add Item</Text>
                        <Text style={styles.normalText}>Tên</Text>
                            <TextInput
                                style={styles.modalInput}
                              
                                onChangeText={(text) => setAddingItem({ ...addingItem, name: text })}
                                placeholder="Tên thực phẩm"
                        />
                        <Text style={styles.normalText}>Số lượng</Text>
                            <TextInput
                                style={styles.modalInput}
                               
                                onChangeText={(text) => setAddingItem({ ...addingItem, quantity: parseInt(text) })}
                                placeholder="Số lượng"
                                keyboardType="numeric"
                        />
                         <Text style={styles.normalText}>Hạn sử dụng</Text>
                         <TouchableOpacity
                            style={styles.modalInput}
                            onPress={() => setShowDatePicker(true)} // Show date picker when pressed
                        >
                            <Text>{addingItem.expiredDate ? addingItem.expiredDate.toLocaleString() : "Expiration Date"}</Text>
                    </TouchableOpacity>
                    
                        {showDatePicker && (
                            <DateTimePickerModal
                                isVisible={showDatePicker}
                                style={styles.modalInput}
                                date={addingItem.expiredDate ? new Date(addingItem.expiredDate) : new Date()} // Ensure it's a Date object
                                mode="datetime"
                                //display="default"
                                onConfirm={(date) => {
                                    
                                    // setShowDatePicker(false);
                                    setAddingItem({ ...addingItem, expiredDate: date });
                                    console.log("date   "+date);
                                    setShowDatePicker(false);
                                    
                                }}
                                onCancel={() => {
                                    
                                    setShowDatePicker(false);
                                }}
                            />
                        )}
                         <Text style={styles.normalText}>Note</Text>
                            <TextInput
                                style={styles.modalInput}
                               
                                onChangeText={(text) => setAddingItem({ ...addingItem, note: text})}
                                placeholder="Chú ý"
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
                            <ScrollView style={styles.foodSelectModal}>
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
                            </ScrollView>
                            )}
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
                        <TouchableOpacity 
                            onPress={() => setSelectedFilter('none')} 
                            style={styles.filterOption}
                        >
                            <View style={styles.checkboxContainer}>
                            <MaterialCommunityIcons
                                        name={selectedFilter === 'none' ? 'radiobox-marked' : 'radiobox-blank'}
                                        size={24}
                                        color={selectedFilter === 'none' ? 'blue' : 'gray'}
                                    />
                                <Text style={styles.filterOptionText}>Bỏ lọc</Text>
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
    },
    container: {
        flex: 1, 
    },
    header: {
        flex: 1, 
        backgroundColor: "#4EA72E", 
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
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
        backgroundColor: "#fff",
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
    textOrange: {
                color: "#FFA600",
                fontWeight: 'bold',
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

export default StoreScreen;
