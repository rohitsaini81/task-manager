import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('sessionId'); // Assuming you saved sessionId here

      if (!sessionId) {
        Alert.alert('Error', 'No sessionId found, please login again');
        router.push('/login'); // Redirect to login
        return;
      }

      const response = await fetch('http://127.0.0.1:3000/api/auth/verify', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        //   router.push("/login")
        throw new Error(data.message || 'Failed to fetch user data');
      }
      if(data.user.Verified_status){
        router.push("/homepage")
      }

      setUser(data.user);
      console.log(data)
    } catch (error) {
      console.error('Fetch user error:', error);
      Alert.alert('Error', error.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.username || 'User'}!</Text>
      <Text style={styles.info}>Mobile: {user?.phone}</Text>
      <Text style={styles.info}>Verified: {user?.Verified_status ? 'Yes' : 'No'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f6ff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: '#6200ee',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});
