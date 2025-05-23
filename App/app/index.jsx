import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { isLoggedIn } from './(tabs)/login';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const isLoggedIn = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('sessionId');
      const user = await AsyncStorage.getItem('user');
      if (sessionId && user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser.Verified_status) {
          router.push('/homepage'); // Redirect to homepage if user is verified
        } else {
          router.push('/home'); // Redirect to home if user is not verified
        }
      } 
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };
  // Animate on load
  useEffect(() => {

isLoggedIn();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>      
      <Text style={styles.title}>Welcome to Task Manager 👋</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Enter Project ID"
        style={styles.input}
        value={projectId}
        onChangeText={setProjectId}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4caf50' }]}
        onPress={() => router.push('/project')}
      >
        <Text style={styles.buttonText}>Enter Project</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    color: '#4A3AFF',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    width: '80%',
    marginVertical: 15,
    borderRadius: 10,
  },
});
