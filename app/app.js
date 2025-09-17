import { useEffect, useState } from 'react';
// --- Firebase setup ---
// NOTE: We are including the setup directly in this file to avoid import issues.
// In a real project, this would be in its own firebaseConfig.js file.
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

// TODO: PASTE YOUR FIREBASE CONFIGURATION OBJECT HERE
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "purrlysapp.firebaseapp.com",
  projectId: "purrlysapp",
  // ... rest of your config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// --- End of Firebase setup ---


// --- Authentication Screen Components ---
const SignUpScreen = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={authStyles.container}>
      <h2 style={authStyles.title}>Create a Purrlys Account</h2>
      <input style={authStyles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input style={authStyles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button style={{...authStyles.button, backgroundColor: '#ff6347'}} onClick={handleSignUp}>Sign Up</button>
      {error && <p style={authStyles.errorText}>{error}</p>}
      <p style={authStyles.switchText} onClick={onSwitchToLogin}>Already have an account? Log In</p>
    </div>
  );
};

const LoginScreen = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={authStyles.container}>
      <h2 style={authStyles.title}>Welcome Back to Purrlys</h2>
      <input style={authStyles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input style={authStyles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button style={{...authStyles.button, backgroundColor: '#007bff'}} onClick={handleLogin}>Log In</button>
      {error && <p style={authStyles.errorText}>{error}</p>}
      <p style={authStyles.switchText} onClick={onSwitchToSignUp}>Don't have an account? Sign Up</p>
    </div>
  );
};


// --- Main Application Component (The Dashboard) ---
// This is the app users see after they log in.
const PurrlysApp = ({ user }) => {
    const [currentPage, setCurrentPage] = useState('Home');
    const handleSignOut = () => signOut(auth);

    // In a real app, this data would come from Firestore
    const MOCK_DATA = {
        pets: [{ id: '1', name: 'Whiskers', profilePic: 'https://placekitten.com/100/100' }]
    };

    return (
        <div style={appStyles.container}>
            <div style={appStyles.header}>
                <p style={appStyles.headerText}>Purrlys</p>
                <div>
                    <span style={{ marginRight: 20 }}>👤 {user.email}</span>
                    <button onClick={handleSignOut} style={appStyles.signOutButton}>Sign Out</button>
                </div>
            </div>
            <div style={appStyles.contentArea}>
                {/* This is a placeholder for the main content */}
                <h2>Welcome to the App!</h2>
                <p>Current Page: {currentPage}</p>
            </div>
            <div style={appStyles.navBar}>
                {['Home', 'Logbook', 'Learn', 'Pets', 'VIP Hub'].map(name => (
                    <button key={name} style={appStyles.navItem} onClick={() => setCurrentPage(name)}>
                        <span style={{ fontSize: 24 }}>{name === 'Home' ? '🏠' : '📄'}</span>
                        <span style={{...appStyles.navText, ...(currentPage === name ? appStyles.navTextSelected : {})}}>{name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};


// --- App Entry Point ---
// This component decides whether to show the login/signup screens or the main app.
export default function App() {
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState('login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}><h2>Loading...</h2></div>;
  }

  if (!user) {
    return authPage === 'login' ? 
      <LoginScreen onSwitchToSignUp={() => setAuthPage('signup')} /> : 
      <SignUpScreen onSwitchToLogin={() => setAuthPage('login')} />;
  }

  return <PurrlysApp user={user} />;
}


// --- STYLES ---
const authStyles = {
    container: { padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', fontFamily: 'sans-serif' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '80%', maxWidth: 300, padding: 10, marginBottom: 10, border: '1px solid #ccc', borderRadius: 5 },
    button: { width: '80%', maxWidth: 300, padding: 15, color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 16 },
    errorText: { color: 'red', marginTop: 10 },
    switchText: { color: 'blue', cursor: 'pointer', marginTop: 15, textDecoration: 'underline' }
};

const appStyles = {
    container: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8f8f8', fontFamily: 'sans-serif' },
    header: { padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderBottom: '1px solid #eee' },
    headerText: { fontSize: 24, fontWeight: 'bold' },
    signOutButton: { padding: '8px 12px', border: '1px solid #ff6347', color: '#ff6347', backgroundColor: 'white', borderRadius: 5, cursor: 'pointer' },
    contentArea: { flex: 1, padding: 20 },
    navBar: { display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: '1px solid #e0e0e0', backgroundColor: 'white' },
    navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' },
    navText: { fontSize: 10, color: '#888' },
    navTextSelected: { color: '#ff6347' },
};

