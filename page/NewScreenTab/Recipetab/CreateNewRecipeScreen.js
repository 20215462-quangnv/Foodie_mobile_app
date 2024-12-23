import React, { useState, useEffect } from "react";
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
import DateTimePicker from "@react-native-community/datetimepicker";
const CreateNewReCipeScreen = (()=> {
    // id: item.id,
    // name: item.name,
    // description: item.description,
    // authorName: item.author.fullName,  // Truy cập vào 'author' và lấy 'name'
    // foodType: item.food.type,  // Truy cập vào 'food' và lấy 'type'
    // createdAt: item.createdAt,
    // updatedAt: item.updatedAt
    const [addingItem, setAddingItem] = useState({});
    const handleSave = () => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === editedItem.id ? { ...item, ...editedItem } : item
            )
        );
        setModalVisible(false);
    };
    
    return (
        <View
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
                      
                        onChangeText={(text) => setAddingItem({ ...addingItem, name: text })}
                        placeholder="Recipe Name"
                    />
                    <TextInput
                        style={styles.modalInput}
                       
                        onChangeText={(text) => setAddingItem({ ...addingItem, description: text })}
                        placeholder="Recipe Description"
                       
                    />
                    {/* <TextInput
                        style={styles.modalInput}
                       
                        onChangeText={(text) => setAddingItem({ ...addingItem, date: text })}
                        placeholder="Expiration Date"
                    /> */}
                      {/* <TouchableOpacity
                        style={styles.modalInput}
                        onPress={() => setShowDatePicker(true)} // Show date picker when pressed
                    >
                        <Text>{addingItem.date ? addingItem.date.toDateString() : "Expiration Date"}</Text>
                    </TouchableOpacity> */}
                  
                    {/* {showDatePicker && (
                        <DateTimePicker
                            style={styles.modalInput}
                            value={addingItem.date ? new Date(addingItem.date) : new Date()} // Ensure it's a Date object
                            mode="date" // You can also use "time" or "datetime" based on the requirement
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false); // Hide date picker after selection
                                if (selectedDate) {
                                    setAddingItem({ ...addingItem, date: selectedDate });
                                }
                            }}
                        />
                    )} */}
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
    </View>
    )
})
const styles = StyleSheet.create({
   
});
export default CreateNewReCipeScreen;