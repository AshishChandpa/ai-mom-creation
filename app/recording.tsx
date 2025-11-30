import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  AudioModule,
  setAudioModeAsync,
} from 'expo-audio';

const RecordingScreen = () => {
  const router = useRouter();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [recordTime, setRecordTime] = useState('00:00:00');

  useEffect(() => {
    (async () => {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission to access microphone was denied');
      }
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  useEffect(() => {
    if (recorderState.isRecording) {
      setRecordTime(formatTime(recorderState.durationMillis));
    }
  }, [recorderState.isRecording, recorderState.durationMillis]);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      if (audioRecorder.uri) {
        router.push({ pathname: '/note', params: { audioUri: audioRecorder.uri } });
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/home" asChild>
          <TouchableOpacity>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>{recorderState.isRecording ? 'Recording...' : 'Recording'}</Text>
      </View>
      <View style={styles.waveformContainer}>
        <Text style={styles.recordTime}>{recordTime}</Text>
        {/* Placeholder for waveform animation */}
        <View style={styles.waveform} />
      </View>
      <TouchableOpacity
        style={styles.stopButton}
        onPress={recorderState.isRecording ? stopRecording : startRecording}
      >
        <Feather name={recorderState.isRecording ? 'stop-circle' : 'mic'} size={60} color={recorderState.isRecording ? '#d9534f' : '#4A4E9D'} />
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
    marginBottom: 20,
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
  recordTime: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
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
