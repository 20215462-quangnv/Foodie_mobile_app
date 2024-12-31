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



const UnitScreen = ({ navigation }) => {

    const [admin, setAdmin] = useState({});
    useEffect(() => {
        async function fetchData() {
            try {
             const adminString = await AsyncStorage.getItem("userProfile");
              console.log("admin: " + adminString);

              const admin = JSON.parse(adminString);
              setAdmin(admin);
            } catch (error) {
                console.error("Error fetching admin information:", error);
            }
        }
        fetchData();
    }, []);
    const handlePress = (screen) => {
        navigation.navigate(screen);
    }
    return (
        <View style={styles.container}>
        <View style={styles.header}>
           
          <View style = {styles.title}>
                <Text style={styles.titleText}>Measure & Unit Controller</Text>
          </View>
         
        </View>
            <View style={styles.body}>
                
                <View style={styles.bodyItem}>
                    <TouchableOpacity  style = {[styles.buttonHolder, styles.unitBtn]} onPress={()=> handlePress("UnitControllerScreen")}>
                        <Text  style = {styles.titleText}>Unit</Text>  
                    </TouchableOpacity>
                </View>
                <View style={styles.bodyItem}>
                    <TouchableOpacity  style = {[styles.buttonHolder, styles.categoryBtn]} onPress={()=> handlePress("CategoryControllerScreen")}>
                        <Text  style = {styles.titleText}>Food Category</Text>  
                </TouchableOpacity>
                
            </View>
            
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
    paddingBottom: 10,
    marginBottom: -10,
  },
  avatar: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
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
    bodyItem: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: "center",
    },
    buttonHolder: {
        width: '80%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    unitBtn: {
         backgroundColor: '#f44336',
    },
    categoryBtn: {
         backgroundColor: '#0086ff',
    }
})
export default UnitScreen