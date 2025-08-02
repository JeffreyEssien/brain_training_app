import { create } from 'zustand';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export interface Train {
  id: string;
  color: string;
  position: { x: number; y: number };
  direction: 'horizontal' | 'vertical';
  isMoving: boolean;
  path: Array<{ x: number; y: number }>;
  currentPathIndex: number;
  targetStation: string;
}

export interface Junction {
  id: string;
  x: number;
  y: number;
  direction: 'left' | 'right';
}

export interface Station {
  id: string;
  x: number;
  y: number;
  color: string;
}

export interface GameState {
  // Game state
  score: number;
  lives: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
  gameStartTime: number;
  
  // Game objects
  trains: Train[];
  junctions: Junction[];
  stations: Station[];
  
  // Game settings
  spawnInterval: number;
  trainSpeed: number;
  successfulRoutings: number;
  
  // Actions
  addTrain: (train: Train) => void;
  removeTrain: (id: string) => void;
  updateTrainPosition: (id: string, position: { x: number; y: number }) => void;
  updateTrainPathIndex: (id: string, pathIndex: number) => void;
  toggleJunction: (id: string) => void;
  incrementScore: (points: number) => void;
  decrementLives: () => void;
  incrementLevel: () => void;
  setGameOver: (gameOver: boolean) => void;
  setPaused: (paused: boolean) => void;
  resetGame: () => void;
  incrementSuccessfulRoutings: () => void;
}

const TRAIN_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

const INITIAL_JUNCTIONS: Junction[] = [
  { id: 'j1', x: 150, y: 150, direction: 'left' },
  { id: 'j2', x: 250, y: 250, direction: 'left' },
  { id: 'j3', x: 350, y: 350, direction: 'left' },
];

const INITIAL_STATIONS: Station[] = [
  { id: 's1', x: 70, y: 120, color: '#e74c3c' },
  { id: 's2', x: width - 70, y: 170, color: '#3498db' },
  { id: 's3', x: 70, y: 420, color: '#2ecc71' },
  { id: 's4', x: width - 70, y: 470, color: '#f39c12' },
];

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  score: 0,
  lives: 3,
  level: 1,
  isGameOver: false,
  isPaused: false,
  gameStartTime: Date.now(),
  
  trains: [],
  junctions: INITIAL_JUNCTIONS,
  stations: INITIAL_STATIONS,
  
  spawnInterval: 3000,
  trainSpeed: 1,
  successfulRoutings: 0,
  
  // Actions
  addTrain: (train) => set((state) => ({
    trains: [...state.trains, train],
  })),
  
  removeTrain: (id) => set((state) => ({
    trains: state.trains.filter(train => train.id !== id),
  })),
  
  updateTrainPosition: (id, position) => set((state) => ({
    trains: state.trains.map(train =>
      train.id === id ? { ...train, position } : train
    ),
  })),
  
  updateTrainPathIndex: (id, pathIndex) => set((state) => ({
    trains: state.trains.map(train =>
      train.id === id ? { ...train, currentPathIndex: pathIndex } : train
    ),
  })),
  
  toggleJunction: (id) => set((state) => ({
    junctions: state.junctions.map(junction =>
      junction.id === id
        ? { ...junction, direction: junction.direction === 'left' ? 'right' : 'left' }
        : junction
    ),
  })),
  
  incrementScore: (points) => set((state) => ({
    score: state.score + points,
  })),
  
  decrementLives: () => set((state) => {
    const newLives = state.lives - 1;
    return {
      lives: newLives,
      isGameOver: newLives <= 0,
    };
  }),
  
  incrementLevel: () => set((state) => ({
    level: state.level + 1,
    spawnInterval: Math.max(1000, state.spawnInterval - 200),
    trainSpeed: state.trainSpeed + 0.2,
  })),
  
  setGameOver: (gameOver) => set({ isGameOver: gameOver }),
  
  setPaused: (paused) => set({ isPaused: paused }),
  
  resetGame: () => set({
    score: 0,
    lives: 3,
    level: 1,
    isGameOver: false,
    isPaused: false,
    gameStartTime: Date.now(),
    trains: [],
    junctions: INITIAL_JUNCTIONS,
    stations: INITIAL_STATIONS,
    spawnInterval: 3000,
    trainSpeed: 1,
    successfulRoutings: 0,
  }),
  
  incrementSuccessfulRoutings: () => set((state) => {
    const newRoutings = state.successfulRoutings + 1;
    const shouldLevelUp = newRoutings % 5 === 0;
    
    return {
      successfulRoutings: newRoutings,
      level: shouldLevelUp ? state.level + 1 : state.level,
      spawnInterval: shouldLevelUp ? Math.max(1000, state.spawnInterval - 200) : state.spawnInterval,
      trainSpeed: shouldLevelUp ? state.trainSpeed + 0.2 : state.trainSpeed,
    };
  }),
}));

export const getRandomTrainColor = () => {
  return TRAIN_COLORS[Math.floor(Math.random() * TRAIN_COLORS.length)];
};

export const getRandomStation = () => {
  const stations = useGameStore.getState().stations;
  return stations[Math.floor(Math.random() * stations.length)];
}; 