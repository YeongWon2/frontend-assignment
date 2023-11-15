import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fontStyle } from '@/helpers/StylesHelpers';
import TaskProgressBar from '@/components/molecules/TaskProgressBar';
import { useCheckListStore } from '@/context/CheckListProvider';
import CheckedIcon from '@/components/atoms/CheckedIcon';
import DeleteIcon from '@/components/atoms/DeleteIcon';

const progressWidth = Dimensions.get('screen').width - 40;

function CheckListView() {
  const { checkListMap, currentWeek, isEdit, completeCheckList } = useCheckListStore();

  const totalCount = (checkListMap.get(currentWeek) || []).length;
  const progressing = (checkListMap.get(currentWeek) || []).reduce((acc, current) => {
    if (current.checked) {
      acc += 1;
    }
    return acc;
  }, 0);

  return (
    <View style={styles.CheckListViewContainer}>
      <TaskProgressBar width={progressWidth} progressing={progressing} totalCount={totalCount} />
      <ScrollView bounces={false} style={styles.CheckListSwapView}>
        {checkListMap.get(currentWeek)?.map(({ content, id, checked }) => (
          <View key={id} style={styles.CheckItemStyle}>
            {!isEdit && (
              <Pressable onPress={() => completeCheckList(id, true)}>
                <CheckedIcon isActive={checked} />
              </Pressable>
            )}
            <Text style={styles.CheckListTextStyle}>{content}</Text>
            {isEdit && (
              <Pressable>
                <DeleteIcon />
              </Pressable>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
export default CheckListView;

const styles = StyleSheet.create({
  CheckListViewContainer: {
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
    color: '#333',
    flexShrink: 1,
  },
});
