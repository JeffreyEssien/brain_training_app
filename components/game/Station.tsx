import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

export interface StationProps {
  id: string;
  x: number;
  y: number;
  color: string;
  isActive: boolean;
}

const Station: React.FC<StationProps> = ({ id, x, y, color, isActive }) => {
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    if (isActive) {
      pulse.value = withRepeat(
        withTiming(1.2, { duration: 1000 }),
        -1,
        true
      );
    } else {
      pulse.value = withTiming(1, { duration: 300 });
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
    };
  });

  return (
    <Animated.View style={[styles.station, { left: x, top: y }, animatedStyle]}>
      <View style={[styles.stationBody, { backgroundColor: color }]} />
      <View style={styles.stationPlatform} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  station: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationBody: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stationPlatform: {
    position: 'absolute',
    bottom: -8,
    width: 40,
    height: 8,
    backgroundColor: '#34495e',
    borderRadius: 4,
  },
});

export default Station; 