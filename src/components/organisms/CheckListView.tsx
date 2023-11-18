import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontStyle } from '@/helpers/StylesHelpers';
import TaskProgressBar from '@/components/molecules/TaskProgressBar';
import { CheckListType, useCheckListStore } from '@/context/CheckListProvider';
import EmptyCheckListView from '@/components/molecules/EmptyCheckListView';
import { useNavigation } from '@react-navigation/native';
import CheckListHeaders from '@/components/organisms/CheckListHeaders';
import Toast from 'react-native-toast-message';
import CreateCheckListButton from '@/components/organisms/CreateCheckListButton';
import { AnimatedCheckedIcon } from '@/components/molecules/AnimatedCheckedIcon';
import { AnimatedDeleteIcon } from '@/components/molecules/AnimatedDeleteIcon';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';

const progressWidth = Dimensions.get('screen').width - 40;

function CheckListView() {
  const navigation = useNavigation();
  const { checkListMap, currentWeek, completeCheckList, deleteCheckList } = useCheckListStore();
  const [checkList, setCheckList] = useState<CheckListType[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [week, setWeek] = useState<number>();

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
      const originData = [...(checkListMap.get(currentWeek || 0) || [])];
      const filterCheckList = checkList.filter((item) => item.id !== id);
      setCheckList(filterCheckList);
      Toast.show({
        type: 'action',
        text1: 'Checklist deleted',
        autoHide: false,
        onPress: () => handleUndo(originData),
      });
    },
    [checkList, checkListMap, currentWeek, handleUndo],
  );

  const handleHeaderPress = useCallback(
    (isEditButton: boolean) => {
      if (!isEditButton) {
        const currentWeekCheckList = checkListMap.get(currentWeek || 0) || [];
        const missingIds = currentWeekCheckList
          .filter((weekItem) => !checkList.some((item) => item.id === weekItem.id))
          .map((missingItem) => missingItem.id);

        deleteCheckList(missingIds);
        Toast.hide();
      }

      setIsEdit(isEditButton);
    },
    [checkList, checkListMap, currentWeek, deleteCheckList],
  );

  const handleAnimatedLayout = useCallback(() => {
    setWeek(currentWeek);
  }, [currentWeek]);

  useEffect(() => {
    setCheckList([...(checkListMap.get(currentWeek || 0) || [])]);
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

  useEffect(() => {
    setIsEdit(false);
  }, [currentWeek]);

  return (
    <>
      {currentWeek && (
        <Animated.View
          entering={!week ? undefined : week > currentWeek ? SlideInLeft : SlideInRight}
          style={styles.CheckListViewContainer}
          onLayout={handleAnimatedLayout}
        >
          {checkList.length > 0 ? (
            <>
              <TaskProgressBar width={progressWidth} progressing={progressing} totalCount={totalCount} />
              <ScrollView showsVerticalScrollIndicator={false} bounces={false} style={styles.CheckListSwapView}>
                {checkList?.map(({ content, id, checked }) => (
                  <View key={id} style={styles.CheckItemStyle}>
                    <Pressable onPress={() => completeCheckList(id, true)}>
                      <AnimatedCheckedIcon isVisible={!isEdit} checked={checked} />
                    </Pressable>
                    <Text
                      style={[
                        styles.CheckListTextStyle,
                        { color: checked ? '#C4C4C4' : '#333', textDecorationLine: checked ? 'line-through' : 'none' },
                      ]}
                    >
                      {content}
                    </Text>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => handleDeleteCheckList(id)}>
                      <AnimatedDeleteIcon isVisible={isEdit} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <View style={styles.EmptyCheckListStyle}>
              <EmptyCheckListView title="No checklists" discription="Add checklists that should be checked weekly." />
            </View>
          )}
        </Animated.View>
      )}
      {!isEdit && <CreateCheckListButton />}
    </>
  );
}
export default CheckListView;

const styles = StyleSheet.create({
  CheckListViewContainer: {
    flex: 1,
    position: 'relative',
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
