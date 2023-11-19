import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCheckListStore } from '@/context/CheckListProvider';
import WeekItem from '@/components/molecules/WeekItem';
import _debounce from 'lodash/debounce';

const halfWidth = Dimensions.get('screen').width / 2;

//기본 default week 1~40 값
const weekList = Array.from({ length: 40 }, (_, index) => index + 1);

interface WeekItemListViewProps {
  defaultSelectedWeek: number; //default값 처리
}

const WeekItemListView = ({ defaultSelectedWeek }: WeekItemListViewProps) => {
  const { setCurrentWeek } = useCheckListStore();
  const flatListRef = useRef<FlatList>(null);
  const initialScrollIndex = weekList.indexOf(defaultSelectedWeek);
  const [weekItemWidth, setWeekItemWidth] = useState<number>(0);
  const [week, setWeek] = useState<number>(defaultSelectedWeek);
  //weekitem의 가운데 정렬하기 위한 계산 값
  const itemCenter = halfWidth - weekItemWidth / 2;

  //week item의 width값을 가져오기위한 이벤트
  const handleWeekItemLayout = useCallback((event: LayoutChangeEvent) => {
    setWeekItemWidth(event.nativeEvent.layout.width + 15);
  }, []);

  //week 클릭시 이벤트
  const handleWeekPress = useCallback((weekNumber: number) => {
    const index = weekList.indexOf(weekNumber);
    flatListRef.current?.scrollToIndex({
      animated: true,
      index,
    });
  }, []);

  //스크롤 이벤트가 발생될때마다 현재 컴포넌트 내에서만 상태관리를 위해 처리
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const visibleIndex = Math.ceil(offsetX / weekItemWidth);
      const correctedIndex =
        visibleIndex < 0 ? 0 : weekList.length - 1 < visibleIndex ? weekList.length - 1 : visibleIndex;

      const visibleWeek = weekList[correctedIndex];

      setWeek(visibleWeek);
    },
    [weekItemWidth],
  );

  //스크롤 이벤트가 끝날때 currentWeek 전역상태 set (애니메이션 처리를 위해서 마지막 스크롤에 이벤트 처리)
  const handleScrollEnd = useCallback(() => {
    //애니메이션 처리를 위해 undefined 이후 set
    setCurrentWeek(undefined);
    setCurrentWeek(week);
  }, [setCurrentWeek, week]);

  useEffect(() => {
    setCurrentWeek(defaultSelectedWeek);
  }, [defaultSelectedWeek, setCurrentWeek]);

  //랜더링 최적화를 위해 useMemo 작성
  const MemoizedFlatList = useMemo(() => {
    return (
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: itemCenter }}
        snapToInterval={weekItemWidth}
        data={weekList}
        keyExtractor={(item) => item.toString()}
        getItemLayout={(_, index) => ({
          length: weekItemWidth,
          offset: weekItemWidth * index,
          index,
        })}
        onMomentumScrollEnd={_debounce(handleScrollEnd, 300)}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleWeekPress(item)}>
            <WeekItem week={item} isActive={item === week} onLayout={handleWeekItemLayout} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={ItemSeparator}
        initialScrollIndex={initialScrollIndex}
      />
    );
  }, [
    itemCenter,
    weekItemWidth,
    handleScrollEnd,
    handleScroll,
    initialScrollIndex,
    week,
    handleWeekItemLayout,
    handleWeekPress,
  ]);

  return <View style={styles.WeekListContainer}>{MemoizedFlatList}</View>;
};

export default memo(WeekItemListView);

//첫 랜더링시에만 랜더링하기 위해 memo로 최적화
const ItemSeparator = memo(() => <View style={styles.ItemSeparatorStyle} />);

const styles = StyleSheet.create({
  WeekListContainer: {
    height: 62,
  },
  ItemSeparatorStyle: {
    width: 15,
  },
});
