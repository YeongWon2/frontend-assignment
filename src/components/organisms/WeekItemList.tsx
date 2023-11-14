import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCheckStore } from '@/context/CheckListProvider';
import WeekItem from '@/components/molecules/WeekItem';

const halfWidth = Dimensions.get('screen').width / 2;

const WeekItemList = () => {
  const { weekList } = useCheckStore();
  const [weekItemWidth, setWeekItemWidth] = useState<number>(0);
  const [selectedWeek, setSelectedWeek] = useState<number>();
  const flatListRef = useRef<FlatList>(null);

  const handleWeekItemLayout = useCallback((event: LayoutChangeEvent) => {
    //item witdh와 간격 15를 더한값
    setWeekItemWidth(event.nativeEvent.layout.width + 15);
  }, []);

  const handleWeekPress = useCallback(
    (weekNumber: number) => {
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: weekList.indexOf(weekNumber),
        viewOffset: halfWidth - weekItemWidth / 2,
      });
    },
    [weekList, weekItemWidth],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const visibleIndex = Math.round(offsetX / weekItemWidth);
      const visibleWeek = weekList[visibleIndex];

      setSelectedWeek(visibleWeek);
    },
    [weekList, weekItemWidth],
  );

  useEffect(() => {
    console.log('weekitemList');
    console.log(selectedWeek);
  }, [selectedWeek]);

  useEffect(() => {
    setSelectedWeek(weekList[0]);
  }, [weekList]);

  return (
    <View style={{ paddingBottom: 16, borderBottomWidth: 1, borderColor: '#F6F5F8' }}>
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: halfWidth - weekItemWidth / 2 }}
        snapToInterval={weekItemWidth}
        data={weekList}
        keyExtractor={(item) => item.toString()}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleWeekPress(item)}>
            <WeekItem week={item} isActive={item === selectedWeek} onLayout={handleWeekItemLayout} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
      />
    </View>
  );
};

export default memo(WeekItemList);
