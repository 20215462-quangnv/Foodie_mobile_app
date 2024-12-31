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
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";



const AdminHomeScreen = ({ navigation }) => {

    const [admin, setAdmin] = useState({});
    useEffect(() => {
        async function fetchData() {
            try {
             const adminString = await AsyncStorage.getItem("userProfile");
              console.log("admin: " + adminString);

              const admin = JSON.parse(adminString);
              console.log(admin.photoUrl);
              setAdmin(admin);
            } catch (error) {
                console.error("Error fetching admin information:", error);
            }
        }
        fetchData();
    }, []);
    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <View style = {styles.avatar}>
                <Image style = {styles.avatarImage} source={{uri: admin.photoUrl}}></Image>
          </View>
          <View style = {styles.title}>
                <Text style={styles.titleText}>{admin.fullName}</Text>
          </View>
          <View style = {styles.title}>
                <Text style={styles.normalText}>{admin.email}</Text>
          </View>
          <View style = {styles.title}>
                <Text style={styles.normalText}>{admin.phoneNumber}</Text>
          </View>
        </View>
        <View style={styles.body}>
          <ScrollView>
            
          </ScrollView>

        </View>
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
    flex: 2.5, 
    backgroundColor: "#4EA72E", 
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: -10,
  },
  avatar: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
   
  },
  avatarImage: {
    height: 80,
    width: 80,
    borderRadius: 50,
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
})
export default AdminHomeScreen