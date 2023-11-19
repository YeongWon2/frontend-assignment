import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import InputKeyboardView from '@/components/molecules/InputKeyboardView';
import { useCheckListStore } from '@/context/CheckListProvider';
import UploadButton from '@/components/atoms/UploadButton';

interface IKeyboardInputContentProps {
  type: 'create' | 'update';
  onHide: () => void;
  id?: string;
  content?: string;
  isVisible: boolean;
}

function KeyboardInputContent({ id, onHide, type, content = '', isVisible }: IKeyboardInputContentProps) {
  const { createCheckList, updateCheckList } = useCheckListStore();
  const inputRef = useRef<TextInput>(null);
  const [currentContent, setCurrentContent] = useState<string>(content);

  const keyboardWillHide = useCallback(() => {
    setCurrentContent('');
    onHide();
  }, [onHide]);

  const handleChangeContent = useCallback((event: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setCurrentContent(event.nativeEvent.text);
  }, []);

  const handleUploadPress = useCallback(() => {
    if (type === 'create') {
      createCheckList(currentContent);
    } else if (type === 'update') {
      if (!id) throw new Error('update시에 id값은 필수 입니다.');

      updateCheckList(id, currentContent || '');
    }
    Keyboard.dismiss();
    setCurrentContent('');
  }, [createCheckList, currentContent, id, type, updateCheckList]);

  useEffect(() => {
    const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

    return () => {
      keyboardWillHideListener.remove();
    };
  }, [keyboardWillHide]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  return (
    isVisible && (
      <InputKeyboardView
        InputView={
          <View style={styles.InputWrap}>
            <TextInput
              ref={inputRef}
              style={styles.Input}
              placeholder={type === 'create' ? 'Add a checklist...' : 'Update a checklist...'}
              value={currentContent}
              onChange={handleChangeContent}
            />
            <TouchableOpacity activeOpacity={0.7} style={styles.IconButton} onPress={handleUploadPress}>
              <UploadButton disabled={!currentContent} />
            </TouchableOpacity>
          </View>
        }
      />
    )
  );
}

export default memo(KeyboardInputContent);

const styles = StyleSheet.create({
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
