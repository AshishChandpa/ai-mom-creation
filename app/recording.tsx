
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';

const RecordingScreen = () => {
  const router = useRouter();

  const handleStopRecording = () => {
    router.push('/note');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/home" asChild>
          <TouchableOpacity>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>Recording</Text>
      </View>
      <View style={styles.waveformContainer}>
        {/* Placeholder for waveform animation */}
        <View style={styles.waveform} />
      </View>
      <TouchableOpacity style={styles.stopButton} onPress={handleStopRecording}>
        <Feather name="stop-circle" size={60} color="#d9534f" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  waveformContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveform: {
    width: '100%',
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  stopButton: {
    alignSelf: 'center',
  },
});

export default RecordingScreen;
