import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { auth } from '../firebaseConfig'; // Import auth from your config

// A simple web-compatible component for user login
const LoginScreen = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError(''); // Reset error
    if (!email || !password) {
        setError("Please enter an email and password.");
        return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in App.js will handle navigation
    } catch (err) {
      setError(err.message); // Show an error if login fails
    }
  };
  
  const styles = {
    container: { padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '80%', maxWidth: 300, padding: 10, marginBottom: 10, border: '1px solid #ccc', borderRadius: 5 },
    button: { width: '80%', maxWidth: 300, padding: 15, backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 16 },
    errorText: { color: 'red', marginTop: 10 },
    switchText: { color: 'blue', cursor: 'pointer', marginTop: 15, textDecoration: 'underline' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome Back to Purrlys</h2>
      <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button style={styles.button} onClick={handleLogin}>Log In</button>
      {error && <p style={styles.errorText}>{error}</p>}
      <p style={styles.switchText} onClick={onSwitchToSignUp}>
        Don't have an account? Sign Up
      </p>
    </div>
  );
};

export default LoginScreen;
