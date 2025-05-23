import { router } from "expo-router";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Animated,
} from "react-native";
import { Plus, Menu, X, MoreVertical } from "react-native-feather";
import { TouchableWithoutFeedback } from "react-native";
const projects = [
  {
    id: 1,
    title: "Project Alpha",
    description: "Description for Project Alpha",
  },
  { id: 2, title: "Project Beta", description: "Description for Project Beta" },
  {
    id: 3,
    title: "Project Gamma",
    description: "Description for Project Gamma",
  },
];

export default function Homepage() {
  const getProjects = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('sessionId');
      const response = await fetch('http://127.0.0.1:3000/api/project/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.projects)
        data.projects.map((project) => {
          const pro ={
            "id": project._id,
            "title": project.projectName,
            "description": project.projectDescription? project.projectDescription: "No description available",
          }
   setProjectList((prev) => [...prev, pro])
  console.log(project)
        })
      } else {
        console.error('Error fetching projects:', data.message);
      }
       
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [projectList, setProjectList] = useState(projects);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0];


  const [activeProject, setActiveProject] = useState(null);
  const [menuProjectId, setMenuProjectId] = useState(null);

  const toggleProjectMenu = (projectId) => {
    setMenuProjectId(menuProjectId === projectId ? null : projectId);
};
  const deleteProject = (projectId) => {
    setProjectList(projectList.filter((project) => project.id !== projectId));
    setMenuProjectId(null);
};


  const addProject = () => {
    if (newProject.title && newProject.description) {
      setProjectList([
        ...projectList,
        { ...newProject, id: projectList.length + 1 },
      ]);
      setNewProject({ title: "", description: "" });
      setModalVisible(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
    Animated.timing(slideAnim, {
      toValue: isMenuOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    if (isMenuOpen) toggleMenu();
  };

  const Logout = () => {
    // Handle logout logic here
    console.log("Logout");
    closeMenu();

  }

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const sessionId = await AsyncStorage.getItem('sessionId');
        if (!sessionId) {
          router.push('/login');
        } else {
          getProjects();
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }
  , []);
  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.container}>
        {/* Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={toggleMenu}>
            <Menu stroke="#ffffff" width={28} height={28} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.navSeparator} />

        {/* Sliding Menu */}
        <Animated.View
          style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
        >
          <TouchableOpacity onPress={toggleMenu} style={styles.closeMenuButton}>
            <X stroke="white" width={28} height={28} />
          </TouchableOpacity>
          <Text style={styles.menuItem}>Settings</Text>
          <Text style={styles.menuItem}>Profile</Text>
          <Text onPress={Logout} style={styles.menuItem}>Logout</Text>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Projects</Text>

        {/* Projects List */}
        <ScrollView contentContainerStyle={styles.projectList}>
                    {projectList.map((project) => (
                        <View key={project.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                              <TouchableOpacity onPress={()=>router.push(`/project/${project.id}`)}>  <Text style={styles.cardTitle}>{project.title}</Text></TouchableOpacity>
                                

                                <TouchableOpacity style={styles.moreButton} onPress={() => toggleProjectMenu(project.id)}>
                                    <MoreVertical stroke='#6C63FF' width={24} height={24} />
                                </TouchableOpacity>
                                {menuProjectId === project.id && (
                                    <View style={styles.projectMenu}>
                                        <TouchableOpacity onPress={() => alert('Rename not implemented yet')}><Text style={styles.menuOption}>Edit</Text></TouchableOpacity>
                                        <TouchableOpacity onPress={() => deleteProject(project.id)}><Text style={styles.menuOption}>Delete</Text></TouchableOpacity>
                                    </View>
                                )}

                            </View>
                            <Text style={styles.cardDescription}>{project.description}</Text>

                        </View>
                    ))}
                </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <Plus stroke="white" width={28} height={28} />
        </TouchableOpacity>

        {/* Modal for Adding Project */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
             <Text style={styles.modalTitle}>Add New Project</Text>


<TextInput
                placeholder="Project Title"
                value={newProject.title}
                onChangeText={(text) =>
                  setNewProject({ ...newProject, title: text })
                }
                style={styles.input}
              />

<TextInput
                placeholder="Project Description"
                value={newProject.description}
                onChangeText={(text) =>
                  setNewProject({ ...newProject, description: text })
                }
                style={styles.input}
                multiline
              />
              <TouchableOpacity style={styles.addButton} onPress={addProject}>
                <Text style={styles.addButtonText}>Add Project</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
<Text style={styles.closeButtonText}>Cancel</Text>

              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    position: "relative",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  navSeparator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },

  sideMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: "100%",
    backgroundColor: "#6C63FF",
    paddingTop: 60,
    paddingLeft: 20,
    zIndex: 10,
  },
  menuItem: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
},
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6C63FF",
    marginBottom: 16,
  },
  projectList: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#F4F2FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
},
cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
},
cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C63FF',
},
moreButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#ECEBFF',
},
cardDescription: {
    fontSize: 16,
    color: '#666',
}
,
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
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



  cardWrapper: {
    position: 'relative',
    zIndex: 2,
},
projectMenu: {
    position: 'absolute',
    top: -8,
    right: 30,
    backgroundColor: '#ECEBFF',
    borderRadius: 8,
    padding: 8,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
},
menuOption: {
    paddingHorizontal: 16,
    color: '#6C63FF',
    fontSize: 16,
}
});
