import React, { useState } from "react";
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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Footer from "../layout/Footer";
import { getAllRecipes } from "../controller/RecipeController";

const RecipeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllRecipes(); // Chờ kết quả từ API
        setItems(data); // Cập nhật state với dữ liệu nhận được
      } catch (error) {
        setError("Error fetching recipes"); // Cập nhật lỗi nếu có
      }
    }

    fetchData(); // Gọi hàm fetchData
  }, []); // Chạy chỉ một lần khi component mount

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
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || editedItem.date;
    setShowDatePicker(Platform.OS === "ios" ? true : false);
    setEditedItem({ ...editedItem, date: currentDate });
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setEditedItem(item);
    setModalVisible(true);
  };
  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const openAddItemModal = () => {
    setAddItemModalVisible(true);
  };
  const handleSave = () => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === editedItem.id ? { ...item, ...editedItem } : item
      )
    );
    setModalVisible(false);
  };
  const handleSaveAddedItem = () => {
    setAddingItem(null);
    const newItem = {
      id: items.length + 1, // Hoặc dùng logic tạo ID khác
      name: addingItem.name || "New Item",
      image:
        "https://t4.ftcdn.net/jpg/05/38/99/75/360_F_538997597_wXUHi67t6VMLEcVTW2c6D2P9F0e1f6yE.jpg", // Hình mặc định
      quantity: addingItem.quantity || 1,
      state: addingItem.state || "Available",
      date: addingItem.date || new Date().toISOString().split("T")[0], // Ngày mặc định là hôm nay
    };
    setItems((prevItems) => [...prevItems, newItem]);
    setAddItemModalVisible(false);
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
      setSelectedItems(items.map((item) => item.id)); // Chọn tất cả item
    }
  };
  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedItems([]); // Dọn dẹp các item đã chọn
  };

  const deleteSelectedItems = () => {
    const newItems = items.filter((item) => !selectedItems.includes(item.id));
    setItems(newItems); // Cập nhật lại danh sách items sau khi xóa
    cancelSelection(); // Hủy chế độ chọn sau khi xóa
  };

  // Filter logic for sorting and filtering items based on multiple filters
  const filteredItems = () => {
    let filteredItems = [...items]; // Assuming items is your original list

    // Assuming selectedFilter is the current selected filter
    // Example selected filter, could come from your state

    switch (selectedFilter) {
      case "quantity_desc":
        filteredItems = filteredItems.sort((a, b) => b.quantity - a.quantity);
        break;
      case "quantity_asc":
        filteredItems = filteredItems.sort((a, b) => a.quantity - b.quantity);
        break;
      case "date_asc":
        filteredItems = filteredItems.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        break;
      case "date_desc":
        filteredItems = filteredItems.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        break;
      case "expired":
        filteredItems = filteredItems.filter(
          (item) => item.state === "Expired"
        );
        break;
      default:
        break;
    }

    //console.log(filteredItems);

    if (searchQuery.trim()) {
      filteredItems = filteredItems.filter((item) =>
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
            <TouchableOpacity
              style={styles.filterButton}
              onPress={openFilterModal}
            >
              <Icon name="filter" size={32} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainBody}>
          <View style={styles.bodyHeader}>
            <Text style={styles.headerText}>DANH SÁCH CÔNG THỨC</Text>
          </View>
          <View style={styles.listFood}>
            <ScrollView style={styles.scrollViewListFood}>
              <View style={styles.itemHolder}>
                {isSelectionMode && (
                  <View style={styles.cancelButtonContainer}>
                    <TouchableOpacity
                      style={styles.selectAllContainer}
                      onPress={selectAllItems}
                    >
                      <MaterialCommunityIcons
                        name={
                          selectedItems.length === items.length
                            ? "checkbox-marked"
                            : "checkbox-blank-outline"
                        }
                        size={24}
                        color="black"
                      />
                      <Text style={styles.selectAllText}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={deleteSelectedItems}
                      style={styles.deleteButton}
                    >
                      <Text style={styles.deleteButtonText}>
                        Delete Selected Items
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={cancelSelection}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
                            name={
                              selectedItems.includes(item.id)
                                ? "checkbox-marked"
                                : "checkbox-blank-outline"
                            }
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      )}
                      <Image
                        source={{ uri: item.htmlContent }}
                        style={styles.imageWarning}
                        onError={(e) =>
                          console.log(
                            "Error loading image: ",
                            e.nativeEvent.error
                          )
                        }
                      />
                      <Text style={styles.itemText}>{item.name}</Text>
                    </View>

                    <View style={styles.rightItem}>
                      <Text style={styles.textRed}>{item.name}</Text>
                      <Text style={styles.normalText}>
                        Mô tả: {item.description}
                      </Text>
                      <Text style={styles.normalText}>
                        Tạo bởi: {item.author.fullName}
                      </Text>
                      <Text style={styles.normalText}>
                        Created at: {new Date(item.createdAt).toDateString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={openAddItemModal}>
            <Icon name="plus-circle" size={48} color="#4EA72E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Popup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Item</Text>
            <TextInput
              style={styles.modalInput}
              value={editedItem.name}
              onChangeText={(text) =>
                setEditedItem({ ...editedItem, name: text })
              }
              placeholder="Item Name"
            />
            <TextInput
              style={styles.modalInput}
              value={editedItem.quantity?.toString()}
              onChangeText={(text) =>
                setEditedItem({ ...editedItem, quantity: parseInt(text) })
              }
              placeholder="Quantity"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              value={editedItem.state}
              onChangeText={(text) =>
                setEditedItem({ ...editedItem, state: text })
              }
              placeholder="State"
            />
            <TouchableOpacity
              style={styles.modalInput}
              onPress={() => setShowDatePicker(true)} // Show date picker when pressed
            >
              <Text>
                {editedItem.date
                  ? editedItem.date.toDateString()
                  : "Select Date"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                style={styles.modalInput}
                value={editedItem.date ? new Date(editedItem.date) : new Date()} // Ensure it's a Date object
                mode="date" // You can also use "time" or "datetime" based on the requirement
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false); // Hide date picker after selection
                  if (selectedDate) {
                    setEditedItem({ ...editedItem, date: selectedDate });
                  }
                }}
              />
            )}

            <View style={styles.buttonHolder}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Add new Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addItemModalVisible}
        onRequestClose={() => setAddItemModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Item</Text>
            <TextInput
              style={styles.modalInput}
              onChangeText={(text) =>
                setAddingItem({ ...addingItem, name: text })
              }
              placeholder="Recipe Name"
            />
            <TextInput
              style={styles.modalInput}
              onChangeText={(text) =>
                setAddingItem({ ...addingItem, description: text })
              }
              placeholder="Recipe Description"
            />
            <View style={styles.buttonHolder}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAddedItem}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAddItemModalVisible(false)}
              >
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
              onPress={() => setSelectedFilter("quantity_desc")}
              style={styles.filterOption}
            >
              <View style={styles.checkboxContainer}>
                <MaterialCommunityIcons
                  name={
                    selectedFilter === "quantity_desc"
                      ? "radiobox-marked"
                      : "radiobox-blank"
                  }
                  size={24}
                  color={selectedFilter === "quantity_desc" ? "blue" : "gray"}
                />
                <Text style={styles.filterOptionText}>
                  Quantity từ cao đến thấp
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedFilter("quantity_asc")}
              style={styles.filterOption}
            >
              <View style={styles.checkboxContainer}>
                <MaterialCommunityIcons
                  name={
                    selectedFilter === "quantity_asc"
                      ? "radiobox-marked"
                      : "radiobox-blank"
                  }
                  size={24}
                  color={selectedFilter === "daquantity_asc" ? "blue" : "gray"}
                />
                <Text style={styles.filterOptionText}>
                  Quantity từ thấp đến cao
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedFilter("date_asc")}
              style={styles.filterOption}
            >
              <View style={styles.checkboxContainer}>
                <MaterialCommunityIcons
                  name={
                    selectedFilter === "date_asc"
                      ? "radiobox-marked"
                      : "radiobox-blank"
                  }
                  size={24}
                  color={selectedFilter === "date_asc" ? "blue" : "gray"}
                />
                <Text style={styles.filterOptionText}>
                  Ngày hết hạn gần nhất
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedFilter("date_desc")}
              style={styles.filterOption}
            >
              <View style={styles.checkboxContainer}>
                <MaterialCommunityIcons
                  name={
                    selectedFilter === "date_desc"
                      ? "radiobox-marked"
                      : "radiobox-blank"
                  }
                  size={24}
                  color={selectedFilter === "date_desc" ? "blue" : "gray"}
                />
                <Text style={styles.filterOptionText}>
                  Ngày hết hạn xa nhất
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedFilter("expired")}
              style={styles.filterOption}
            >
              <View style={styles.checkboxContainer}>
                <MaterialCommunityIcons
                  name={
                    selectedFilter === "expired"
                      ? "radiobox-marked"
                      : "radiobox-blank"
                  }
                  size={24}
                  color={selectedFilter === "expired" ? "blue" : "gray"}
                />
                <Text style={styles.filterOptionText}>Đã hết hạn</Text>
              </View>
            </TouchableOpacity>

            {/* Apply and Cancel Buttons */}
            <View style={styles.buttonHolder}>
              <TouchableOpacity style={styles.saveButton} onPress={applyFilter}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setFilterModalVisible(false)}
              >
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
    fontWeight: "bold",
    color: "black",
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
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  title: {
    flex: 4,
    alignItems: "center",
    marginBottom: 5,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
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
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    borderWidth: 2,
    borderColor: "#696969",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
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
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemContainer: {
    width: "100%",
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    flexDirection: "row",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  imageWarning: {
    height: 80,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "#000",
  },
  itemText: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff5722",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButtonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 10,
  },
  selectAllText: {
    fontSize: 16,
    marginLeft: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20, // Cách cạnh dưới 20px
    right: 20, // Cách cạnh phải 20px
    justifyContent: "center", // Căn giữa nội dung
    alignItems: "center", // Căn giữa nội dung
    zIndex: 10, // Đảm bảo nằm trên cùng
  },
  leftItem: {
    flex: 2,
    overflow: "hidden",
    flexDirection: "column",
  },
  rightItem: {
    flex: 3,
    overflow: "hidden",
    paddingLeft: 10,
  },
  textRed: {
    color: "#E23131",
    fontWeight: "bold",
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
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  filterOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
  },
  applyFilterButton: {
    backgroundColor: "#4EA72E",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  applyFilterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "orange", // Visual highlight when selected
    borderColor: "orange",
  },
});

export default RecipeScreen;
