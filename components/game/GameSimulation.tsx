import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface GameSimulationProps {
  gameType: 'train' | 'memory' | 'puzzle' | 'word';
  onComplete: () => void;
}

const GameSimulation: React.FC<GameSimulationProps> = ({ gameType, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const trainPosition = useSharedValue(0);
  const cardRotation = useSharedValue(0);
  const tilePosition = useSharedValue(0);
  const letterScale = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      startSimulation();
    }
  }, [isPlaying, gameType]);

  const startSimulation = () => {
    switch (gameType) {
      case 'train':
        trainPosition.value = withRepeat(
          withTiming(width - 100, { duration: 3000 }),
          -1,
          false
        );
        break;
      case 'memory':
        cardRotation.value = withRepeat(
          withTiming(180, { duration: 1000 }),
          -1,
          true
        );
        break;
      case 'puzzle':
        tilePosition.value = withRepeat(
          withTiming(100, { duration: 2000 }),
          -1,
          true
        );
        break;
      case 'word':
        letterScale.value = withRepeat(
          withTiming(1.2, { duration: 1000 }),
          -1,
          true
        );
        break;
    }
  };

  const getSimulationContent = () => {
    switch (gameType) {
      case 'train':
        return (
          <View style={styles.trainSimulation}>
            <View style={styles.track}>
              <Animated.View 
                style={[
                  styles.train,
                  useAnimatedStyle(() => ({
                    transform: [{ translateX: trainPosition.value }],
                  }))
                ]}
              />
            </View>
            <View style={styles.junction}>
              <View style={styles.junctionDot} />
            </View>
            <View style={styles.station}>
              <View style={styles.stationDot} />
            </View>
          </View>
        );
      
      case 'memory':
        return (
          <View style={styles.memorySimulation}>
            <Animated.View 
              style={[
                styles.card,
                useAnimatedStyle(() => ({
                  transform: [{ rotateY: `${cardRotation.value}deg` }],
                }))
              ]}
            >
              <ThemedText style={styles.cardText}>🎯</ThemedText>
            </Animated.View>
          </View>
        );
      
      case 'puzzle':
        return (
          <View style={styles.puzzleSimulation}>
            <View style={styles.puzzleBoard}>
              <Animated.View 
                style={[
                  styles.puzzleTile,
                  useAnimatedStyle(() => ({
                    transform: [{ translateX: tilePosition.value }],
                  }))
                ]}
              >
                <ThemedText style={styles.tileText}>3</ThemedText>
              </Animated.View>
            </View>
          </View>
        );
      
      case 'word':
        return (
          <View style={styles.wordSimulation}>
            <View style={styles.letterContainer}>
              {['B', 'R', 'A', 'I', 'N'].map((letter, index) => (
                <Animated.View 
                  key={index}
                  style={[
                    styles.letterTile,
                    useAnimatedStyle(() => ({
                      transform: [{ scale: letterScale.value }],
                    }))
                  ]}
                >
                  <ThemedText style={styles.letterText}>{letter}</ThemedText>
                </Animated.View>
              ))}
            </View>
          </View>
        );
    }
  };

  const getInstructions = () => {
    switch (gameType) {
      case 'train':
        return [
          'Route colored trains to matching stations',
          'Tap junction switches to change track direction',
          'Score points for correct routings',
          'Watch out for wrong destinations!'
        ];
      case 'memory':
        return [
          'Find matching pairs of cards',
          'Tap cards to flip them',
          'Remember card positions',
          'Complete all pairs to win!'
        ];
      case 'puzzle':
        return [
          'Slide tiles to arrange numbers 1-8',
          'Only adjacent tiles can move',
          'Complete the puzzle in fewest moves',
          'Test your spatial reasoning!'
        ];
      case 'word':
        return [
          'Unscramble the given word',
          'Use hints if you get stuck',
          'Score points for speed',
          'Improve your vocabulary!'
        ];
    }
  };

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentStep < getInstructions().length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {gameType === 'train' && 'Train of Thought'}
          {gameType === 'memory' && 'Memory Match'}
          {gameType === 'puzzle' && 'Puzzle Master'}
          {gameType === 'word' && 'Word Scramble'}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          How to Play
        </ThemedText>
      </View>

      <View style={styles.simulationContainer}>
        {getSimulationContent()}
      </View>

      <View style={styles.instructionContainer}>
        <ThemedText style={styles.instructionText}>
          {getInstructions()[currentStep]}
        </ThemedText>
      </View>

      <View style={styles.progressContainer}>
        {getInstructions().map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentStep && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.controls}>
        {!isPlaying ? (
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <ThemedText style={styles.buttonText}>Start Demo</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <ThemedText style={styles.buttonText}>
              {currentStep === getInstructions().length - 1 ? 'Start Game' : 'Next'}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
  },
  simulationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  trainSimulation: {
    width: width - 40,
    height: 200,
    position: 'relative',
  },
  track: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#2c3e50',
  },
  train: {
    position: 'absolute',
    top: 90,
    width: 20,
    height: 20,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
  },
  junction: {
    position: 'absolute',
    top: 90,
    left: 150,
    width: 20,
    height: 20,
    backgroundColor: '#f39c12',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  junctionDot: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  station: {
    position: 'absolute',
    top: 80,
    right: 20,
    width: 30,
    height: 30,
    backgroundColor: '#3498db',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationDot: {
    width: 15,
    height: 15,
    backgroundColor: '#fff',
    borderRadius: 7.5,
  },
  memorySimulation: {
    alignItems: 'center',
  },
  card: {
    width: 80,
    height: 80,
    backgroundColor: '#3498db',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 40,
  },
  puzzleSimulation: {
    alignItems: 'center',
  },
  puzzleBoard: {
    width: 150,
    height: 150,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    position: 'relative',
  },
  puzzleTile: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 40,
    height: 40,
    backgroundColor: '#3498db',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  wordSimulation: {
    alignItems: 'center',
  },
  letterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  letterTile: {
    width: 50,
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 26,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3498db',
  },
  controls: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameSimulation; 