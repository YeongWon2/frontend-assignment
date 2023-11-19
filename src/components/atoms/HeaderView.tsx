import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyleIOS, View } from 'react-native';
import { fontStyle } from '@/helpers/StylesHelpers';

interface IHeaderProps {
  title: string;
  textStyle?: StyleProp<TextStyleIOS>;
}

function HeaderView({ title, textStyle }: IHeaderProps) {
  return (
    <View style={styles.HeaderContainer}>
      <Text style={[styles.TextStyle, textStyle]}>{title}</Text>
    </View>
  );
}

export default HeaderView;

const styles = StyleSheet.create({
  HeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  TextStyle: {
    ...fontStyle.NotoSans16,
    color: '#333333',
  },
});
