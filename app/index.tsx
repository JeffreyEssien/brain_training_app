import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import LoadingScreen from '@/components/game/LoadingScreen';
import TutorialModal from '@/components/game/TutorialModal';
import GameEngine from '@/components/game/GameEngine';
import MemoryMatch from '@/components/game/MemoryMatch';
import PuzzleGame from '@/components/game/PuzzleGame';
import WordScramble from '@/components/game/WordScramble';
import GameSimulation from '@/components/game/GameSimulation';

type GameState = 'home' | 'loading' | 'tutorial' | 'playing' | 'memory-match' | 'puzzle' | 'word-scramble' | 'simulation';

export default function HomeScreen() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [selectedGame, setSelectedGame] = useState<'train' | 'memory' | 'puzzle' | 'word'>('train');

  const handleStartGame = (gameType: 'train' | 'memory' | 'puzzle' | 'word') => {
    setSelectedGame(gameType);
    setGameState('simulation');
  };

  const handleLoadingComplete = () => {
    setGameState('tutorial');
  };

  const handleTutorialComplete = () => {
    setGameState('playing');
  };

  const handleSimulationComplete = () => {
    if (selectedGame === 'train') {
      setGameState('loading');
    } else if (selectedGame === 'memory') {
      setGameState('memory-match');
    } else if (selectedGame === 'puzzle') {
      setGameState('puzzle');
    } else if (selectedGame === 'word') {
      setGameState('word-scramble');
    }
  };

  const handleBackToHome = () => {
    setGameState('home');
  };

  if (gameState === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (gameState === 'tutorial') {
    return (
      <View style={styles.container}>
        <TutorialModal
          visible={true}
          onComplete={handleTutorialComplete}
        />
      </View>
    );
  }

  if (gameState === 'playing') {
    return <GameEngine onBackToHome={handleBackToHome} />;
  }

  if (gameState === 'memory-match') {
    return <MemoryMatch onBackToHome={handleBackToHome} />;
  }

  if (gameState === 'puzzle') {
    return <PuzzleGame onBackToHome={handleBackToHome} />;
  }

  if (gameState === 'word-scramble') {
    return <WordScramble onBackToHome={handleBackToHome} />;
  }

  if (gameState === 'simulation') {
    return <GameSimulation gameType={selectedGame} onComplete={handleSimulationComplete} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Brain Developer
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Choose your game
          </ThemedText>
        </View>

        <View style={styles.gamesContainer}>
          <TouchableOpacity style={styles.gameCard} onPress={() => handleStartGame('train')}>
            <View style={styles.gameIcon}>
              <ThemedText style={styles.gameEmoji}>🚂</ThemedText>
            </View>
            <View style={styles.gameInfo}>
              <ThemedText type="defaultSemiBold" style={styles.gameTitle}>
                Train of Thought
              </ThemedText>
              <ThemedText style={styles.gameDescription}>
                Route colored trains to their matching stations by controlling junction switches.
              </ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gameCard} onPress={() => handleStartGame('memory')}>
            <View style={styles.gameIcon}>
              <ThemedText style={styles.gameEmoji}>🎯</ThemedText>
            </View>
            <View style={styles.gameInfo}>
              <ThemedText type="defaultSemiBold" style={styles.gameTitle}>
                Memory Match
              </ThemedText>
              <ThemedText style={styles.gameDescription}>
                Test your memory by matching pairs of cards.
              </ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gameCard} onPress={() => handleStartGame('puzzle')}>
            <View style={styles.gameIcon}>
              <ThemedText style={styles.gameEmoji}>🧩</ThemedText>
            </View>
            <View style={styles.gameInfo}>
              <ThemedText type="defaultSemiBold" style={styles.gameTitle}>
                Puzzle Master
              </ThemedText>
              <ThemedText style={styles.gameDescription}>
                Solve challenging sliding puzzles and brain teasers.
              </ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gameCard} onPress={() => handleStartGame('word')}>
            <View style={styles.gameIcon}>
              <ThemedText style={styles.gameEmoji}>📝</ThemedText>
            </View>
            <View style={styles.gameInfo}>
              <ThemedText type="defaultSemiBold" style={styles.gameTitle}>
                Word Scramble
              </ThemedText>
              <ThemedText style={styles.gameDescription}>
                Unscramble words to improve vocabulary and speed.
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Train your brain with these engaging games!
          </ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
  },
  gamesContainer: {
    gap: 20,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  gameEmoji: {
    fontSize: 30,
  },
  gameInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  gameTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
}); 