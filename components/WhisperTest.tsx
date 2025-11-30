import React, { useState } from 'react';
import { View, Text, Button, NativeModules, StyleSheet } from 'react-native';

const { Whisper } = NativeModules;

const WhisperTest = () => {
  const [transcription, setTranscription] = useState('No transcription yet.');
  const [loading, setLoading] = useState(false);

  const handleTranscribe = async () => {
    setLoading(true);
    setTranscription('Transcribing...');
    try {
      // For testing, we'll use a dummy audio path.
      // In a real scenario, this would come from the audio recording.
      const dummyAudioPath = "/data/user/0/com.anonymous.momcreationexpo/files/audio.m4a";
      const result = await Whisper.transcribeAudio(dummyAudioPath);
      setTranscription(result);
    } catch (e) {
      console.error(e);
      setTranscription(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Whisper Test Component</Text>
      <Button
        title={loading ? "Transcribing..." : "Transcribe Dummy Audio"}
        onPress={handleTranscribe}
        disabled={loading}
      />
      <Text style={styles.transcription}>{transcription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transcription: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WhisperTest;
