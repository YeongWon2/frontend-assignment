import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useDerivedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const TextCom = () => {
  const translateX = useSharedValue(0);
  const isSliding = useDerivedValue(() => translateX.value !== 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const slideRight = () => {
    translateX.value = withSpring(100);
  };

  const resetSlide = () => {
    translateX.value = withSpring(0);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, animatedStyle]}>
        <Text>Sliding Component</Text>
      </Animated.View>
      <TouchableOpacity onPress={slideRight} disabled={isSliding.value}>
        <Text>Slide Right</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={resetSlide} disabled={!isSliding.value}>
        <Text>Reset Slide</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TextCom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
