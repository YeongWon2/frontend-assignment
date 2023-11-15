import React, { ReactNode, memo } from 'react';
import { GestureResponderEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import HeaderView from '@/components/atoms/HeaderView';

interface IActionHeaderViewProps {
  title: string;
  actionButtonProps: {
    view: ReactNode;
    onPress: (event: GestureResponderEvent) => void;
    isEnabled?: boolean;
  };
}

function ActionHeaderView({ title, actionButtonProps }: IActionHeaderViewProps) {
  const { isEnabled = true, onPress, view } = actionButtonProps;

  return (
    <View style={styles.HeaderContainer}>
      <HeaderView title={title} />
      {isEnabled && (
        <View style={styles.actionButton}>
          <TouchableOpacity onPress={onPress}>{view}</TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default memo(ActionHeaderView);

const styles = StyleSheet.create({
  HeaderContainer: {
    position: 'relative',
  },
  actionButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingRight: 20,
    height: 60,
    justifyContent: 'center',
  },
});
