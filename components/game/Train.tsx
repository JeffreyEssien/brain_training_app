import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

export interface TrainProps {
  id: string;
  color: string;
  position: { x: number; y: number };
  direction: 'horizontal' | 'vertical';
  isMoving: boolean;
}

const Train: React.FC<TrainProps> = ({ id, color, position, direction, isMoving }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withTiming(position.x, { duration: 300 }) },
        { translateY: withTiming(position.y, { duration: 300 }) },
        {
          scale: withTiming(isMoving ? 1.1 : 1, { duration: 200 }),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.train, { backgroundColor: color }, animatedStyle]}>
      <View style={[styles.trainBody, { backgroundColor: color }]} />
      <View style={[styles.trainFront, { backgroundColor: color }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  train: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trainBody: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  trainFront: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default Train; 