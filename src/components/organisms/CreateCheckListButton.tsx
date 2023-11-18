import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Keyboard,
  TextInputChangeEventData,
  NativeSyntheticEvent,
} from 'react-native';
import FloatingButton from '@/components/atoms/FloatingButton';
import InputKeyboardView from '@/components/molecules/InputKeyboardView';
import UploadButton from '@/components/atoms/UploadButton';
import { useCheckListStore } from '@/context/CheckListProvider';

function CreateCheckListButton() {
  const { createCheckList } = useCheckListStore();
  const inputRef = useRef<TextInput>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');

  const handlePress = () => {
    setIsActive(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const keyboardWillHide = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleChangeContent = useCallback((event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setContent(event.nativeEvent.text);
  }, []);

  const handleUploadPress = useCallback(() => {
    createCheckList(content);
    Keyboard.dismiss();
    setContent('');
  }, [content, createCheckList]);

  useEffect(() => {
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    return () => {
      keyboardWillHideListener.remove();
    };
  }, [keyboardWillHide]);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  return (
    <>
      {!isActive && (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.FloatingButtonWrap}>
          <FloatingButton />
        </TouchableOpacity>
      )}

      {isActive && (
        <InputKeyboardView
          InputView={
            <View style={styles.InputWrap}>
              <TextInput
                ref={inputRef}
                style={styles.Input}
                placeholder="Add a checklist..."
                value={content}
                onChange={handleChangeContent}
              />
              <TouchableOpacity activeOpacity={0.7} style={styles.IconButton} onPress={handleUploadPress}>
                <UploadButton disabled={!content} />
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </>
  );
}

export default memo(CreateCheckListButton);

const styles = StyleSheet.create({
  FloatingButtonWrap: {
    position: 'absolute',
    bottom: 0,
    right: 20,
  },
  KeyboardAvoidingView: {
    flex: 1,
  },
  InputWrap: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderColor: '#F6F5F8',
    borderTopWidth: 1,
  },
  Input: {
    flex: 1,
    height: 42,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 16,
    borderRadius: 15,
    borderColor: '#EAE9ED',
    borderWidth: 1,
    paddingRight: 42,
  },
  IconButton: {
    position: 'absolute',
    right: 20,
    marginRight: 5,
  },
});
