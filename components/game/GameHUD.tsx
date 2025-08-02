import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';

export interface GameHUDProps {
  score: number;
  lives: number;
  level: number;
  accuracy: number;
}

const GameHUD: React.FC<GameHUDProps> = ({ score, lives, level, accuracy }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.row}>
        <View style={styles.stat}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Score
          </ThemedText>
          <ThemedText type="title" style={styles.value}>
            {score}
          </ThemedText>
        </View>
        
        <View style={styles.stat}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Lives
          </ThemedText>
          <ThemedText type="title" style={styles.value}>
            {lives}
          </ThemedText>
        </View>
        
        <View style={styles.stat}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Level
          </ThemedText>
          <ThemedText type="title" style={styles.value}>
            {level}
          </ThemedText>
        </View>
        
        <View style={styles.stat}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Accuracy
          </ThemedText>
          <ThemedText type="title" style={styles.value}>
            {accuracy}%
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameHUD; 