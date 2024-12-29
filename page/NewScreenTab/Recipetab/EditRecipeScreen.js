import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAllFoodByGroup } from "../../../controller/FoodController";
import { updateRecipe } from "../../../controller/RecipeController";

const EditRecipeScreen = ({
  setItems,
  editedItem,
  setEditedItem,
  setModalVisible,
}) => {
  const [showFoodSelectModal, setShowFoodSelectModal] = useState(false); // Modal chọn món ăn
  const [selectedFoods, setSelectedFoods] = useState(editedItem.food || []); // Danh sách món ăn đã chọn
  const [listFood, setListFood] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllFoodByGroup(); // Chờ kết quả từ API
        setListFood(
          data.data.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            description: item.description,
            imageUrl: item.imageUrl,
            measureUnit: item.measureUnit.unitName,
            foodCategory: item.foodCategory.name,
          }))
        ); // Cập nhật state với dữ liệu nhận được
        console.log(data);
      } catch (error) {
        setError("Error fetching recipes"); // Cập nhật lỗi nếu có
      }
    }

    fetchData(); // Gọi hàm fetchData
  }, []); // Chạy chỉ một lần khi component mount
  // Hàm lưu dữ liệu
  const handleSave = () => {
    setModalVisible(false); // Đóng modal khi lưu xong
    const body = {
      name: editedItem.name,
      description: editedItem.description,
      htmlContent: editedItem.htmlContent,
      foodId: editedItem.food.id,
      authorId: editedItem.authorId,
    };
    updateRecipe(editedItem.id, body)
      .then((updatedRecipe) => {
        // Nếu thành công, thêm công thức mới vào danh sách
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === editedItem.id ? { ...item, ...editedItem } : item
          )
        );
        setModalVisible(false);
        console.log("Item successfully update:", updatedRecipe);
      })
      .catch((error) => {
        // Nếu thất bại, log lỗi và hiển thị thông báo
        console.error("Failed to update recipe:", error);
      });
  };

  // Hàm thêm món ăn vào danh sách
  const handleAddFood = (food) => {
    if (!selectedFoods.some((item) => item.id === food.id)) {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  // Hàm xóa món ăn khỏi danh sách
  const handleRemoveFood = (food) => {
    setSelectedFoods(selectedFoods.filter((item) => item.id !== food.id));
  };

  // Mở modal khi có `editedItem`
  useEffect(() => {
    if (editedItem) {
      setModalVisible(true);
    }
  }, [editedItem]);

  return (
    <View style={styles.overlay} onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalWrapper}>
        <Text style={styles.title}>Edit Recipe</Text>

        {/* Input cho tên công thức */}
        <Text style={styles.foodDescription}>Name</Text>
        <TextInput
          style={styles.inputField}
          value={editedItem.name}
          onChangeText={(text) => setEditedItem({ ...editedItem, name: text })}
          placeholder="Recipe Name"
        />

        {/* Input cho mô tả công thức */}
        <Text style={styles.foodDescription}>Description</Text>
        <TextInput
          style={styles.inputField}
          value={editedItem.description}
          onChangeText={(text) =>
            setEditedItem({ ...editedItem, description: text })
          }
          placeholder="Recipe Description"
        />
        <Text style={styles.foodDescription}>Content</Text>
        <TextInput
          style={styles.inputField}
          multiline={true}
          value={editedItem.htmlContent}
          onChangeText={(text) =>
            setEditedItem({ ...editedItem, htmlContent: text })
          }
          placeholder="Recipe Content"
        />

        {/* Danh sách các món ăn đã chọn */}

        <Text style={styles.foodDescription}>Food</Text>
        <View style={styles.foodCard}>
          <Image
            source={{ uri: editedItem.food.image }}
            style={styles.foodImage}
          />
          <View style={styles.foodDetails}>
            <Text style={styles.foodName}>{editedItem.food.name}</Text>
            <Text style={styles.foodType}>{editedItem.food.type}</Text>
            <Text style={styles.foodDescription}>
              {editedItem.food.description}
            </Text>
          </View>
          {/* <TouchableOpacity onPress={() => handleRemoveFood(food)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity> */}
        </View>

        {/* Nút Add more food để thêm món ăn */}
        <TouchableOpacity
          style={styles.addFoodButton}
          onPress={() => setShowFoodSelectModal(true)}
        >
          <Text>Change Food</Text>
        </TouchableOpacity>

        {/* Modal hiển thị danh sách món ăn cho phép chọn */}
        {showFoodSelectModal && (
          <View style={styles.foodSelectModal}>
            <Text style={styles.foodSelectTitle}>Select a Food</Text>
            {listFood.map((food) => (
              <TouchableOpacity
                key={food.id}
                style={styles.foodSelectItem}
                onPress={() => {
                  handleAddFood(food);
                  setShowFoodSelectModal(false); // Đóng modal khi chọn món ăn
                }}
              >
                <Text>{food.name}</Text>
                <Image
                  source={{ uri: food.imageUrl }}
                  style={styles.foodImage}
                />
                <Text>{food.type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
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
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalWrapper: {
    width: 320,
    height: 700,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  inputField: {
    maxHeight: 200,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 18,
    paddingLeft: 10,
    borderRadius: 8,
  },
  foodList: {
    marginBottom: 15,
  },
  foodCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  foodType: {
    fontSize: 12,
    color: "#888",
  },
  foodDescription: {
    fontSize: 12,
    color: "#777",
  },
  removeButton: {
    padding: 5,
    backgroundColor: "#f44336",
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addFoodButton: {
    marginTop: 48,
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  foodSelectModal: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  foodSelectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  foodSelectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EditRecipeScreen;
