import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

export interface JunctionProps {
  id: string;
  x: number;
  y: number;
  direction: 'left' | 'right';
  onToggle: (id: string) => void;
}

const Junction: React.FC<JunctionProps> = ({ id, x, y, direction, onToggle }) => {
  const rotation = useSharedValue(direction === 'left' ? 0 : 180);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const handlePress = () => {
    const newDirection = direction === 'left' ? 'right' : 'left';
    rotation.value = withTiming(newDirection === 'left' ? 0 : 180, { duration: 300 });
    onToggle(id);
  };

  return (
    <TouchableOpacity
      style={[styles.junction, { left: x, top: y }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.junctionBody, animatedStyle]}>
        <View style={styles.junctionIndicator} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  junction: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  junctionBody: {
    width: 24,
    height: 24,
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  junctionIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
});

export default Junction; 