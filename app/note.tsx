import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { NativeModules } from 'react-native';

const { Whisper } = NativeModules;

const NoteScreen = () => {
  const { audioUri } = useLocalSearchParams<{ audioUri: string }>();
  const player = useAudioPlayer({ uri: audioUri || '' });
  const status = useAudioPlayerStatus(player);
  const [transcription, setTranscription] = useState('Transcription will appear here...');
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    if (audioUri) {
      handleTranscribeAudio(audioUri);
    }
  }, [audioUri]);

  const handleTranscribeAudio = async (uri: string) => {
    setIsTranscribing(true);
    try {
      const result = await Whisper.transcribeAudio(uri);
      setTranscription(result);
    } catch (e: any) {
      console.error("Transcription error:", e);
      Alert.alert("Transcription Error", e.message || "Failed to transcribe audio.");
      setTranscription("Failed to transcribe audio.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!player) {
      return;
    }

    if (status.playing) {
      await player.pause();
    } else {
      if (status.currentTime === status.duration) {
        await player.seekTo(0);
      }
      await player.play();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Link href="/home" asChild>
          <TouchableOpacity>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>Meeting Note</Text>
      </View>

      <View style={styles.audioPlayerSection}>
        <Text style={styles.sectionTitle}>Recorded Audio</Text>
        <Text style={styles.audioUriText}>{audioUri ? `File: ${audioUri.split('/').pop()}` : 'No audio recorded.'}</Text>
        <TouchableOpacity style={styles.actionButton} onPress={handlePlayAudio} disabled={!audioUri}>
          <Feather name={status.playing ? 'pause' : 'play'} size={20} color="white" />
          <Text style={styles.actionButtonText}>{status.playing ? 'Pause Playback' : 'Play Recording'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transcription</Text>
        {isTranscribing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4A4E9D" />
            <Text style={styles.loadingText}>Transcribing audio...</Text>
          </View>
        ) : (
          <Text style={styles.sectionContent}>{transcription}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.sectionContent}>
          (Summary will be generated here after transcription and NLP processing.)
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Action Items</Text>
        <Text style={styles.sectionContent}>
          (Action items will be extracted here after transcription and NLP processing.)
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
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
  audioPlayerSection: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audioUriText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#4A4E9D',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default NoteScreen;