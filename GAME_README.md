# Train of Thought - React Native Game

A puzzle game where you control colored trains by toggling junction switches to route them to their correct destination stations.

## Game Overview

**Train of Thought** is a strategic puzzle game built with React Native and Expo. Players must route colored trains to their matching stations by toggling junction switches at key intersections.

## Features

### Core Gameplay
- **Train Routing**: Colored trains spawn and must be routed to matching stations
- **Junction Control**: Tap junctions to toggle their direction (left/right)
- **Real-time Movement**: Trains move smoothly along tracks using React Native Reanimated
- **Scoring System**: Earn points for correct routings, lose lives for mistakes

### Game Mechanics
- **Dynamic Difficulty**: Spawn intervals decrease and train speed increases as you level up
- **Multiple Trains**: Multiple trains can be on the track simultaneously
- **Collision Prevention**: Game ensures no two trains collide on intersecting paths
- **Path Finding**: Trains follow predetermined paths based on junction states

### Visual & Audio
- **Smooth Animations**: 60fps animations using react-native-reanimated
- **Visual Feedback**: Trains scale when moving, stations pulse when active
- **Sound Effects**: Junction toggle sounds (when audio files are available)
- **Clean UI**: Minimal, modern design optimized for mobile

### Game States
- **HUD Display**: Real-time score, lives, level, and accuracy tracking
- **Game Over Modal**: Comprehensive stats display with restart functionality
- **Pause/Resume**: Game can be paused and resumed

## Technical Architecture

### State Management
- **Zustand Store**: Centralized game state management
- **Real-time Updates**: Position updates on every animation frame
- **Persistent State**: Game state persists across component re-renders

### Component Structure
```
components/game/
├── GameEngine.tsx      # Main game loop and rendering
├── Train.tsx           # Individual train component
├── Track.tsx           # Track segment rendering
├── Junction.tsx        # Interactive junction switches
├── Station.tsx         # Destination stations
├── GameHUD.tsx         # Heads-up display
└── GameOverModal.tsx   # Game over statistics
```

### Key Technologies
- **React Native**: Core framework
- **Expo**: Development platform
- **React Native Reanimated**: Smooth animations
- **Zustand**: State management
- **TypeScript**: Type safety

## Game Controls

- **Tap Junctions**: Toggle junction direction to route trains
- **Watch HUD**: Monitor score, lives, level, and accuracy
- **Plan Ahead**: Multiple trains may be on track simultaneously

## Scoring System

- **Correct Routing**: +100 points
- **Wrong Station**: -1 life
- **Level Progression**: Every 5 successful routings increases difficulty
- **Accuracy**: Percentage of correct routings vs total attempts

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on device/simulator:
   ```bash
   npm run ios
   npm run android
   ```

## Customization

### Adding New Features
- **Sound Effects**: Add audio files to `assets/sounds/`
- **New Track Layouts**: Modify `TRACK_LAYOUT` in GameEngine
- **Additional Stations**: Update `INITIAL_STATIONS` in gameStore
- **Custom Train Colors**: Modify `TRAIN_COLORS` array

### Difficulty Adjustment
- **Spawn Intervals**: Adjust `spawnInterval` in gameStore
- **Train Speed**: Modify `trainSpeed` values
- **Level Progression**: Change level-up conditions in `incrementSuccessfulRoutings`

## Performance Optimizations

- **60fps Target**: Optimized animations for smooth gameplay
- **Efficient Rendering**: Minimal re-renders using Zustand
- **Memory Management**: Proper cleanup of intervals and animation frames
- **Mobile Optimized**: Designed for portrait mode on mobile devices

## Future Enhancements

- **Multiple Levels**: Different track layouts and difficulty levels
- **Power-ups**: Special abilities to slow trains or auto-route
- **Multiplayer**: Competitive or cooperative modes
- **Achievements**: Unlockable content and statistics
- **Custom Themes**: Different visual themes and color schemes 