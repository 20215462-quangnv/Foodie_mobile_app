import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getAllGroups } from "../controller/GroupController";
import { useNavigation } from "@react-navigation/native";

const ChatScreen = () => {
  const [groups, setGroups] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await getAllGroups();
        // Truy cập vào "data" trong response để lấy mảng các group
        const fetchedGroups = response.data;

        // Kiểm tra và log dữ liệu nhóm
        console.log("Fetched groups:", fetchedGroups);

        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    }
    fetchGroups();
  }, []);

  const filteredGroups = Array.isArray(groups)
    ? groups.filter((group) => group.enable === true)
    : [];

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => navigation.navigate("GroupScreen", { groupId: item.id, groups : groups, setGroups: setGroups })}
    >
      <View style={styles.groupInfo}>
        <Icon name="users" size={24} color="#4EA72E" style={styles.groupIcon} />
        <View>
          <Text style={styles.groupName}>{item.name}</Text>
          <Text style={styles.groupDescription}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat Groups</Text>
      </View>

      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGroup}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No groups available.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("CreateGroupScreen")}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4EA72E",
    padding: 15,
    paddingTop: 40,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    padding: 10,
  },
  groupCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupIcon: {
    marginRight: 15,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  groupDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 80, // Adjust to fit Footer
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4EA72E",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ChatScreen;
