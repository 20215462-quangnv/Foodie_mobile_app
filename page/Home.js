import React, { useState, useEffect} from "react";
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
import Footer from '../layout/Footer';
import { getFridgeGroup, getAllFridgeGroup } from "../controller/FridgeController";
import { getAllRecipes } from "../controller/RecipeController";

const HomeScreen = ({ navigation })=> {
  const [fridgeItems, setFridgeItems] = useState([]);
  const [recipeItems, setRecipeItems] = useState([]);
  useEffect(() => {
      async function fetchData() {
        // const token = getToken(); // Lấy token hiện tại
        // if (!token) {
        //     setError('Token not found. Please login.');
        //     return;
        // }
        try {
        const data = await getAllRecipes();  
        setRecipeItems(data.data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            htmlContent: item.htmlContent,
            authorName: item.author.fullName, 
            food: item.food, 
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          })));  
      } catch (error) {
        setError('Error fetching recipes');  
      }
    }
    
    fetchData();
  }, []);  
  useEffect(() => {
        async function fetchData() {
          try {
            const data = await getAllFridgeGroup();  
            setFridgeItems(data
            .filter(item => item.data && item.data.length > 0)  // Loại bỏ các item không thỏa mãn điều kiện
            .map(item => {
                console.log(item.data.length);
                console.log(item.data[0].food);
                console.log(new Date(item.data[0].expiredDate));
                return item.data.map(subItem => ({
                    foodName: subItem.foodName,
                    quantity: subItem.quantity,
                    useWithin: subItem.useWithin,
                    note: subItem.note,
                    foodId: subItem.foodId,
                    ownerId: subItem.ownerId,
                    expiredDate: new Date(subItem.expiredDate),
                    food: subItem.food,
                }));
            })
            .flat()
            );

          } catch (error) {
            setError('Error fetching fridge');  
          }
        }
        
        fetchData(); 
  }, []);


  const checkExpired = (expiredDate) => {
    const today = new Date();
    const expirationDate = new Date(expiredDate);

    today.setHours(0, 0, 0, 0);
    expirationDate.setHours(0, 0, 0, 0);

    const timeDifference = expirationDate - today;
    const daysLeft = timeDifference / (1000 * 3600 * 24);

    return daysLeft;
};





  return (
    <View style={styles.container}>
      {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity style={styles.notiButton}>
                <Icon name="bell" size={24} color="white" />
            </TouchableOpacity>

            <View style = {styles.title}>
                <Text style={styles.titleText}>Foodies</Text>
            </View>

            <View style = {styles.buttonGroup}>
                <TouchableOpacity style={styles.avatarButton}>
                    <Text style={styles.circleButtonText}>H</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton}>
                    <Icon name="plus" size={24} color="white" />
                </TouchableOpacity>
            </View>
        
        </View>

        {/* Body */}
        <View style={styles.body}>
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
                        {recipeItems.map((item, i)  => (
                            <View key={i} style={styles.itemSuggest}>
                                <Text style={styles.titleSuggest}>{item.name}</Text>
                                <Image
                                    source={{
                                    uri: item.food.imageUrl
                                    }}
                                    style={styles.imageSuggest}
                                    onError={(e) => console.log("Error loading image: ", e.nativeEvent.error)}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.warning}>
                <ScrollView style={styles.scrollViewWarning}>
                    
                        <View style={styles.itemHolder}>
                              {fridgeItems.map((item, index) => {
                                  
                               const daysLeft = checkExpired(item.expiredDate);
                               
                                if (daysLeft > 2) {
                                    return null;
                                }

                                return (
                                    <View key={index} style={styles.itemContainer}>
                                        <View style={styles.leftItem}> 
                                            <Image
                                                source={{
                                                    uri: item.food.imageUrl
                                                }}
                                                style={styles.imageWarning}
                                                onError={(e) => console.log("Error loading image: ", e.nativeEvent.error)}
                                            />
                                            <Text style={styles.itemText}>{item.foodName}</Text>
                                        </View>

                                        <View style={styles.rightItem}>
                                            {daysLeft < 0 && 
                                                (<Text style={styles.textRed}>ĐÃ HẾT HẠN</Text>)
                                            }
                                             {daysLeft >= 0 && 
                                                <Text style={styles.textOrange}>SẮP HẾT HẠN</Text>
                                            }
                                            
                                            <Text style={styles.normalText}>Số lượng: {item.quantity}</Text>
                                            <Text style={styles.normalText}>Hết hạn: {item.expiredDate.getDate()}-{item.expiredDate.getMonth()+1}-{item.expiredDate.getFullYear()}</Text>
                                        </View>
                                        
                                    </View>

                                )})}
                        </View>
                    
                </ScrollView>
                </View>
               
            </View>
        </View>

        {/* Footer */}
        
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
  notiButton: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 5,
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
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 30,
    marginTop: 10,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333', // Màu nền cho nút hình tròn
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    
  },
  circleButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
/* end header */

/* begin body */
  body: {
    flex: 7.5, 
    backgroundColor: "#fff",
    justifyContent: "center", 
    alignItems: "center", 
  },
  /*search bar begin*/
        searchbarContainer:{
            flex: 1,
            width: "100%",
            padding: 10, 
        },
        searchBar:{
            borderWidth: 2, 
            borderColor: '#696969', 
            borderRadius: 10, 
            flexDirection: 'row',
            alignItems: 'center',
        },
        searchButton:{
            margin: 5,
        },
        inputSearch: {
            flex: 1,

        },
 /*search bar end*/

  /*mainbody begin*/
    mainBody: {
            marginTop: 20,
            flex: 11,
            width: "100%", 
        },
        /*list note*/
            listNote: {
                flex: 3,
                backgroundColor: "#4EA72E",
                marginLeft: 10, 
                marginBottom: 10, 
                marginRight: 10,
                borderRadius: 10,
            },
            hasList: {
                flex: 1,
                padding: 10,
            },
            item: {
                
                backgroundColor: "white",
                margin: 5,
                borderRadius: 5,
                padding: 5,
                flexDirection: "row",
                justifyContent: 'space-between',
            },

        /* suggest */
            suggestDish: {

                padding: 10,
                flex: 2,
                backgroundColor: "#4EA72E",
                marginLeft: 10, 
                marginBottom: 10, 
                marginRight: 10,
                borderRadius: 10,
               
            },
            itemSuggest: {
                
                backgroundColor: "white",
                width: 100,
                margin:5,
                borderRadius: 5,
                overflow: 'hidden', 
            },
            titleSuggest: {

            },
            imageSuggest: {
                flex:1,
            },
        /* warning */
            warning: {
                flex: 4,
                //backgroundColor: "#afafaf",
            },
            scrollViewWarning: {
                flex: 1,
                padding: 10,
               // backgroundColor: "#000",
            },
            itemHolder: {
                flexDirection: "row",
                flexWrap: 'wrap',
                justifyContent: "space-between",
            },
            itemContainer: {
                //flex:1,
                width: '100%',
                height: 120,
                marginBottom: 10,
                padding: 5, 
                borderRadius: 5, 
                overflow: 'hidden',
                backgroundColor: '#fff', 
                shadowColor: '#000',
                flexDirection: 'row',
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
                resizeMode: 'cover',
                borderWidth: 1,
                borderColor: "#000", 
            },
            itemText: {
               
                textAlign: 'center', // Center text in each item
                padding: 5,
                fontSize: 16,
            },
            leftItem: {
                flex: 3,
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
   /*mainbody end*/

/* end body */
  bodyText: {
    fontSize: 18,
    color: "#333",
  },

});

export default HomeScreen;
