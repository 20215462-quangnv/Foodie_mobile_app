import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const ChatroomScreen = ({ route }) => {
  const { chatroomName, membersCount } = route.params;

  const [messages, setMessages] = useState([
    { id: "1", text: "Welcome to the chatroom!", sender: "System" },
    { id: "2", text: "Hi everyone!", sender: "John" },
    { id: "3", text: "Hello!", sender: "Doe" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = useCallback(() => {
    if (newMessage.trim() !== "") {
      setMessages((prevMessages) => [
        { id: Date.now().toString(), text: newMessage, sender: "You" },
        ...prevMessages,
      ]);
      setNewMessage("");
    }
  }, [newMessage]);

  const loadMoreMessages = useCallback(() => {
    // Simulate older messages being loaded
    const moreMessages = Array.from({ length: 5 }, (_, i) => ({
      id: `old-${i}`,
      text: `Older message ${i + 1}`,
      sender: `User ${i + 1}`,
    }));
    setMessages((prevMessages) => [...prevMessages, ...moreMessages]);
  }, []);

  const renderMessage = ({ item }) => (
    <View style={item.sender === "You" ? styles.userMessage : styles.message}>
      <Text style={styles.sender}>{item.sender}:</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.chatroomName}>{chatroomName}</Text>
          <Text style={styles.membersCount}>{membersCount} members</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messageList}
        inverted
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.1}
      />

      {/* Chat Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Icon name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    padding: 10,
    backgroundColor: "#4EA72E",
    flexDirection: "row",
    alignItems: "center",
  },
  chatroomName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  membersCount: {
    fontSize: 14,
    color: "white",
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  message: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    alignSelf: "flex-start",
    maxWidth: "70%",
  },
  userMessage: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#4EA72E",
    borderRadius: 10,
    alignSelf: "flex-end",
    maxWidth: "70%",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  textInput: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#4EA72E",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatroomScreen;
