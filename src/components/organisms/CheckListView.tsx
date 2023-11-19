import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontStyle } from '@/helpers/StylesHelpers';
import TaskProgressBar from '@/components/molecules/TaskProgressBar';
import { CheckListType, useCheckListStore } from '@/context/CheckListProvider';
import EmptyCheckListView from '@/components/molecules/EmptyCheckListView';
import { useNavigation } from '@react-navigation/native';
import CheckListHeaders from '@/components/organisms/CheckListHeaders';
import Toast from 'react-native-toast-message';
import CreateCheckListButton from '@/components/organisms/CreateCheckListButton';
import AnimatedCheckedIcon from '@/components/molecules/AnimatedCheckedIcon';
import AnimatedDeleteIcon from '@/components/molecules/AnimatedDeleteIcon';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';

const progressWidth = Dimensions.get('screen').width - 40;

function CheckListView() {
  const navigation = useNavigation();
  const { checkListMap, currentWeek, completeCheckList, deleteCheckList } = useCheckListStore();
  const [checkList, setCheckList] = useState<CheckListType[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [week, setWeek] = useState<number>();
  //checklist의 totalcount
  const totalCount = checkList.length;
  //checklist의 checked count 계산
  const progressing = checkList.reduce((acc, current) => {
    if (current.checked) {
      acc += 1;
    }
    return acc;
  }, 0);

  //delete시에 undo 이벤트 발생시 origin data를 가지고 초기화 처리
  const handleUndo = useCallback((originData: CheckListType[]) => {
    setCheckList(originData);
    Toast.hide();
  }, []);

  //복사본 checklist를 delete처리
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

  //done 이벤트 발생시에 복사본 checklist를 기준으로 전역상태 checklistMap delete 처리
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

  //layout 이벤트 발생시에 애니메이션 처리를 위해 current값과 비교할 week값 저장
  const handleAnimatedLayout = useCallback(() => {
    setWeek(currentWeek);
  }, [currentWeek]);

  useEffect(() => {
    //undo 및 done 이벤트 처리를 위해 복사본 checklist set
    setCheckList([...(checkListMap.get(currentWeek || 0) || [])]);
  }, [checkListMap, currentWeek]);

  useEffect(() => {
    //edit버튼 처리를 위해 navigation option set
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      header: () => {
        return <CheckListHeaders onPress={handleHeaderPress} />;
      },
    });
  }, [handleHeaderPress, navigation]);

  useEffect(() => {
    //currentWeek가 바뀔때마다 edit 버튼 및 undo알림 초기화
    setIsEdit(false);
    Toast.hide();
  }, [currentWeek]);

  //랜더링 최적화를 위해 useMemo 작성
  const MemoizedFlatList = useMemo(() => {
    return (
      <FlatList
        data={checkList}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        renderItem={({ item }) => {
          const { id, checked, content }: CheckListType = item;
          return (
            <View key={id} style={styles.CheckItemStyle}>
              <Pressable onPress={() => completeCheckList(id, true)}>
                <AnimatedCheckedIcon isVisible={!isEdit} checked={checked} />
              </Pressable>
              <Text
                style={[
                  styles.CheckListTextStyle,
                  {
                    color: checked ? '#C4C4C4' : '#333',
                    textDecorationLine: checked ? 'line-through' : 'none',
                  },
                ]}
              >
                {content}
              </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => handleDeleteCheckList(id)}>
                <AnimatedDeleteIcon isVisible={isEdit} />
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        style={styles.CheckListSwapView}
      />
    );
  }, [checkList, completeCheckList, handleDeleteCheckList, isEdit]);

  return (
    <>
      {currentWeek && (
        <Animated.View
          entering={!week ? undefined : week > currentWeek ? SlideInLeft : SlideInRight}
          style={styles.CheckListViewContainer}
          onLayout={handleAnimatedLayout}
        >
          {checkList.length > 0 && (
            <TaskProgressBar width={progressWidth} progressing={progressing} totalCount={totalCount} />
          )}
          {MemoizedFlatList}
        </Animated.View>
      )}
      {!isEdit && <CreateCheckListButton />}
    </>
  );
}
export default CheckListView;

//첫 랜더링시에만 랜더링
const ListEmptyComponent = memo(() => {
  return (
    <View style={styles.EmptyCheckListStyle}>
      <EmptyCheckListView title="No checklists" discription="Add checklists that should be checked weekly." />
    </View>
  );
});

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
