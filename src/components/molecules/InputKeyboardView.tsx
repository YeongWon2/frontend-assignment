import React, { memo, useCallback, useEffect, useState } from 'react';
import { Dimensions, Keyboard, KeyboardEvent, LayoutChangeEvent, Pressable, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';

export interface IInputKeyboardViewProps {
  InputView: React.ReactNode;
}

function InputKeyboardView({ InputView }: IInputKeyboardViewProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [inputHeight, setInputHeight] = useState<number>(0);

  const keyboardWillShow = useCallback((event: KeyboardEvent) => {
    setKeyboardHeight(event.endCoordinates.height);
    setVisible(true);
  }, []);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setInputHeight(event.nativeEvent.layout.height);
  }, []);

  const keyboardWillHide = useCallback(() => {
    setKeyboardHeight(0);
    setVisible(false);
  }, []);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [keyboardWillHide, keyboardWillShow]);

  return (
    <>
      <View onLayout={handleLayout}>{InputView}</View>
      {visible && (
        <FullWindowOverlay>
          <Pressable
            onPress={Keyboard.dismiss}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height - keyboardHeight - inputHeight,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          />
        </FullWindowOverlay>
      )}
    </>
  );
}

export default memo(InputKeyboardView);
