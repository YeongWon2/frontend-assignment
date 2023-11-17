import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontStyle } from '@/helpers/StylesHelpers';
import EmptyCheckListIcon from '@/components/atoms/EmptyCheckListIcon';

interface IEmptyCheckListViewProps {
  title: string;
  discription: string;
}

function EmptyCheckListView({ title, discription }: IEmptyCheckListViewProps) {
  return (
    <View style={styles.EmptyCheckListContainer}>
      <EmptyCheckListIcon />
      <Text style={styles.TitleStyle}>{title}</Text>
      <Text style={styles.DiscriptionStyle}>{discription}</Text>
    </View>
  );
}

export default memo(EmptyCheckListView);

const styles = StyleSheet.create({
  EmptyCheckListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  TitleStyle: {
    ...fontStyle.NotoSans20,
    color: '#84858F',
    marginTop: 28,
  },
  DiscriptionStyle: {
    ...fontStyle.NotoSans13,
    color: '#999',
    marginTop: 8,
  },
});
