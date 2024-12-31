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
    FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getAllUsers
    
 } from "../../controller/UserController";

const UserControllerScreen = ({ navigation }) => {
    const [userList, setUserList] = useState([]);
    const [editedItem, setEditedItem] = useState({});
    const [detailModalVisiable, setDetailModalVisiable] = useState(false);
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllUsers(); 
                console.log("userList: ", data.data);
                setUserList(data.data);
            } catch (error) {
                console.error("Error fetching all User:", error);
            }
        }
        fetchData();
    }, []);

    const handlePress = (item) => {
        setDetailModalVisiable(true);
        setEditedItem(item);
    }
    const handleDeleteItem = () => {

    }

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.row} onPress={() => handlePress(item)}>
            <Text style={styles.cellId}>{item.id}</Text>
            <Text style={styles.cell}>{item.email}</Text>
            <Text style={styles.cell}>{item.fullName}</Text>
            <Text style={styles.cell}>{item.phoneNumber}</Text>
            <Text style={styles.cell}>{item.username}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                
                <View style={styles.title}>
                    <Text style={styles.titleText}>Foodie App</Text>
                </View>
               
                <View style={styles.title}>
                    <Text style={styles.titleText}>Danh sách User</Text>
                    <Text style={styles.normalText}>Số người dùng: {userList.length}</Text>
                </View>
               
            </View>
            <View style={styles.body}>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerCellId}>ID</Text>
                    <Text style={styles.headerCell}>Email</Text>
                    <Text style={styles.headerCell}>Full Name</Text>
                    <Text style={styles.headerCell}>Phone</Text>
                    <Text style={styles.headerCell}>Username</Text>
                </View>
                <FlatList
                    data={userList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.list}
                />
            </View>
            {/* Edit Item Modal*/}
             <Modal
                animationType="fade"
                transparent={true}
                visible={detailModalVisiable}
                onRequestClose={() => setDetailModalVisiable(false)}
            >
                    <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                            <View style = {styles.avatar}>
                                <Image style = {styles.avatarImage} source={{uri: editedItem.photoUrl ? editedItem.photoUrl:"https://via.placeholder.com/80"}}></Image>
                            </View>
                            <Text style={styles.modalTitle}>UserName: {editedItem.username}</Text>
                            <Text style={styles.modalTitle}>Full name: {editedItem.fullName}</Text>
                            <Text style={styles.modalTitle}>Email: {editedItem.email}</Text> 
                           
                            <Text style={styles.modalTitle}>Phone: {editedItem.phoneNumber}</Text>
                         
                         <View style={styles.buttonHolder}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleDeleteItem}>
                                    <Text style={styles.saveButtonText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setDetailModalVisiable(false)}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    header: {
        flex: 2.5, 
        backgroundColor: "#4EA72E", 
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
        paddingBottom: 10,
        marginBottom: -10,
    },
    avatar: {
        flex: 3,
        alignItems: "center",
        justifyContent: "center"
    },
    avatarImage: {
        height: 80,
        width: 80,
        borderRadius: 50,
    },
    title: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    normalText: {
        fontSize: 14,
        color: "white",
    },
    body: {
        flex: 7.5, 
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#ddd",
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
    },
    headerCell: {
        flex: 2,
        fontWeight: "bold",
        textAlign: "center",
    },
    headerCellId: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    cell: {
        flex: 2,
        textAlign: "center",
       
    },
    cellId: {
        flex: 1,
        textAlign: "center",
       
    },
    list: {
        marginTop: 10,
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
        fontSize: 16,
        padding: 10,
    },
    avatar: {
        alignItems: 'center',
         justifyContent: 'center',
        margin: 20,
   
    },
  avatarImage: {
    height: 80,
    width: 80,
    borderRadius: 50,
  },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonHolder: {
         marginTop: 20,
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
   
});

export default UserControllerScreen;
