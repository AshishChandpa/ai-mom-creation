import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { momService } from '@/services/mom-service';
import { MomResponse } from '@/types/mom';

const NoteScreen = () => {
  const { audioUri } = useLocalSearchParams<{ audioUri: string }>();
  const player = useAudioPlayer({ uri: audioUri || '' });
  const status = useAudioPlayerStatus(player);
  const [mom, setMom] = useState<MomResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (audioUri) {
      handleProcessAudio(audioUri);
    }
  }, [audioUri]);

  const displayTranscript = (raw?: string) => {
    if (!raw) return 'Transcription will appear here once processing completes.';
    if (raw.startsWith('Stub transcript for meeting')) {
      return 'Backend is returning stub text. Connect Whisper/diarization/LLM to see the real transcript.';
    }
    return raw;
  };

  const handleProcessAudio = async (uri: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await momService.processAudio(uri);
      setMom(response);
    } catch (e: any) {
      console.error('Processing error:', e);
      const message = e?.message || 'Failed to process audio.';
      setError(message);
      Alert.alert('Processing Error', message);
    } finally {
      setIsProcessing(false);
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
        {isProcessing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#4A4E9D" />
            <Text style={styles.loadingText}>Uploading and processing audio...</Text>
          </View>
        ) : (
          <Text style={styles.sectionContent}>
            {error ? error : displayTranscript(mom?.raw_transcript)}
          </Text>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.retryButton]}
          onPress={() => audioUri && handleProcessAudio(audioUri)}
          disabled={!audioUri || isProcessing}
        >
          <Feather name="refresh-ccw" size={18} color="white" />
          <Text style={styles.actionButtonText}>
            {isProcessing ? 'Processing...' : 'Retry Processing'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.sectionContent}>
          {mom?.summary?.length
            ? mom.summary.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
            : '(Summary will be generated here after processing.)'}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Action Items</Text>
        <Text style={styles.sectionContent}>
          {mom?.action_items?.length
            ? mom.action_items.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
            : '(Action items will appear here after processing.)'}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Decisions</Text>
        <Text style={styles.sectionContent}>
          {mom?.decisions?.length
            ? mom.decisions.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
            : '(Decisions will appear here after processing.)'}
        </Text>
      </View>
      {mom?.speakers?.length ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Speakers</Text>
          {mom.speakers.map((segment, idx) => (
            <View key={`${segment.speaker}-${idx}`} style={styles.speakerRow}>
              <Text style={styles.speakerName}>{segment.speaker}</Text>
              <Text style={styles.speakerText}>{segment.text}</Text>
            </View>
          ))}
        </View>
      ) : null}
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
  retryButton: {
    marginTop: 10,
  },
  speakerRow: {
    marginBottom: 8,
  },
  speakerName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  speakerText: {
    color: '#333',
    lineHeight: 20,
  },
});

export default NoteScreen;
