import React from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import WeekLabel from '@/components/atoms/WeekLabel';
import { fontStyle } from '@/helpers/StylesHelpers';

interface IWeekItemProps {
  isActive?: boolean;
  week: number;
  onLayout?: (event: LayoutChangeEvent) => void;
}

function WeekItem({ week = 0, isActive = false, onLayout }: IWeekItemProps) {
  const textColor = isActive ? styles.ActiveColor : styles.DisabledColor;

  return (
    <View style={styles.WeekItemContainer} onLayout={onLayout}>
      <WeekLabel isActive={isActive} />
      <View style={styles.WeekItemWrapper}>
        <Text style={[fontStyle.NotoSans11, textColor]}>week</Text>
        <Text style={[fontStyle.NotoSans18, textColor]}>{week}</Text>
      </View>
    </View>
  );
}

export default WeekItem;

const styles = StyleSheet.create({
  WeekItemContainer: {
    position: 'relative',
    width: 50,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  WeekItemWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  DisabledColor: {
    color: '#999999',
  },
  ActiveColor: {
    color: '#FFFFFF',
  },
});
