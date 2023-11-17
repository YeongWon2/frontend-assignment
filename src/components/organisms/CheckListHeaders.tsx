import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { fontStyle } from '@/helpers/StylesHelpers';
import ActionHeaderView from '@/components/molecules/ActionHeaderView';
import { useCheckListStore } from '@/context/CheckListProvider';

interface CheckListHeadersProps {
  onPress: (isEdit: boolean) => void;
}

function CheckListHeaders({ onPress }: CheckListHeadersProps) {
  const { checkListMap } = useCheckListStore();
  const [isEdit, setIsEdit] = useState(false);

  const handleEdit = useCallback(() => {
    setIsEdit(!isEdit);

    onPress(!isEdit);
  }, [isEdit, onPress]);

  return (
    <ActionHeaderView
      title="Checklists"
      actionButtonProps={{
        view: <Text style={styles.EditTextStyle}>{isEdit ? 'Done' : 'Edit'}</Text>,
        onPress: handleEdit,
        isEnabled: checkListMap.size > 0 ? true : false,
      }}
    />
  );
}

export default memo(CheckListHeaders);

const styles = StyleSheet.create({
  EditTextStyle: {
    ...fontStyle.NotoSans15,
    color: '#333',
  },
});
