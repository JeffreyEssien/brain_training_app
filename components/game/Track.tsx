import React from 'react';
import { View, StyleSheet } from 'react-native';

export interface TrackProps {
  x: number;
  y: number;
  width: number;
  height: number;
  isHorizontal: boolean;
}

const Track: React.FC<TrackProps> = ({ x, y, width, height, isHorizontal }) => {
  return (
    <View
      style={[
        styles.track,
        {
          left: x,
          top: y,
          width: width,
          height: height,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    backgroundColor: '#2c3e50',
    borderRadius: 2,
  },
});

export default Track; 