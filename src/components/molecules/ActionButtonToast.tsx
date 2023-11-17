import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { fontStyle } from '@/helpers/StylesHelpers';
import { Pressable, Text, View } from 'react-native';
import ReloadIcon from '@/components/atoms/ReloadIcon';
import { BaseToastProps } from 'react-native-toast-message';

function ActionButtonToast({ text1, onPress }: BaseToastProps) {
  return (
    <View style={styles.DefaultLayout}>
      <Text style={styles.ActionToastText1}>{text1}</Text>
      <Pressable onPress={onPress}>
        <View style={styles.ActionReloadButton}>
          <ReloadIcon />
          <Text style={styles.ActionReloadTitle}>Undo</Text>
        </View>
      </Pressable>
    </View>
  );
}

export default ActionButtonToast;

const styles = StyleSheet.create({
  DefaultLayout: {
    width: Dimensions.get('screen').width - 40,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    height: 46,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ActionToastText1: {
    ...fontStyle.NotoSans13,
    color: '#FFFFFF',
    flexGrow: 1,
  },
  ActionReloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ActionReloadTitle: {
    ...fontStyle.NotoSans13,
    marginLeft: 4,
    fontWeight: '700',
    color: '#44CEC6',
  },
});
