import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSendOtp = async () => {
    if (!username || !mobile || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const phone = `+91${mobile}`
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, phone, password}),
      });

      const data = await response.json();

      
      if (response.ok) {
        Alert.alert('Success', 'OTP Sent Successfully!');
        router.push({
          pathname: '/VerifyOTP',
          params: { username, phone, password }, // Send these as query params to VerifyOTP
        });
      } else {
        Alert.alert('OTP Send Failed', data?.message || 'Please try again');
      }
    } catch (error) {
      Alert.alert(error.message || 'Something went wrong');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person" size={24} color="#6200ee" style={styles.icon} />
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="call" size={24} color="#6200ee" style={styles.icon} />
        <TextInput
          placeholder="Mobile Number"
          style={styles.input}
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
          maxLength={10} // or 12 based on your country
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={24} color="#6200ee" style={styles.icon} />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f6ff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#6200ee',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#6200ee',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6200ee',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
