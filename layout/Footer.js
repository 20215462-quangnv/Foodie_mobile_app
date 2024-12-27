import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

const Footer = () => {
  const [activeTab, setActiveTab] = useState("Home");

  // Sử dụng hook useNavigation để lấy đối tượng navigation
  const navigation = useNavigation();

  // Hàm để điều hướng khi người dùng nhấn vào các tab
  const handlePress = (tabName) => {
    setActiveTab(tabName); // Cập nhật tab hiện tại
    navigation.navigate(tabName); // Điều hướng đến màn hình tương ứng
  };
  return (
    <View style={styles.footerContainer}>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handlePress("Recipe")}
        >
          
            <Icon
              name="utensils"
              size={24}
              color={activeTab === "Recipe" ? "yellow" : "white"}
            />
          
          <Text style={[styles.iconText, activeTab === "Recipe" && { color: "yellow" }]}>RECIPE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handlePress("Store")}
        >
         
            <Icon
              name="store"
              size={24}
              color={activeTab === "Store" ? "yellow" : "white"}
            />
         
          <Text style={[styles.iconText, activeTab === "Store" && { color: "yellow" }]}>STORE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handlePress("Home")}
        >
          <Icon
            name="home"
            size={24}
            color={activeTab === "Home" ? "yellow" : "white"}
          />
          <Text style={[styles.iconText, activeTab === "Home" && { color: "yellow" }]}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handlePress("Task")}
        >
          <Icon
            name="clipboard-list"
            size={24}
            color={activeTab === "Task" ? "yellow" : "white"}
          />
          <Text style={[styles.iconText, activeTab === "Task" && { color: "yellow" }]}>TASK</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handlePress("Chat")}
        >
          <Icon
            name="comments"
            size={24}
            color={activeTab === "Chat" ? "yellow" : "white"}
          />
          <Text style={[styles.iconText, activeTab === "Chat" && { color: "yellow" }]}>CHAT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handlePress("Plan")}
        >
          <Icon
            name="calendar-alt"
            size={24}
            color={activeTab === "Plan" ? "yellow" : "white"}
          />
          <Text style={[styles.iconText, activeTab === "Plan" && { color: "yellow" }]}>PLAN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
 footerContainer: {
    marginBottom: 20,
 },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 80,
    backgroundColor: "#4caf50",
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
  plusButton: {
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Footer;
