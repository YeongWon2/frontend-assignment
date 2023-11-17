import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import WeekItemListView from '@/components/organisms/WeekItemListView';
import CheckListView from '@/components/organisms/CheckListView';

function CheckListScreen() {
  return (
    <SafeAreaView>
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
});
