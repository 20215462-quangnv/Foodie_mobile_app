import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAllFoodByGroup } from "../controller/FoodController";
import { updateRecipe } from "../controller/RecipeController";
import { colors } from "./styles/RootStyle";

const EditRecipeScreen = ({ route, navigation }) => {
  const { editedItem, listFood } = route.params;

  const [message, setMessage] = useState("");
  const [showFoodSelectModal, setShowFoodSelectModal] = useState(false); // Modal chọn món ăn
  const [selectedFood, setSelectedFood] = useState(editedItem.food); // Danh sách món ăn đã chọn
  const [isEditing, setIsEditing] = useState(false);
  const [item, setItem] = useState(editedItem);
  console.log("listFood    " + listFood.length);
  useEffect(() => {
    setItem(editedItem);
  }, [editedItem]);

  const handleBack = () => {
    navigation.navigate("Recipe");
  };

  const handleEdit = () => {
    setItem(editedItem);
    if (isEditing) {
      setItem(editedItem);
      setIsEditing(false);
    } else setIsEditing(true); // Chuyển sang trạng thái edit

    setShowFoodSelectModal(false);
  };
  const handleSave = () => {
    console.log("item food id:   " + item.food.id);
    const body = {
      name: item.name,
      description: item.description,
      htmlContent: item.htmlContent,
      foodId: item.food.id,
      authorId: item.author.id,
    };
    updateRecipe(item.id, body)
      .then((updatedRecipe) => {
        setIsEditing(false);
        setMessage("Recipe successfully updated");
        setTimeout(() => {
          setMessage("");
        }, 3000);
        console.log("Item successfully update:", updatedRecipe);
      })
      .catch((error) => {
        // Nếu thất bại, log lỗi và hiển thị thông báo
        console.error("Failed to update recipe:", error);
      });
  };

  // Hàm thêm món ăn vào danh sách
  const handleAddFood = (food) => {
    setItem((prevItem) => ({
      ...prevItem, // Giữ lại các thuộc tính cũ của item
      food: food, // Thay đổi giá trị của thuộc tính food
    }));
    console.log("foôd iidđa " + item.food.id);
  };

  const handleShowChooseFood = () => {
    if (showFoodSelectModal) {
      setShowFoodSelectModal(false);
    } else setShowFoodSelectModal(true);
  };

  return (
    <View style={styles.modalWrapper}>
      {message && (
        <View
          style={{
            position: "absolute",
            top: 10,
            left: 20,
            right: 20,
            padding: 20,
            backgroundColor: "green",
            zIndex: 1,
            borderRadius: 15,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>{message}</Text>
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
        <Image
          source={{ uri: item.food.imageUrl }}
          style={styles.headerImage}
          onError={(e) =>
            console.log("Error loading image: ", e.nativeEvent.error)
          }
        ></Image>
      </View>
      <ScrollView style={styles.body}>
        {/* Input cho tên công thức */}
        <View style={styles.bodyHeader}>
          {isEditing ? (
            <TextInput
              style={styles.inputFieldName}
              value={item.name}
              onChangeText={(text) => setItem({ ...item, name: text })}
              placeholder="Recipe Name"
            />
          ) : (
            <Text style={styles.recipeName}>{item.name}</Text>
          )}

          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Icon name="edit" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.bodySubHeader}>
          <Text style={styles.authorName}>{item.author.fullName}</Text>
          <Image
            source={{ uri: item.author.photoUrl }}
            style={styles.authorImage}
            onError={(e) =>
              console.log("Error loading image: ", e.nativeEvent.error)
            }
          ></Image>
        </View>

        {/* Input cho mô tả công thức */}
        {isEditing ? (
          <TextInput
            style={styles.inputFieldDescription}
            value={item.description}
            onChangeText={(text) => setItem({ ...item, description: text })}
            placeholder="Recipe Description"
          />
        ) : (
          <Text style={styles.recipeDescription}>{item.description}</Text>
        )}

        {isEditing ? (
          <TextInput
            style={styles.inputFieldContent}
            multiline={true}
            value={item.htmlContent}
            onChangeText={(text) => setItem({ ...item, htmlContent: text })}
            placeholder="Recipe Content"
          />
        ) : (
          <Text style={styles.recipeContent}>{item.htmlContent}</Text>
        )}

        {/* Nút Add more food để thêm món ăn */}
        {isEditing && (
          <TouchableOpacity
            style={styles.addFoodButton}
            onPress={handleShowChooseFood}
          >
            <Text>Change Food</Text>
          </TouchableOpacity>
        )}

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
                <Image
                  source={{ uri: food.imageUrl }}
                  style={styles.foodImage}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{food.name}</Text>
                  <Text>({food.type})</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderRadius: 12,
  },
  header: {
    height: 250,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#000",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 50,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    zIndex: 1,
  },
  headerImage: {
    top: 0,
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },

  body: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginTop: -20,
  },
  bodyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editButton: {
    marginLeft: 20,
  },
  recipeName: {
    fontSize: 36,
  },
  inputFieldName: {
    flex: 1,
    fontSize: 36,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
  },
  bodySubHeader: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  authorImage: {
    width: 50,
    marginLeft: 30,
  },
  authorName: {
    fontSize: 20,
  },
  recipeDescription: {
    fontSize: 20,
  },
  inputFieldDescription: {
    fontSize: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
  },
  recipeContent: {
    fontSize: 16,
    flex: 1,
  },
  inputFieldContent: {
    flex: 1,
    marginTop: 20,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
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
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "cover",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: "auto",
    alignItems: "center",

    paddingBottom: 50,
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
