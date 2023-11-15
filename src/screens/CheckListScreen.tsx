import React, { useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { fontStyle } from '@/helpers/StylesHelpers';
import WeekItemListView from '@/components/organisms/WeekItemListView';
import ActionHeaderView from '@/components/molecules/ActionHeaderView';
import { useCheckListStore } from '@/context/CheckListProvider';
import CheckListView from '@/components/organisms/CheckListView';

function CheckListScreen() {
  const { checkListMap, isEdit, setIsEdit } = useCheckListStore();

  const handleEdit = useCallback(() => {
    setIsEdit(!isEdit);
  }, [isEdit, setIsEdit]);

  return (
    <SafeAreaView>
      <ActionHeaderView
        title="Checklists"
        actionButtonProps={{
          view: <Text style={styles.EditTextStyle}>{isEdit ? 'Done' : 'Edit'}</Text>,
          onPress: handleEdit,
          isEnabled: checkListMap.size > 0 ? true : false,
        }}
      />
      <View style={styles.WeekViewBorderStyle}>
        <WeekItemListView defaultSelectedWeek={15} />
      </View>
      <View>
        <CheckListView />
      </View>
    </SafeAreaView>
  );
}

export default CheckListScreen;

const styles = StyleSheet.create({
  WeekViewBorderStyle: { paddingBottom: 16, borderBottomWidth: 1, borderColor: '#F6F5F8' },
  EditTextStyle: {
    ...fontStyle.NotoSans15,
    color: '#333',
  },
});
