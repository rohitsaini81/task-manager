import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function VerifyOTP() {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState('');

  const verifyOtp = async () => {
    try {
      if (!otp) {
        Alert.alert('Error', 'Please enter the OTP');
        return;
      }

      const response = await fetch('http://localhost:3000/api/auth/verify/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Phone verified successfully!');
      } else {
        Alert.alert('Error', data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const resendOtp = async () => {
    try {
      const mobile = `+91${phone}`

      const response = await fetch(`http://localhost:3000/api/auth/resend/otp?phone=${mobile}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'OTP resent successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed-outline" size={80} color="#4B9CD3" />
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="6-digit OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />
      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendButton} onPress={resendOtp}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f1f8e9', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginVertical: 20 
  },
  input: { 
    width: '100%', 
    height: 50, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    fontSize: 18, 
    marginBottom: 20 
  },
  button: { 
    backgroundColor: '#7CB342', 
    padding: 15, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center',
    marginBottom: 10
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  resendButton: {
    marginTop: 10,
    padding: 10,
  },
  resendText: {
    color: '#4B9CD3',
    fontSize: 16,
    textDecorationLine: 'underline'
  }
});
