import React, { useCallback, useEffect } from 'react';
import CheckedIcon from '@/components/atoms/CheckedIcon';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface IAnimatedCheckedIconProps {
  checked: boolean;
  isVisible: boolean;
}

export function AnimatedCheckedIcon({ checked, isVisible }: IAnimatedCheckedIconProps) {
  const translateX = useSharedValue(0);

  const animateIcon = useCallback(() => {
    translateX.value = isVisible ? withTiming(0, { duration: 200 }) : withTiming(-200, { duration: 200 });
  }, [isVisible, translateX]);

  useEffect(() => {
    animateIcon();
  }, [animateIcon, isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: isVisible ? withTiming(1, { duration: 200 }) : withTiming(0, { duration: 200 }),
      transform: [
        { translateX: translateX.value },
        { scaleX: isVisible ? withTiming(1, { duration: 200 }) : withTiming(0, { duration: 200 }) },
      ],
      width: isVisible ? withTiming(28, { duration: 200 }) : withTiming(0, { duration: 200 }),
    };
  });

  return <Animated.View style={animatedStyle}>{isVisible && <CheckedIcon checked={checked} />}</Animated.View>;
}
