import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';

const meetings = [
  {
    id: '1',
    date: 'Nov 29, 2025',
    summary: 'Quarterly planning discussion with team leads',
    speakers: 4,
  },
  {
    id: '2',
    date: 'Nov 27, 2025',
    summary: 'Product roadmap review and sprint planning',
    speakers: 3,
  },
  {
    id: '3',
    date: 'Nov 25, 2025',
    summary: 'Client feedback session and next steps',
    speakers: 2,
  },
];

const HomeScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.meetingItem}>
      <View style={styles.meetingHeader}>
        <Feather name="clock" size={16} color="#888" />
        <Text style={styles.date}>{item.date}</Text>
        <Feather name="users" size={16} color="#888" />
        <Text style={styles.speakers}>{item.speakers}</Text>
      </View>
      <Text style={styles.summary}>{item.summary}</Text>
      <View style={styles.actions}>
        <TouchableOpacity>
          <Feather name="play-circle" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="share-2" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="copy" size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MoM Recorder</Text>
        <Link href="/settings" asChild>
          <TouchableOpacity>
            <Feather name="settings" size={24} color="black" />
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.recordingSection}>
        <Link href="/recording" asChild>
          <TouchableOpacity style={styles.recordButton}>
            <Feather name="mic" size={40} color="white" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.recordButtonText}>Start Recording</Text>
      </View>
      <Text style={styles.recentMeetingsTitle}>Recent Meetings</Text>
      <FlatList
        data={meetings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  recordingSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recordButton: {
    backgroundColor: '#d9534f',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentMeetingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  meetingItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meetingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
    flex: 1,
  },
  speakers: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  summary: {
    fontSize: 16,
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
});

export default HomeScreen;