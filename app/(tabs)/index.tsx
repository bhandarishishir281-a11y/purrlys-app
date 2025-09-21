import { signOut } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';

// Define a type for our pet objects for better code quality
interface Pet {
    id: string;
    name: string;
    profilePicUrl?: string; // profilePic is optional
}

const HomeScreen = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [pets, setPets] = useState<Pet[]>([]);

    // This useEffect hook runs when the component loads to fetch data from Firestore
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            setIsLoading(false);
            return;
        }

        // Create a query to get the 'pets' sub-collection for the current user
        const petsQuery = query(collection(db, 'users', currentUser.uid, 'pets'));

        // onSnapshot listens for real-time updates to the data
        const unsubscribe = onSnapshot(petsQuery, (snapshot) => {
            const userPets = snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                profilePicUrl: doc.data().profilePicUrl
            }));
            setPets(userPets);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching pets: ", error);
            setIsLoading(false);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    // Show a loading spinner while we fetch data
    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    // Render the main content
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {pets.length > 0 ? (
                    // If user has pets, show the list
                    <View style={styles.fullWidth}>
                        <Text style={styles.title}>Your Pets</Text>
                        <FlatList
                            data={pets}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={styles.petCard}>
                                    <Image source={{ uri: item.profilePicUrl || 'https://placekitten.com/100/100' }} style={styles.petImage} />
                                    <Text style={styles.petName}>{item.name}</Text>
                                </View>
                            )}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingVertical: 20 }}
                        />
                        {/* Placeholder for future content */}
                        <View style={styles.contentArea}>
                            <Text style={styles.subtitle}>Select a pet to see their health log.</Text>
                        </View>
                    </View>
                ) : (
                    // If user has no pets, show a welcome/setup message
                    <View style={styles.center}>
                        <Text style={styles.title}>Welcome to Purrlys!</Text>
                        <Text style={styles.subtitle}>Let's get started by adding your first pet.</Text>
                        <TouchableOpacity style={styles.addButton}>
                            <Text style={styles.buttonText}>Add a Pet</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5ff' },
    container: { flex: 1, alignItems: 'center', padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    fullWidth: { width: '100%' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center' },
    subtitle: { fontSize: 18, color: '#666', textAlign: 'center', marginVertical: 20 },
    petCard: { alignItems: 'center', marginRight: 15, padding: 10, backgroundColor: 'white', borderRadius: 10 },
    petImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
    petName: { fontSize: 16, fontWeight: '600' },
    contentArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    addButton: { backgroundColor: '#007bff', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10 },
    signOutButton: { position: 'absolute', bottom: 40, backgroundColor: '#dc3545', width: '90%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    signOutButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

export default HomeScreen;
