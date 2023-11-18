import React from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, StyleSheet } from 'react-native';

interface IKeyboardAreaViewProps {
  children: JSX.Element;
}

const KeyboardAreaView: React.FunctionComponent<IKeyboardAreaViewProps> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      enabled={Platform.OS === 'ios'}
      behavior="padding"
      style={styles.KeyboardContainer}
      contentContainerStyle={styles.ContentContainer}
    >
      <TouchableWithoutFeedback style={styles.Touchable}>{children}</TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  KeyboardContainer: {
    flex: 1,
  },
  ContentContainer: {
    flexGrow: 1,
  },
  Touchable: {
    flex: 1,
  },
});

export default KeyboardAreaView;
