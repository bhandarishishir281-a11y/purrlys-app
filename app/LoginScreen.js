import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
// Firebase auth instance shared across screens
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';

const LoginScreen = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity onPress={onSwitchToSignUp} style={styles.switchButton}>
        <Text style={styles.switchText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#f5f5f5'
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 30,
      color: '#333'
    },
    input: {
      width: '100%',
      height: 50,
      backgroundColor: 'white',
      paddingHorizontal: 15,
      borderRadius: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#ddd'
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: '#007bff',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginTop: 10
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold'
    },
    errorText: {
      color: 'red',
      marginTop: 15,
      textAlign: 'center'
    },
    switchButton: {
      marginTop: 20,
      padding: 10
    },
    switchText: {
      color: '#007bff',
      fontSize: 16
    }
});

export default LoginScreen;

