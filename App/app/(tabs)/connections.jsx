import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import { UserPlus, Search, X, ArrowLeft } from "react-native-feather";

export default function Connections() {
  const [connections, setConnections] = useState([
    { id: "1", name: "John Doe", title: "Software Engineer", avatar: "" },
    { id: "2", name: "Jane Smith", title: "Product Designer", avatar: "" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [newConnection, setNewConnection] = useState({ name: "", title: "" });

  const filteredConnections = connections.filter((conn) =>
    `${conn.name} ${conn.title}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const addConnection = () => {
    if (!newConnection.name || !newConnection.title) return;
    const newConn = {
      id: Date.now().toString(),
      ...newConnection,
      avatar: "",
    };
    setConnections([newConn, ...connections]);
    setNewConnection({ name: "", title: "" });
    setModalVisible(false);
  };

  const renderConnection = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={
          item.avatar
            ? { uri: item.avatar }
            : require("../../assets/avatar.jpg")
              }
        style={styles.avatar}
      />
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

{/* App bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back() || router.push("/homepage")}>
          <ArrowLeft stroke="#ffffff" width={28} height={28} />
        </TouchableOpacity>
          {/* <TouchableOpacity onPress={() =>console.log("/addmembers")}>
          <UserPlus stroke="#ffffff" width={28} height={28} />
          </TouchableOpacity> */}
      </View>
      <View style={styles.navSeparator} />


      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Connections</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <UserPlus stroke="white" width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search stroke="#6C63FF" width={20} height={20} />
        <TextInput
          placeholder="Search connections..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>

      {/* Connections List */}
      <FlatList
        data={filteredConnections}
        keyExtractor={(item) => item.id}
        renderItem={renderConnection}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Add Connection Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalClose}
            >
              <X stroke="#6C63FF" width={24} height={24} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Connection</Text>
            <TextInput
              placeholder="Full Name"
              value={newConnection.name}
              onChangeText={(text) =>
                setNewConnection({ ...newConnection, name: text })
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Profession / Title"
              value={newConnection.title}
              onChangeText={(text) =>
                setNewConnection({ ...newConnection, title: text })
              }
              style={styles.input}
            />
            <TouchableOpacity style={styles.addButton} onPress={addConnection}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: "#6C63FF",
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      navSeparator: {
        height: 1,
        backgroundColor: "#E0E0E0",
      },
  container: {
    flex: 1,
    backgroundColor: "#F5F5FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C63FF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#CCC",
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  title: {
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6C63FF",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalClose: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});
