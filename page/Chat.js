import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import Footer from '../layout/Footer';
import {  
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity, 
    TextInput,
    ScrollView,
    Image,} from "react-native";


const ChatScreen = ({ navigation }) => {

    return (


        <View style={styles.container}>
      {/* Header */}
        <View style={styles.header}>
            
            <View style = {styles.title}>
                <Text style={styles.titleText}>CHAT</Text>
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
                    />
                </View>
            </View>

            <View style={styles.mainBody}>
                <View style={styles.listNote}>

                    <View style={styles.hasList}>
                        <Text style={styles.headerText}>
                            DANH SÁCH HIỆN CÓ
                        </Text>
                        <ScrollView style={styles.scrollView}>
                            {Array.from({ length: 5}, (_, i) => ( //Todo list 
                                <View key={i} style={styles.item}>
                                    <Text style={styles.dateItem}>Item {i + 1}</Text>
                                    <Text style={styles.contentItem}>Item {i + 1}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.suggestDish}>
                    <Text style={styles.headerText}>
                        Dựa theo tủ của bạn
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <View key={i} style={styles.itemSuggest}>
                                <Text style={styles.titleSuggest}>Item {i}</Text>
                                <Image
                                    source={{
                                    uri: "https://t4.ftcdn.net/jpg/05/38/99/75/360_F_538997597_wXUHi67t6VMLEcVTW2c6D2P9F0e1f6yE.jpg",
                                    }}
                                    style={styles.imageSuggest}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.warning}>
                <ScrollView style={styles.scrollViewWarning}>
                    
                        <View style={styles.itemHolder}>
                        {items.map((item, index) => (
                            <View key={index} style={styles.itemContainer}>
                                <View style={styles.leftItem}> 
                                    <Image
                                        source={{
                                            uri: "https://t4.ftcdn.net/jpg/05/38/99/75/360_F_538997597_wXUHi67t6VMLEcVTW2c6D2P9F0e1f6yE.jpg",
                                        }}
                                        style={styles.imageWarning}
                                    />
                                    <Text style={styles.itemText}>{item}</Text>
                                </View>

                                <View style={styles.rightItem}>
                                    <Text style={styles.textRed}>ĐÃ HẾT HẠN</Text>
                                    {/*<Text style={styles.textOrange}>SẮP HẾT HẠN</Text>*/}
                                    <Text style={styles.normalText}>Số lượng: 10</Text>
                                    <Text style={styles.normalText}>Hết hạn: {item}</Text>
                                </View>
                                
                            </View>
                        ))}
                        </View>
                    
                </ScrollView>
                </View>
               
            </View>
        </View>

        {/* Footer */}
        <Footer navigation={navigation}/>
    </View>

    );
};



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
    flex: 1, 
    backgroundColor: "#4EA72E", 
    paddingBottom : 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title: {
    flex: 4,
    alignItems: 'center',
    marginBottom: 5,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
/* end header */

});

export default ChatScreen;