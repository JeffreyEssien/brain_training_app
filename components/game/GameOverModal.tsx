import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export interface GameOverModalProps {
  visible: boolean;
  score: number;
  level: number;
  accuracy: number;
  timePlayed: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  score,
  level,
  accuracy,
  timePlayed,
  onRestart,
}) => {
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <ThemedView style={styles.modal}>
          <ThemedText type="title" style={styles.title}>
            Game Over!
          </ThemedText>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <ThemedText type="defaultSemiBold">Final Score</ThemedText>
              <ThemedText type="title">{score}</ThemedText>
            </View>
            
            <View style={styles.stat}>
              <ThemedText type="defaultSemiBold">Level Reached</ThemedText>
              <ThemedText type="title">{level}</ThemedText>
            </View>
            
            <View style={styles.stat}>
              <ThemedText type="defaultSemiBold">Accuracy</ThemedText>
              <ThemedText type="title">{accuracy}%</ThemedText>
            </View>
            
            <View style={styles.stat}>
              <ThemedText type="defaultSemiBold">Time Played</ThemedText>
              <ThemedText type="title">{formatTime(timePlayed)}</ThemedText>
            </View>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={onRestart}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Play Again
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  stat: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GameOverModal; 