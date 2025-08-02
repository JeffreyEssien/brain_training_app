import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 40, 300);
const TILE_SIZE = BOARD_SIZE / 3;

interface Tile {
  id: number;
  value: number;
  currentPosition: number;
  targetPosition: number;
}

interface PuzzleGameProps {
  onBackToHome?: () => void;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ onBackToHome }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    if (tiles.length === 0) {
      initializeGame();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && startTime > 0 && !isComplete) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, startTime, isComplete]);

  const initializeGame = () => {
    // Prevent multiple initializations
    if (isGameActive && !isComplete) return;
    
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 represents empty tile
    const shuffledNumbers = [...numbers].sort(() => Math.random() - 0.5);
    
    const newTiles = shuffledNumbers.map((value, index) => ({
      id: index,
      value,
      currentPosition: index,
      targetPosition: value === 0 ? 8 : value - 1,
    }));
    
    setTiles(newTiles);
    setMoves(0);
    setIsComplete(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsGameActive(true);
  };

  const canMoveTile = (tilePosition: number): boolean => {
    const emptyPosition = tiles.find(tile => tile.value === 0)?.currentPosition || 8;
    
    // Check if tile is adjacent to empty space
    const row = Math.floor(tilePosition / 3);
    const col = tilePosition % 3;
    const emptyRow = Math.floor(emptyPosition / 3);
    const emptyCol = emptyPosition % 3;
    
    return (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
  };

  const moveTile = (tilePosition: number) => {
    if (!canMoveTile(tilePosition)) return;
    
    const emptyPosition = tiles.find(tile => tile.value === 0)?.currentPosition || 8;
    const newTiles = [...tiles];
    
    // Swap positions
    const tileToMove = newTiles.find(tile => tile.currentPosition === tilePosition);
    const emptyTile = newTiles.find(tile => tile.value === 0);
    
    if (tileToMove && emptyTile) {
      const tempPosition = tileToMove.currentPosition;
      tileToMove.currentPosition = emptyTile.currentPosition;
      emptyTile.currentPosition = tempPosition;
      
      setTiles(newTiles);
      setMoves(moves + 1);
      
      // Check if puzzle is complete
      const isPuzzleComplete = newTiles.every(tile => 
        tile.currentPosition === tile.targetPosition
      );
      
      if (isPuzzleComplete && !isComplete) {
        setIsComplete(true);
        setIsGameActive(false);
        Alert.alert(
          '🎉 Puzzle Complete!',
          `You solved it in ${moves + 1} moves!\nTime: ${formatTime(elapsedTime)}`,
          [
            { text: 'Play Again', onPress: initializeGame },
            { text: 'Back to Home', onPress: onBackToHome },
          ]
        );
      }
    }
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const TileComponent: React.FC<{ tile: Tile; onPress: () => void }> = ({ tile, onPress }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    useEffect(() => {
      const row = Math.floor(tile.currentPosition / 3);
      const col = tile.currentPosition % 3;
      
      translateX.value = withSpring(col * TILE_SIZE);
      translateY.value = withSpring(row * TILE_SIZE);
    }, [tile.currentPosition]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    }));

    const handlePress = () => {
      scale.value = withTiming(0.9, { duration: 100 }, () => {
        scale.value = withTiming(1, { duration: 100 });
      });
      onPress();
    };

    if (tile.value === 0) {
      return <View style={styles.emptyTile} />;
    }

    return (
      <TouchableOpacity
        style={[
          styles.tile,
          canMoveTile(tile.currentPosition) && styles.movableTile,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.tileContent, animatedStyle]}>
          <ThemedText style={styles.tileNumber}>{tile.value}</ThemedText>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Puzzle Master
        </ThemedText>
        <View style={styles.stats}>
          <ThemedText style={styles.stat}>Moves: {moves}</ThemedText>
          <ThemedText style={styles.stat}>Time: {formatTime(elapsedTime)}</ThemedText>
        </View>
      </View>

      {/* Puzzle Board */}
      <View style={styles.board}>
        {tiles.map((tile) => (
          <TileComponent
            key={tile.id}
            tile={tile}
            onPress={() => moveTile(tile.currentPosition)}
          />
        ))}
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <ThemedText style={styles.instructionText}>
          Slide tiles to arrange numbers 1-8 in order
        </ThemedText>
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
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 30,
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE - 4,
    height: TILE_SIZE - 4,
    margin: 2,
  },
  tileContent: {
    width: '100%',
    height: '100%',
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
  movableTile: {
    shadowColor: '#f39c12',
    shadowOpacity: 0.5,
  },
  emptyTile: {
    position: 'absolute',
    width: TILE_SIZE - 4,
    height: TILE_SIZE - 4,
    margin: 2,
  },
  tileNumber: {
    fontSize: TILE_SIZE * 0.3,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructions: {
    alignItems: 'center',
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
});

export default PuzzleGame; 