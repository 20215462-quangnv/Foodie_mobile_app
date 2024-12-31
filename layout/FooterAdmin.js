import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

const FooterAdmin = () => {
  const [activeTab, setActiveTab] = useState("AdminHome");

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
          onPress={() => handlePress("Unit")}
        >
         
            <Icon
              name="cogs"
              size={24}
              color={activeTab === "Unit" ? "yellow" : "white"}
            />
         
          <Text style={[styles.iconText, activeTab === "Unit" && { color: "yellow" }]}>UNIT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handlePress("AdminHome")}
        >
          <Icon
            name="home"
            size={24}
            color={activeTab === "AdminHome" ? "yellow" : "white"}
          />
          <Text style={[styles.iconText, activeTab === "AdminHome" && { color: "yellow" }]}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handlePress("UserControllerScreen")}
        >
          <Icon
            name="user-friends"
            size={24}
            color={activeTab === "UserControllerScreen" ? "yellow" : "white"}
          />
          <Text style={[styles.iconText, activeTab === "UserControllerScreen" && { color: "yellow" }]}>USER</Text>
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

export default FooterAdmin;
