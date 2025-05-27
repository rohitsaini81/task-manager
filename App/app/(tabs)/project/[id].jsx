import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  ArrowLeft,
  Clock,
  Loader,
  MessageCircle,
  MoreVertical,
  Plus,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  X,
} from "react-native-feather";

export default function CommentSection() {
  const url = "http://127.0.0.1:3000/api/project/find/682d87f8e4f848050c3386e5";
  const url_threads =
    "http://127.0.0.1:3000/api/thread/list/682d87f8e4f848050c3386e5";
  const { id } = useLocalSearchParams();
  const [project, setProject] = React.useState(null);
  const [Tasks, setTasks] = React.useState([]);

  const [comments, setComments] = useState([
    { id: 1, user: "User123", text: "This is a great idea!" },
    { id: 2, user: "JaneDoe", text: "I totally agree with you." },
  ]);
  const getProject = async () => {
    try {
      const sessionId = await AsyncStorage.getItem("sessionId");
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
      });
      let data = await response.json();
      if (response.ok) {
        setProject(data.project);
        //    TODO: Set temp Tasks here for visual

        response = await fetch(url_threads, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionId}`,
          },
        });

        data = await response.json();
        if (response.ok) {
          setTasks(data);
          console.log("tasks", data);
        } else {
          console.error("Error fetching data:", data.message);
        }
      } else {
        router.push("/login");
        // console.error("Error fetching data:", data.message);
      }
    } catch (error) {
      router.push("/login");
      console.error("Error checking login status:", error);
    }
  };

  React.useEffect(() => {
    getProject();
  }, [id]);

  const [menuProjectId, setMenuProjectId] = useState(null);

  const toggleProjectMenu = (projectId) => {
    setMenuProjectId(menuProjectId === projectId ? null : projectId);
  };
  const deleteProject = (projectId) => {
    // setProjectList(projectList.filter((project) => project.id !== projectId));
    // setMenuProjectId(null);
  };

  // Modal and Floating Action Button for Adding Projects

  const [isModalVisible, setModalVisible] = useState(false);
  const [newComment, setNewComment] = useState({ title: "", description: "" });

  const addComment = () => {
    if (newComment.title && newComment.description) {
      setComments([
        ...comments,
        { ...newComment, id: comments``.length + 1 },
      ]);
      setNewComment({ title: "", description: "" });
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/homepage")}>
          <ArrowLeft stroke="#ffffff" width={28} height={28} />
        </TouchableOpacity>
      </View>
      <View style={styles.navSeparator} />

      {/* Project Header */}
      {project ? (
        <View style={styles.projectHeader}>
          <Text style={styles.projectTitle}>
            Project : {project.projectName}
          </Text>
          <Text style={styles.projectDescription}>
            {project.projectDescription}
          </Text>
        </View>
      ) : (
        <View style={styles.projectHeader}>
          <Text style={styles.projectTitle}>Loading...</Text>
        </View>
      )}

      {/* Comments */}
      <ScrollView contentContainerStyle={styles.commentList}>
        {Tasks.map((task, index) => (
          <view key={task._id} style={styles.commentCard}>
            <Text style={styles.commentUser}>{task.id}</Text>
            <Text style={styles.commentText}>{task.content}</Text>
            <View key={task.id} style={styles.commentCard}>
              <Text style={styles.commentUser}>{task.userId}</Text>
              <Text style={styles.commentText}>{task.content}</Text>
              <Text style={styles.commentText}>
                Created at: {task.createdAt}
              </Text>
            </View>
            <View style={[styles.flex, styles.p40]}>
              <TouchableOpacity
                style={styles.items}
                onPress={() => alert("Like")}
              >
                <Text stroke="green" width={24} height={24}>
                  Progress 70%
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.items}
                onPress={() => alert("Time Left 2 days")}
              >
                <Clock stroke="orange" width={24} height={24} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => toggleProjectMenu(task._id)}
              >
                <MoreVertical stroke="#6C63FF" width={24} height={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.items}
                onPress={() => setModalVisible(true)}
              >
                <MessageCircle stroke="gray" width={24} height={24} />
              </TouchableOpacity>
            </View>
            {task._id === menuProjectId && (
              <View style={styles.projectMenu}>
                <TouchableOpacity
                  onPress={() => alert("Edit not implemented yet")}
                >
                  <Text style={styles.menuOption}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteProject(project.id)}>
                  <Text style={styles.menuOption}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </view>
        ))}
      </ScrollView>

      {/* Add Button + */}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Plus stroke="white" width={28} height={28} />
      </TouchableOpacity>

      {/* Modal for Adding comments */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={[styles.closeButton, styles.flex, styles.h50]}>
              <Text style={styles.modalTitle}>Add New Comment 💡</Text>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                {/* <X stroke="#6C63FF" width={44} height={44} /> */}
                <Text style={styles.closeButtonText2}>Close</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Add or Share Your Ideas !"
              value={newComment.comment}
              onChangeText={(text) =>
                setNewComment({ ...newComment, comment: text })
              }
              style={styles.input}
            />

            <View style={[styles.addComment, styles.flex, styles.h50]}>
              <TouchableOpacity style={styles.addButton} onPress={addComment}>
                <Text style={styles.addButtonText}>Add Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

                          {/* all comments listed */}
                          <View style={[styles.commentList, styles.w100]}>
                <ScrollView>
                  {comments.map((comment) => (
                    <View key={comment.id} style={styles.commentCard}>
                      <Text style={styles.commentUser}>{comment.user}</Text>
                      <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5FF",
  },
  p40: {
    paddingTop: 40,
  },
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
  projectHeader: {
    padding: 16,
    backgroundColor: "#EFEFFF",
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 16,
    color: "#666",
  },
  commentList: {
    padding: 16,
    paddingBottom: 80,
  },
  w100: {
    width: "100%",
  },
  commentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  commentUser: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#6C63FF",
  },
  commentText: {
    fontSize: 16,
    color: "#333",
  },
  addComment: {
    width: "100%",
  },
  h50: {
    maxHeight: 50,
  },

  flex: {
    flex: 1,
    flexDirection: "row", // Horizontal layout
    alignItems: "center", // Vertical alignment
  },
  items: {
    padding: 8,
  },
  moreButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 8,
  },
  projectMenu: {
    position: "absolute",
    top: 200,
    right: 70,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    padding: 8,
  },

  //  floating action button styles and modal styles

  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#6C63FF",
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  modalContainer: {
    width: "90%",
    height: "80vh",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6C63FF",
    marginBottom: 16,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f4f2ff",
    marginBottom: 16,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: "#6C63FF",
    fontSize: 16,
    
  },

  closeButtonText2: {
    color: "#6C63FF",
    fontSize: 16,
    top: -8,
    right: -10, 
    
  },
});
