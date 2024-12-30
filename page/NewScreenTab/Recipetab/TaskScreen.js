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
import { colors } from "../../styles/RootStyle.js";
import { updateTask } from "../../../controller/ShoppingController.js";


const TaskDetailsScreen = ({ route, navigation }) => {
    
    const { items } = route.params;
    
   
    const handlePress = (item) => {
        const body ={
            foodId: item.id,
            quantity: item.quantity,
            done: !item.done,
        }
      updateTask(item.id, body)
      .then((updatedTask) => {
        console.log('Item successfully update:', updatedTask);
      })
      .catch((error) => {
        // Nếu thất bại, log lỗi và hiển thị thông báo
        console.error('Failed to update recipe:', error);
      });
    };
    const handleBack = () => {
     navigation.navigate('Task');
  }
    return (
        <View style={styles.container}>
            {/* Body */}
            <View style={styles.body}>
                <View style={styles.mainBody}>
                    <View style={styles.bodyHeader}>
                         <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                            <Icon name="arrow-left" size={30} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Tasks</Text>
                         
                    </View>
                    <View style={styles.listFood}>
                        <ScrollView style={styles.scrollViewListFood}>
                            <View style={styles.itemHolder}>
                               
                                {items.map((item, index) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        style={styles.itemContainer} 
                                        onPress={() => handlePress(item)}
                                        
                                    >
                                        <View style={styles.leftItem}>
                                            {(
                                                <TouchableOpacity
                                                    style={styles.checkboxContainer}
                                                   
                                                >
                                                <MaterialCommunityIcons
                                                    name={item.done ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                                    size={24}
                                                    color="black"
                                                />
                                                </TouchableOpacity>
                                            )}
                                             <Image
                                                source={{ uri: item.foodImage }}
                                                style={styles.imageWarning}
                                                onError={(e) => console.log("Error loading image: ", e.nativeEvent.error)}
                                            />
                                            
                                        </View>

                                        <View style={styles.rightItem}>
                                            <Text style={[styles.itemText, item.done && styles.doneText]}>{item.foodName}</Text>
                                            <Text style={[styles.normalText, , item.done && styles.doneText]}>Số lượng: {item.quantity}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    doneText: {
        textDecorationLine: 'line-through',
    },
    headerText: {
        fontSize: 31,
        fontWeight: 'bold',
        color: 'white',
    },
    normalText: {
        fontSize: 16,
        fontFamily: colors.fontFamily,
        padding: 10,
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
        alignItems: 'flex-end',
        paddingTop: 20,
        paddingBottom: 10,
        flex: 0.5,
        backgroundColor: colors.themeColor,
        flexDirection: 'row',
        justifyContent: 'center',

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
        textAlign: 'left',
        padding: 10,
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: colors.fontFamily,
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
        flexDirection: "row",
        alignItems: 'center'
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
    backButton: {
        position: 'absolute',
        top: 20,
        left: 10,
        width: 50,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        zIndex: 1,
      },
});

export default TaskDetailsScreen;
