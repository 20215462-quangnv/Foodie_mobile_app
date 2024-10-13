// Footer.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="home" size={24} color="white" />
          <Text style={styles.iconText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer}>
          <View style={styles.plusButton}>
            <Icon name="plus-circle" size={28} color="white" />
          </View>
          <Text style={styles.iconText}>NEW</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="comments" size={24} color="white" />
          <Text style={styles.iconText}>CHAT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1.5,
    backgroundColor: "#fff",
  },
  footer: {
    alignItems: "center",
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 80,
    backgroundColor: '#4caf50',
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  plusButton: {
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Footer;
