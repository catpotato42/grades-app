import React, { useRef, useEffect } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';

interface SmoothSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  theme: any;
}

export const SmoothSwitch = ({ value, onValueChange, theme }: SmoothSwitchProps) => {
  const moveAnim = useRef(new Animated.Value(value ? 20 : 0)).current;

  useEffect(() => {
    Animated.timing(moveAnim, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <Pressable 
      onPress={() => onValueChange(!value)}
      //when you switch to colorblind this changes from green to turquoise lmao
      style={[styles.track, { backgroundColor: value ? theme.colors.gradeGreen : theme.colors.textUnavailable }]}
    >
      <Animated.View style={[styles.thumb, { left: moveAnim }]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
});