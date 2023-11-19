import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FloatingButton from '@/components/atoms/FloatingButton';
import KeyboardInputContent from './KeyboardInputContent';

function CreateCheckListButton() {
  const [isActive, setIsActive] = useState<boolean>(false);

  const handlePress = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleHide = useCallback(() => {
    setIsActive(false);
  }, []);

  return (
    <>
      {!isActive && (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.FloatingButtonWrap}>
          <FloatingButton />
        </TouchableOpacity>
      )}

      <KeyboardInputContent type="create" isVisible={isActive} onHide={handleHide} />
    </>
  );
}

export default memo(CreateCheckListButton);

const styles = StyleSheet.create({
  FloatingButtonWrap: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
