import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
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

const halfWidth = Dimensions.get('screen').width / 2;

const weekList = Array.from({ length: 40 }, (_, index) => index + 1);

interface WeekItemListViewProps {
  defaultSelectedWeek: number;
}

const WeekItemListView = ({ defaultSelectedWeek }: WeekItemListViewProps) => {
  const flatListRef = useRef<FlatList>(null);
  const initialScrollIndex = weekList.indexOf(defaultSelectedWeek);
  const [weekItemWidth, setWeekItemWidth] = useState<number>(0);
  const { currentWeek, setCurrentWeek } = useCheckListStore();

  const handleWeekItemLayout = useCallback((event: LayoutChangeEvent) => {
    setWeekItemWidth(event.nativeEvent.layout.width + 15);
  }, []);

  const handleWeekPress = useCallback((weekNumber: number) => {
    const index = weekList.indexOf(weekNumber);
    flatListRef.current?.scrollToIndex({
      animated: true,
      index,
    });
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const visibleIndex = Math.ceil(offsetX / weekItemWidth);
      const correctedIndex =
        visibleIndex < 0 ? 0 : weekList.length - 1 < visibleIndex ? weekList.length - 1 : visibleIndex;

      const visibleWeek = weekList[correctedIndex];

      setCurrentWeek(visibleWeek);
    },
    [setCurrentWeek, weekItemWidth],
  );

  const MemoizedFlatList = useMemo(() => {
    return (
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: halfWidth - weekItemWidth / 2 }}
        snapToInterval={weekItemWidth}
        data={weekList}
        keyExtractor={(item) => item.toString()}
        getItemLayout={(_, index) => ({
          length: weekItemWidth,
          offset: weekItemWidth * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          console.warn('onScrollToIndexFailed info: ', info);
        }}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleWeekPress(item)}>
            <WeekItem week={item} isActive={item === currentWeek} onLayout={handleWeekItemLayout} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={ItemSeparator}
        initialScrollIndex={initialScrollIndex}
      />
    );
  }, [currentWeek, handleScroll, handleWeekItemLayout, handleWeekPress, initialScrollIndex, weekItemWidth]);

  return <View style={styles.WeekListContainer}>{MemoizedFlatList}</View>;
};

export default memo(WeekItemListView);

const ItemSeparator = memo(() => <View style={styles.ItemSeparatorStyle} />);

const styles = StyleSheet.create({
  WeekListContainer: {
    height: 62,
  },
  ItemSeparatorStyle: {
    width: 15,
  },
});
