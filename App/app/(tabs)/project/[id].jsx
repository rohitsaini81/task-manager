import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Animated,
  Button,
  Platform,
} from "react-native";
import {
  ArrowLeft,
  Clock,
  MessageCircle,
  MoreVertical,
  Plus,
  UserPlus,
} from "react-native-feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import useStore from "../../store/Store";

export default function CommentSection() {

  const { id } = useLocalSearchParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", content: "" });
  const [isTaskModalVisible, setTaskModalVisible] = useState(false);
  const [menuTaskId, setMenuTaskId] = useState(null);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState({ user: "", text: "" });
  const [comments, setComments] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { server, count, increase, decrease, reset } = useStore();
  useEffect(() => {
    if (id) {
      getTasks(id);
    }
  }, [id]);

  const getTasks = async (projectId) => {
    try {
      const sessionId = await AsyncStorage.getItem("sessionId");
      const response = await fetch(`${server}task/${projectId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.content) return;
    const task = {
      ...newTask,
      projectId: id,
      dueDate: date.toISOString(),
    };

    const sessionId = await AsyncStorage.getItem("sessionId");
    if (!sessionId) {
      alert("Please login to add a task");
      return router.push("/login");
    }
    const response = await fetch(server + "task/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      alert("Failed to add task");
      return;
    }

    const createdTask = await response.json();

    setTasks([...tasks, createdTask]);
    setNewTask({ title: "", content: "" });
    setTaskModalVisible(false);
  };

  const deleteTask = async (taskId) => {
    try {
      const sessionId = await AsyncStorage.getItem("sessionId");
      if (!sessionId) {
        alert("Please login to delete the task");
        return router.push("/login");
      }
      const response = await fetch(`${server}task/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify({ projectId: id }),
      });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter((task) => task._id !== taskId));
      alert("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setMenuTaskId("");
    }
  };

  const [currentTask, setCurrentTask] = useState({});

  const fetchComments = async (taskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) {
        console.error("Task not found");
        return;
      }
  
      setCurrentTask(task);
      setCommentModalVisible(true);
  
      const sessionId = await AsyncStorage.getItem("sessionId");
      const response = await fetch(`${server}comment/all/${taskId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch comments");
  
      const data = await response.json();
      // setComments(data);
      setComments([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert("Failed to fetch comments");
    }
  };
  

  const addComment = async () => {
    try {
      if (!newComment || !currentTask) return;
  
      const comment = {
        projectId: id,
        content: newComment,
        taskId: currentTask._id,
      };
  
      const sessionId = await AsyncStorage.getItem("sessionId");
      if (!sessionId) {
        alert("Please login to add a comment");
        return router.push("/login");
      }
  
      const response = await fetch(server + "comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        body: JSON.stringify(comment),
      });
  
      if (!response.ok) throw new Error("Failed to add comment");
  
      const createdComment = await response.json();
      console.log("Comment added:", createdComment.response);
  
      if (createdComment && createdComment.response._id) {
        await fetchComments(currentTask._id); // No need to setComments([]) beforehand
        setNewComment(""); // Reset input
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment");
    }
  };
  


  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const toggleTaskMenu = (taskId) => {
    setMenuTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  return (
    <View style={styles.container}>
      {/* App bar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/homepage")}>
          <ArrowLeft stroke="#ffffff" width={28} height={28} />
        </TouchableOpacity>
          <TouchableOpacity onPress={() =>router.push("/connections")}>
          <UserPlus stroke="#ffffff" width={28} height={28} />
          </TouchableOpacity>
      </View>
      <View style={styles.navSeparator} />

      {/* Project Header */}
      <View style={styles.projectHeader}>
        <Text style={styles.projectTitle}>
          {/* {project ? `Project: ${project.projectName}` : "Loading..."} */}
          {project ? `Project: ${project.projectName}` : count}

        </Text>
        {project && (
          <Text style={styles.projectDescription}>
            {project.projectDescription}
          </Text>
        )}
      </View>

      {/* Task List */}
      <ScrollView contentContainerStyle={styles.commentList}>
        {tasks.map((task) => (
          <View key={task._id || task.id} style={styles.commentCard}>
            <Text style={styles.commentUser}>
              Task ID: {task._id || task.id}
            </Text>
            <Text style={styles.commentText}>{task.title || task.content}</Text>
            <Text style={styles.commentText}>
              Due Date: {task.dueDate || "Not set"}
            </Text>
            <View style={[styles.flex, styles.p40]}>
              <TouchableOpacity
                style={styles.items}
                onPress={() => alert("Like")}
              >
                <Text>👍 70%</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.items}
                onPress={() => alert("2 days left")}
              >
                <Clock stroke="orange" width={24} height={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => toggleTaskMenu(task._id)}
              >
                <MoreVertical stroke="#6C63FF" width={24} height={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.items}
                onPress={() => {
                  fetchComments(task._id)
                }}
              >
                <MessageCircle stroke="gray" width={24} height={24} />
              </TouchableOpacity>
            </View>
            {menuTaskId === task._id && (
              <View style={styles.projectMenu}>
                <TouchableOpacity onPress={() => alert("Edit not implemented")}>
                  <Text style={styles.menuOption}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(task._id)}>
                  <Text style={styles.menuOption}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setTaskModalVisible(true)}
      >
        <Plus stroke="white" width={28} height={28} />
      </TouchableOpacity>

      {/* Task Modal */}
      <Modal visible={isTaskModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add / Assign New Task</Text>
            <TextInput
              placeholder="Task Name"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Task Description"
              value={newTask.content}
              onChangeText={(text) => setNewTask({ ...newTask, content: text })}
              style={styles.input}
              multiline
            />
            {/* <Button title="Pick Due Date" onPress={() => setShowDatePicker(true)} /> */}
            <Text>Due Date: {date.toDateString()}</Text>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Text style={styles.addButtonText}>Add New Task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTaskModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Comment Modal */}
      <Modal visible={isCommentModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Comment 💡</Text>
            {/* <TextInput
              placeholder="Your Name"
              value={newComment.user}
              onChangeText={(text) =>
                setNewComment({ ...newComment, user: text })
              }
              style={styles.input}
            /> */}
            <TextInput
              placeholder="Share Your Idea"
              value={newComment}
              onChangeText={(text) =>
                setNewComment(text)
              }
              style={styles.input}
            />
            <TouchableOpacity style={styles.addButton} onPress={addComment}>
              <Text style={styles.addButtonText}>Add Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCommentModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
            <ScrollView>
              {comments.map((comment) => (
                <View key={comment._id} style={styles.commentCard}>
                  <Text style={styles.commentUser}>{comment.createdBy}</Text>
                  <Text style={styles.commentText}>{comment.content}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Reuse your styles as-is

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
    top: 40,
    right: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    padding: 8,
    zIndex: 10, // Ensure it's above other elements
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
