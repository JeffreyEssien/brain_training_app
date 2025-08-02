import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 4; // 4 cards per row with margins

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchProps {
  onBackToHome?: () => void;
}

const MemoryMatch: React.FC<MemoryMatchProps> = ({ onBackToHome }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const emojis = ['🚀', '🎮', '🎯', '🎨', '🎪', '🎭', '🎪', '🎨', '🎯', '🎮', '🚀', '🎭'];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledEmojis = [...emojis].sort(() => Math.random() - 0.5);
    const newCards = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(newCards);
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setIsGameComplete(false);
  };

  const handleCardPress = (cardId: number) => {
    if (flippedCards.length >= 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards[firstId];
      const secondCard = newCards[secondId];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        newCards[firstId].isMatched = true;
        newCards[secondId].isMatched = true;
        setCards(newCards);
        setScore(score + 10);
        setFlippedCards([]);

        // Check if game is complete
        const matchedCards = newCards.filter(card => card.isMatched).length;
        if (matchedCards === newCards.length) {
          setIsGameComplete(true);
        }
      } else {
        // No match
        setTimeout(() => {
          newCards[firstId].isFlipped = false;
          newCards[secondId].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const CardComponent: React.FC<{ card: Card; onPress: () => void }> = ({ card, onPress }) => {
    const rotation = useSharedValue(card.isFlipped || card.isMatched ? 180 : 0);
    const scale = useSharedValue(1);

    useEffect(() => {
      if (card.isFlipped || card.isMatched) {
        rotation.value = withSpring(180);
        scale.value = withSpring(1.05);
      } else {
        rotation.value = withSpring(0);
        scale.value = withSpring(1);
      }
    }, [card.isFlipped, card.isMatched]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { rotateY: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    }));

    return (
      <TouchableOpacity
        style={[
          styles.card,
          card.isMatched && styles.matchedCard,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.cardContent, animatedStyle]}>
          <ThemedText style={styles.cardEmoji}>
            {card.isFlipped || card.isMatched ? card.emoji : '❓'}
          </ThemedText>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Memory Match
        </ThemedText>
        <View style={styles.stats}>
          <ThemedText style={styles.stat}>Score: {score}</ThemedText>
          <ThemedText style={styles.stat}>Moves: {moves}</ThemedText>
        </View>
      </View>

      {/* Game Grid */}
      <View style={styles.gameGrid}>
        {cards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            onPress={() => handleCardPress(card.id)}
          />
        ))}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={initializeGame}>
          <ThemedText style={styles.buttonText}>New Game</ThemedText>
        </TouchableOpacity>
        
        {onBackToHome && (
          <TouchableOpacity style={styles.button} onPress={onBackToHome}>
            <ThemedText style={styles.buttonText}>Back to Home</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Game Complete Modal */}
      {isGameComplete && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ThemedText type="title" style={styles.modalTitle}>
              🎉 Congratulations!
            </ThemedText>
            <ThemedText style={styles.modalText}>
              You completed the game in {moves} moves!
            </ThemedText>
            <ThemedText style={styles.modalText}>
              Final Score: {score}
            </ThemedText>
            <TouchableOpacity style={styles.button} onPress={initializeGame}>
              <ThemedText style={styles.buttonText}>Play Again</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    gap: 20,
  },
  stat: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
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
  matchedCard: {
    backgroundColor: '#2ecc71',
  },
  cardContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: CARD_SIZE * 0.4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    margin: 20,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
});

export default MemoryMatch; 