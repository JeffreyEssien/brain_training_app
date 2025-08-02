import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Dimensions, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface WordScrambleProps {
  onBackToHome?: () => void;
}

const WordScramble: React.FC<WordScrambleProps> = ({ onBackToHome }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [hints, setHints] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false);

  const words = [
    'BRAIN', 'PUZZLE', 'MEMORY', 'LOGIC', 'THINK',
    'SOLVE', 'LEARN', 'FOCUS', 'SMART', 'QUICK',
    'MIND', 'GAME', 'PLAY', 'FUN', 'TEST'
  ];

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, timeLeft]);

  const initializeGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const scrambled = scrambleWord(randomWord);
    
    setCurrentWord(randomWord);
    setScrambledWord(scrambled);
    setUserGuess('');
    setTimeLeft(60);
    setHints(3);
    setIsGameActive(true);
  };

  const scrambleWord = (word: string): string => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };

  const checkAnswer = () => {
    if (userGuess.toUpperCase() === currentWord) {
      setScore(score + 10 + timeLeft);
      setLevel(level + 1);
      Alert.alert('🎉 Correct!', `You solved it! +${10 + timeLeft} points`, [
        { text: 'Next Word', onPress: initializeGame }
      ]);
    } else {
      Alert.alert('❌ Wrong!', 'Try again or use a hint', [
        { text: 'OK' }
      ]);
    }
  };

  const useHint = () => {
    if (hints > 0) {
      setHints(hints - 1);
      const randomIndex = Math.floor(Math.random() * currentWord.length);
      const hint = currentWord[randomIndex];
      Alert.alert('💡 Hint', `One of the letters is: ${hint}`, [
        { text: 'OK' }
      ]);
    } else {
      Alert.alert('No Hints Left', 'You\'ve used all your hints!', [
        { text: 'OK' }
      ]);
    }
  };

  const endGame = () => {
    setIsGameActive(false);
    Alert.alert(
      '⏰ Time\'s Up!',
      `Final Score: ${score}\nLevel Reached: ${level}`,
      [
        { text: 'Play Again', onPress: () => {
          setScore(0);
          setLevel(1);
          initializeGame();
        }},
        { text: 'Back to Home', onPress: onBackToHome }
      ]
    );
  };

  const LetterComponent: React.FC<{ letter: string; index: number }> = ({ letter, index }) => {
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);

    useEffect(() => {
      rotation.value = withSpring(Math.random() * 360);
      scale.value = withSpring(1.1, { duration: 500 });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
    }));

    return (
      <Animated.View style={[styles.letterTile, animatedStyle]}>
        <ThemedText style={styles.letterText}>{letter}</ThemedText>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Word Scramble
        </ThemedText>
        <View style={styles.stats}>
          <ThemedText style={styles.stat}>Score: {score}</ThemedText>
          <ThemedText style={styles.stat}>Level: {level}</ThemedText>
          <ThemedText style={styles.stat}>Time: {timeLeft}s</ThemedText>
        </View>
      </View>

      {/* Scrambled Word Display */}
      <View style={styles.wordContainer}>
        <ThemedText style={styles.instructionText}>
          Unscramble this word:
        </ThemedText>
        <View style={styles.scrambledWordContainer}>
          {scrambledWord.split('').map((letter, index) => (
            <LetterComponent key={index} letter={letter} index={index} />
          ))}
        </View>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          value={userGuess}
          onChangeText={setUserGuess}
          placeholder="Enter your answer..."
          placeholderTextColor="#999"
          autoCapitalize="characters"
          maxLength={currentWord.length}
        />
        <TouchableOpacity style={styles.submitButton} onPress={checkAnswer}>
          <ThemedText style={styles.buttonText}>Submit</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.hintButton} onPress={useHint}>
          <ThemedText style={styles.buttonText}>Hint ({hints})</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={initializeGame}>
          <ThemedText style={styles.buttonText}>Skip</ThemedText>
        </TouchableOpacity>
        
        {onBackToHome && (
          <TouchableOpacity style={styles.button} onPress={onBackToHome}>
            <ThemedText style={styles.buttonText}>Back to Home</ThemedText>
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
  stats: {
    flexDirection: 'row',
    gap: 15,
  },
  stat: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  instructionText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrambledWordContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  inputSection: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  hintButton: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WordScramble; 