import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import Footer from "../layout/Footer";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from "react-native";

const ChatScreen = ({ navigation }) => {
  const [chatRoomName, setChatRoomName] = useState(""); // State for storing the chat room name

  const handleCreateChatRoom = () => {
    // Show a prompt to input a new chat room name
    Alert.prompt(
      "Enter Chat Room Name", // Title of the prompt
      "Please enter the name for your new chat room", // Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel pressed"),
          style: "cancel",
        },
        {
          text: "Create",
          onPress: (name) => {
            if (name) {
              setChatRoomName(name); // Set the entered name to the state
              console.log("Created new chat room:", name);
            } else {
              Alert.alert("Error", "Chat room name cannot be empty");
            }
          },
        },
      ],
      "plain-text",
      chatRoomName // Default value (empty at first)
    );
  };

  const items = ["2024-12-01", "2024-12-10", "2024-12-20"]; // Example data for warnings

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.title}>
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
            <TextInput style={styles.inputSearch} placeholder="Search..." />
          </View>
        </View>

        <View style={styles.mainBody}>
          <View style={styles.listNote}>
            <View style={styles.hasList}>
              <Text style={styles.headerText}>DANH SÁCH HIỆN CÓ</Text>
              <ScrollView style={styles.scrollView}>
                {Array.from({ length: 5 }, (_, i) => (
                  <View key={i} style={styles.item}>
                    <Text style={styles.dateItem}>Item {i + 1}</Text>
                    <Text style={styles.contentItem}>Item {i + 1}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.suggestDish}>
            <Text style={styles.headerText}>Dựa theo tủ của bạn</Text>
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

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleCreateChatRoom}>
        <Icon name="plus" size={30} color="white" />
      </TouchableOpacity>

      {/* Footer */}
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    backgroundColor: "#4EA72E",
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  title: {
    flex: 4,
    alignItems: "center",
    marginBottom: 5,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  body: {
    flex: 8,
  },
  searchbarContainer: {
    padding: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchButton: {
    marginRight: 10,
  },
  inputSearch: {
    flex: 1,
    height: 40,
  },
  mainBody: {
    flex: 1,
    padding: 10,
  },
  listNote: {
    marginBottom: 10,
  },
  hasList: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    padding: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  suggestDish: {
    marginBottom: 10,
  },
  warning: {
    backgroundColor: "#ffe0e0",
    borderRadius: 10,
    padding: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    backgroundColor: "#4EA72E",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollView: {
    maxHeight: 150,
  },
  scrollViewWarning: {
    maxHeight: 200,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  leftItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightItem: {
    alignItems: "flex-end",
  },
  imageWarning: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  textRed: {
    color: "red",
    fontWeight: "bold",
  },
  normalText: {
    fontSize: 14,
  },
});

export default ChatScreen;
