import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useGameStore, getRandomTrainColor, getRandomStation } from '@/store/gameStore';
import { ThemedText } from '@/components/ThemedText';
import Train from './Train';
import Track from './Track';
import Junction from './Junction';
import Station from './Station';
import GameHUD from './GameHUD';
import GameOverModal from './GameOverModal';

const { width, height } = Dimensions.get('window');
const GAME_WIDTH = width;
const GAME_HEIGHT = height - 150; // Account for HUD and safe area

const TRACK_LAYOUT = [
  // Horizontal tracks
  { x: 20, y: 150, width: width - 40, height: 4, isHorizontal: true },
  { x: 20, y: 250, width: width - 40, height: 4, isHorizontal: true },
  { x: 20, y: 350, width: width - 40, height: 4, isHorizontal: true },
  
  // Vertical tracks
  { x: 150, y: 120, width: 4, height: 300, isHorizontal: false },
  { x: 250, y: 120, width: 4, height: 300, isHorizontal: false },
  { x: 350, y: 120, width: 4, height: 300, isHorizontal: false },
];

const SPAWN_POINTS = [
  { x: 20, y: 150 },
  { x: 20, y: 250 },
  { x: 20, y: 350 },
];

interface GameEngineProps {
  onBackToHome?: () => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ onBackToHome }) => {
  const {
    trains,
    junctions,
    stations,
    score,
    lives,
    level,
    isGameOver,
    isPaused,
    spawnInterval,
    trainSpeed,
    gameStartTime,
    addTrain,
    removeTrain,
    updateTrainPosition,
    updateTrainPathIndex,
    toggleJunction,
    incrementScore,
    decrementLives,
    incrementSuccessfulRoutings,
    resetGame,
  } = useGameStore();

  const animationFrameRef = useRef<number | null>(null);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const generatePath = (start: { x: number; y: number }, target: { x: number; y: number; id: string; color: string }) => {
    // Simple path generation - can be enhanced for more complex routing
    const path = [start];
    
    // Add intermediate points based on junctions
    junctions.forEach(junction => {
      if (Math.abs(junction.y - start.y) < 50) {
        path.push({ x: junction.x, y: junction.y });
      }
    });
    
    path.push({ x: target.x, y: target.y });
    return path;
  };

  // Train spawning
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const spawnTrain = () => {
      const spawnPoint = SPAWN_POINTS[Math.floor(Math.random() * SPAWN_POINTS.length)];
      const color = getRandomTrainColor();
      const targetStation = getRandomStation();
      
      const train = {
        id: `train-${Date.now()}-${Math.random()}`,
        color,
        position: spawnPoint,
        direction: 'horizontal' as const,
        isMoving: true,
        path: generatePath(spawnPoint, targetStation),
        currentPathIndex: 0,
        targetStation: targetStation.id,
      };

      addTrain(train);
    };

    spawnIntervalRef.current = setInterval(spawnTrain, spawnInterval);

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, [spawnInterval, isGameOver, isPaused, addTrain, generatePath]);

  // Game loop
  useEffect(() => {
    if (isGameOver || isPaused) return;

    const gameLoop = () => {
      trains.forEach((train) => {
        if (train.currentPathIndex >= train.path.length - 1) {
          // Train reached destination
          const targetStation = stations.find(s => s.id === train.targetStation);
          if (targetStation && train.color === targetStation.color) {
            // Correct station
            incrementScore(100);
            incrementSuccessfulRoutings();
          } else {
            // Wrong station
            decrementLives();
          }
          removeTrain(train.id);
          return;
        }

        // Move train along path
        const nextPosition = train.path[train.currentPathIndex + 1];
        const currentPosition = train.path[train.currentPathIndex];
        
        const dx = nextPosition.x - currentPosition.x;
        const dy = nextPosition.y - currentPosition.y;
        
        // Calculate movement speed
        const speed = trainSpeed * 2; // Increase speed for visibility
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const moveX = (dx / distance) * speed;
          const moveY = (dy / distance) * speed;
          
          const newX = currentPosition.x + moveX;
          const newY = currentPosition.y + moveY;
          
          updateTrainPosition(train.id, { x: newX, y: newY });
          
          // Check if train reached next path point
          const newDistance = Math.sqrt(
            Math.pow(nextPosition.x - newX, 2) + Math.pow(nextPosition.y - newY, 2)
          );
          
          if (newDistance < speed) {
            // Move to next path point
            updateTrainPosition(train.id, nextPosition);
            updateTrainPathIndex(train.id, train.currentPathIndex + 1);
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trains, trainSpeed, isGameOver, isPaused, updateTrainPosition, updateTrainPathIndex, removeTrain, incrementScore, decrementLives, incrementSuccessfulRoutings]);

  const handleJunctionToggle = (id: string) => {
    toggleJunction(id);
  };

  const accuracy = trains.length > 0 ? Math.round((score / (score + lives * 100)) * 100) : 100;

  return (
    <View style={styles.container}>
      {/* Game Background */}
      <View style={styles.gameArea}>
        {/* Tracks */}
        {TRACK_LAYOUT.map((track, index) => (
          <Track key={index} {...track} />
        ))}
        
        {/* Junctions */}
        {junctions.map((junction) => (
          <Junction
            key={junction.id}
            {...junction}
            onToggle={handleJunctionToggle}
          />
        ))}
        
        {/* Stations */}
        {stations.map((station) => (
          <Station
            key={station.id}
            {...station}
            isActive={trains.some(train => train.targetStation === station.id)}
          />
        ))}
        
        {/* Trains */}
        {trains.map((train) => (
          <Train
            key={train.id}
            {...train}
          />
        ))}
      </View>
      
      {/* HUD */}
      <GameHUD
        score={score}
        lives={lives}
        level={level}
        accuracy={accuracy}
      />
      
      {/* Back Button */}
      {onBackToHome && (
        <TouchableOpacity style={styles.backButton} onPress={onBackToHome}>
          <View style={styles.backButtonContent}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </View>
        </TouchableOpacity>
      )}
      
      {/* Game Over Modal */}
      <GameOverModal
        visible={isGameOver}
        score={score}
        level={level}
        accuracy={accuracy}
        timePlayed={Date.now() - gameStartTime}
        onRestart={resetGame}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 100,
    left: 20,
    zIndex: 200,
  },
  backButtonContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default GameEngine; 