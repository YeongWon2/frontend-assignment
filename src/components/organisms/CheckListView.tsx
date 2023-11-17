import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fontStyle } from '@/helpers/StylesHelpers';
import TaskProgressBar from '@/components/molecules/TaskProgressBar';
import { CheckListType, useCheckListStore } from '@/context/CheckListProvider';
import CheckedIcon from '@/components/atoms/CheckedIcon';
import DeleteIcon from '@/components/atoms/DeleteIcon';
import EmptyCheckListView from '@/components/molecules/EmptyCheckListView';
import { useNavigation } from '@react-navigation/native';
import CheckListHeaders from '@/components/organisms/CheckListHeaders';
import Toast from 'react-native-toast-message';

const progressWidth = Dimensions.get('screen').width - 40;

function CheckListView() {
  const navigation = useNavigation();
  const { checkListMap, currentWeek, completeCheckList, deleteCheckList } = useCheckListStore();
  const [checkList, setCheckList] = useState<CheckListType[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const totalCount = checkList.length;
  const progressing = checkList.reduce((acc, current) => {
    if (current.checked) {
      acc += 1;
    }
    return acc;
  }, 0);

  const handleUndo = useCallback((originData: CheckListType[]) => {
    setCheckList(originData);
    Toast.hide();
  }, []);

  const handleDeleteCheckList = useCallback(
    (id: string) => {
      const originData = [...checkList];
      const filterCheckList = checkList.filter((item) => item.id !== id);
      setCheckList(filterCheckList);
      Toast.show({
        type: 'action',
        text1: 'Checklist deleted',
        autoHide: false,
        onPress: () => handleUndo(originData),
      });
    },
    [checkList, handleUndo],
  );

  const handleHeaderPress = useCallback(
    (isEditButton: boolean) => {
      if (!isEditButton) {
        const currentWeekCheckList = checkListMap.get(currentWeek) || [];
        const missingIds = currentWeekCheckList
          .filter((weekItem) => !checkList.some((item) => item.id === weekItem.id))
          .map((missingItem) => missingItem.id);

        deleteCheckList(missingIds);
      }

      setIsEdit(isEditButton);
    },
    [checkList, checkListMap, currentWeek, deleteCheckList],
  );

  useEffect(() => {
    setCheckList([...(checkListMap.get(currentWeek) || [])]);
  }, [checkListMap, currentWeek]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      header: () => {
        return <CheckListHeaders onPress={handleHeaderPress} />;
      },
    });
  }, [handleHeaderPress, navigation]);

  return (
    <View style={styles.CheckListViewContainer}>
      {checkList.length > 0 ? (
        <>
          <TaskProgressBar width={progressWidth} progressing={progressing} totalCount={totalCount} />
          <ScrollView bounces={false} style={styles.CheckListSwapView}>
            {checkList?.map(({ content, id, checked }) => (
              <View key={id} style={styles.CheckItemStyle}>
                {!isEdit && (
                  <Pressable onPress={() => completeCheckList(id, true)}>
                    <CheckedIcon isActive={checked} />
                  </Pressable>
                )}
                <Text
                  style={[
                    styles.CheckListTextStyle,
                    { color: checked ? '#C4C4C4' : '#333', textDecorationLine: checked ? 'line-through' : 'none' },
                  ]}
                >
                  {content}
                </Text>
                {isEdit && (
                  <Pressable onPress={() => handleDeleteCheckList(id)}>
                    <DeleteIcon />
                  </Pressable>
                )}
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={styles.EmptyCheckListStyle}>
          <EmptyCheckListView title="No checklists" discription="Add checklists that should be checked weekly." />
        </View>
      )}
    </View>
  );
}
export default CheckListView;

const styles = StyleSheet.create({
  CheckListViewContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  CheckListSwapView: {
    marginTop: 28,
  },
  CheckItemStyle: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  CheckListTextStyle: {
    ...fontStyle.NotoSans14,
    flex: 1,
    marginHorizontal: 12,
    alignSelf: 'center',
    flexShrink: 1,
  },
  EmptyCheckListStyle: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
