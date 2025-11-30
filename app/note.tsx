import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

const NoteScreen = () => {
  const { audioUri } = useLocalSearchParams<{ audioUri: string }>();
  const player = useAudioPlayer({ uri: audioUri || '' }); // Provide a default empty string if audioUri is undefined
  const status = useAudioPlayerStatus(player);

  const handlePlayAudio = async () => {
    if (!player) {
      return;
    }

    if (status.playing) {
      await player.pause();
    } else {
      // If audio finished, seek to start before playing again
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
        <Text style={styles.title}>Product Roadmap Review</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handlePlayAudio}>
          <Feather name={status.playing ? 'pause' : 'play'} size={20} color="white" />
          <Text style={styles.actionButtonText}>{status.playing ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="share-2" size={20} color="white" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Feather name="edit" size={20} color="white" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.sectionContent}>
          The team reviewed the product roadmap for the next quarter and discussed the sprint planning. Key decisions were made regarding the priority of features and the allocation of resources.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transcription</Text>
        <Text style={styles.sectionContent}>
          (Placeholder for the full transcription of the meeting...)
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Action Items</Text>
        <Text style={styles.sectionContent}>
          - John to create the design mockups for the new feature.
          - Jane to finalize the technical specification.
          - Team to review the sprint plan by the end of the week.
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#4A4E9D',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 10,
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
  },
});

export default NoteScreen;
