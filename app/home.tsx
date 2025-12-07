import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { momService } from '@/services/mom-service';
import { MomRecord } from '@/types/mom';

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const HomeScreen = () => {
  const [meetings, setMeetings] = useState<MomRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await momService.fetchMomList();
      setMeetings(data);
    } catch (e: any) {
      console.error('Failed to fetch meetings', e);
      const message = e?.message || 'Failed to load meetings';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.meetingItem}>
      <View style={styles.meetingHeader}>
        <Feather name="clock" size={16} color="#888" />
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
        <Feather name="users" size={16} color="#888" />
        <Text style={styles.speakers}>{item.speakers?.length ?? 0}</Text>
      </View>
      <Text style={styles.summary}>{item.summary?.[0] || 'No summary available.'}</Text>
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
      {loading ? (
        <ActivityIndicator size="small" color="#4A4E9D" />
      ) : meetings.length === 0 ? (
        <Text style={styles.emptyText}>
          {error ? `Unable to load meetings: ${error}` : 'No meetings yet. Record your first meeting!'}
        </Text>
      ) : (
        <FlatList
          data={meetings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadMeetings}
        />
      )}
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
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default HomeScreen;
