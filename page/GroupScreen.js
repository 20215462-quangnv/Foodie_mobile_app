import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useContext,
} from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from "react-native";
import {
  getGroupById,
  addMemberToGroup,
  deleteGroup,
  updateGroup,
  getGroupMembers,
  removeMemberFromGroup,
} from "../controller/GroupController";
import { getRecipeById } from "../controller/RecipeController";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { FoodContext } from "../controller/FoodProviderContext";
const brightColors = [
  "#4EA72E",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96C93D",
  "#FFA41B",
  "#845EC2",
  "#FF9671",
  "#00C9A7",
  "#008F7A",
];

const getRandomBrightColor = (userId) => {
  const index = userId
    ? userId
        .toString()
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : 0;
  return brightColors[index % brightColors.length];
};

const UpdateGroupModalContent = memo(
  ({ visible, onClose, onUpdate, initialName, initialDescription }) => {
    const [localName, setLocalName] = useState(initialName);
    const [localDesc, setLocalDesc] = useState(initialDescription);

    // Reset local state when modal opens with new values
    useEffect(() => {
      if (visible) {
        setLocalName(initialName);
        setLocalDesc(initialDescription);
      }
    }, [visible, initialName, initialDescription]);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Update Group</Text>
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              value={localName}
              onChangeText={setLocalName}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={localDesc}
              onChangeText={setLocalDesc}
              multiline
            />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => onUpdate(localName, localDesc)}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
);

const GroupScreen = ({ route }) => {
  const { groupId } = route.params; // Get groupId from route params
  const [group, setGroup] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const { listFood, loadingg } = useContext(FoodContext);

  const loadGroupData = async () => {
    setLoading(true);
    try {
      const response = await getGroupById(groupId);
      setGroup(response.data);

      const allRecipes = await getRecipeById(groupId);
      // Sort recipes by date, newest first
      const sortedRecipes = allRecipes.data.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      setRecipes(sortedRecipes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroupData();
      loadMembers();
    }, [groupId])
  );

  const loadMembers = async () => {
    try {
      const response = await getGroupMembers(groupId);
      setMembers(response.data);
    } catch (error) {
      console.error("Error loading members:", error);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      Alert.alert("Error", "Please enter member's email");
      return;
    }
    try {
      await addMemberToGroup(groupId, newMemberEmail.trim());
      setNewMemberEmail("");
      loadMembers(); // Refresh member list
      Alert.alert("Success", "Member added successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to add member");
    }
  };

  const handleUpdateSubmit = useCallback(
    async (name, description) => {
      console.log("=== Update Group Submit Debug Logs ===");
      console.log("1. Input values:", { name, description });

      if (!name.trim()) {
        console.log("2. Validation failed: Empty name");
        Alert.alert("Error", "Group name cannot be empty");
        return;
      }

      try {
        console.log("3. Preparing update data:", {
          id: groupId,
          name: name.trim(),
          description: description.trim(),
        });

        await updateGroup({
          id: groupId,
          name: name.trim(),
          description: description.trim(),
        });

        console.log("4. Update successful");
        setShowUpdateModal(false);

        console.log("5. Fetching updated group data");
        const response = await getGroupById(groupId);
        console.log("6. New group data:", response.data);

        setGroup(response.data);
        Alert.alert("Success", "Group updated successfully");
      } catch (error) {
        console.error("7. Update failed:", error);
        console.error("8. Error details:", {
          message: error.message,
          stack: error.stack,
        });
        Alert.alert("Error", "Failed to update group");
      }
    },
    [groupId]
  );

  const handleDeleteMember = async (memberId) => {
    try {
      await removeMemberFromGroup(groupId, memberId);
      loadMembers(); // Refresh member list
      Alert.alert("Success", "Member removed successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to remove member");
    }
  };

  const handleDeleteGroup = async () => {
    Alert.alert("Delete Group", "Are you sure? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteGroup(groupId);
            Alert.alert("Success", "Group deleted successfully", [
              {
                text: "OK",
                onPress: () => {
                  // Pass back a result to indicate successful deletion
                  navigation.navigate("Chat", { refresh: true });
                },
              },
            ]);
          } catch (error) {
            console.error("Failed to delete group:", error);
            Alert.alert("Error", "Failed to delete group");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const createdAt = new Date(item.createdAt);
    const formattedDate = createdAt.toLocaleString("en-US", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const avatarColor = getRandomBrightColor(item.author?.id);

    return (
      <View style={styles.bubbleContainer}>
        <Text style={styles.authorFullName}>{item.author?.fullName}</Text>
        <View style={styles.contentContainer}>
          <View
            style={[styles.avatarContainer, { backgroundColor: avatarColor }]}
          >
            <Text style={styles.avatarText}>
              {item.author?.fullName?.split(" ")[0]?.[0]?.toUpperCase()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bubble}
            onPress={() =>
              navigation.navigate("EditRecipe", {
                editedItem: item,
                listFood: listFood,
              })
            }
          >
            <Text style={styles.recipeTitle}>Recipe</Text>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text style={styles.recipeDescription}>{item.description}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.timestamp}>{formattedDate}</Text>
      </View>
    );
  };

  const MembersModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showMembersModal}
      onRequestClose={() => setShowMembersModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Group Members</Text>
          <FlatList
            data={members}
            renderItem={({ item }) => (
              <View style={styles.memberItem}>
                <Text style={styles.memberName}>{item.fullName}</Text>
                <TouchableOpacity
                  onPress={() => handleDeleteMember(item.id)}
                  style={styles.deleteButton}
                >
                  <Icon name="trash" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowMembersModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const UpdateGroupModal = useCallback(
    () => (
      <UpdateGroupModalContent
        visible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleUpdateSubmit}
        initialName={group?.name || ""}
        initialDescription={group?.description || ""}
      />
    ),
    [showUpdateModal, group, handleUpdateSubmit]
  );

  const AddMemberModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAddMemberModal}
      onRequestClose={() => setShowAddMemberModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Member</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter member's email"
            onChangeText={(text) => setNewMemberEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => {
              handleAddMember();
              setShowAddMemberModal(false);
            }}
          >
            <Text style={styles.buttonText}>Add Member</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowAddMemberModal(false)}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const GroupManagementModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setModalVisible(false);
              setShowAddMemberModal(true);
            }}
          >
            <Icon name="user-plus" size={20} color="#4EA72E" />
            <Text style={styles.modalOptionText}>Add Member</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              setModalVisible(false);
              setShowMembersModal(true);
            }}
          >
            <Icon name="users" size={20} color="#4EA72E" />
            <Text style={styles.modalOptionText}>View Members</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => {
              console.log("Opening update modal with initial values:", {
                name: group?.name,
                desc: group?.description,
              });

              // Set values and close management modal first
              setModalVisible(false);

              // Then set the form values and show update modal
              requestAnimationFrame(() => {
                setUpdatedName(group?.name || "");
                setUpdatedDescription(group?.description || "");
                setShowUpdateModal(true);
              });
            }}
          >
            <Icon name="edit" size={20} color="#4EA72E" />
            <Text style={styles.modalOptionText}>Update Group</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, styles.deleteOption]}
            onPress={() => {
              setModalVisible(false);
              handleDeleteGroup();
            }}
          >
            <Icon name="trash" size={20} color="#FF6B6B" />
            <Text style={[styles.modalOptionText, { color: "#FF6B6B" }]}>
              Delete Group
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {group && (
        <View style={styles.groupHeader}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupDescription}>{group.description}</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() =>
                  navigation.navigate("GroupManagement", { groupId: groupId })
                }
              >
                <Icon name="cog" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setModalVisible(true)}
              >
                <Icon name="ellipsis-v" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListFooterComponent={loading && <ActivityIndicator />}
        inverted
      />
      <GroupManagementModal />
      <MembersModal />
      <UpdateGroupModal />
      <AddMemberModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  groupHeader: {
    backgroundColor: "#4EA72E",
    padding: 20,
    paddingTop: Platform.OS === "android" ? 40 : 60,
    marginBottom: 15,
  },
  groupName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  groupDescription: {
    color: "#fff",
    fontSize: 20,
    marginTop: 5,
    opacity: 0.9,
  },
  bubbleContainer: {
    flexDirection: "column",
    padding: 10,
    marginBottom: 15,
    alignItems: "flex-start",
  },
  authorFullName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#343a40",
    marginBottom: 10,
  },
  contentContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 40,
  },
  bubble: {
    backgroundColor: "#4EA72E15",
    padding: 10,
    borderRadius: 15,
    maxWidth: "80%",
    position: "relative",
    alignItems: "flex-start",
    borderLeftWidth: 3,
    borderLeftColor: "#4EA72E",
  },
  recipeTitle: {
    backgroundColor: "#4EA72E30",
    padding: 5,
    borderRadius: 8,
    marginBottom: 8,
    fontWeight: "bold",
    fontSize: 14,
    color: "#4EA72E",
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
  },
  recipeDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "#adb5bd",
    marginTop: 10,
    alignSelf: "center",
    width: "100%",
    textAlign: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingRight: 5,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 5,
  },
  headerButton: {
    padding: 8,
    marginHorizontal: 2,
  },
  managementButton: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
  },
  deleteButton: {
    padding: 5,
  },
  closeButton: {
    backgroundColor: "#4EA72E",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  updateButton: {
    backgroundColor: "#4EA72E",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GroupScreen;
