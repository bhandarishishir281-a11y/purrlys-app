import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HealthTrackingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Tracking</Text>
      <Text style={styles.subtitle}>Track daily care routines and wellness stats.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f5f5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
  },
});
