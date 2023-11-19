import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import WeekItemListView from '@/components/organisms/WeekItemListView';
import CheckListView from '@/components/organisms/CheckListView';

function CheckListScreen() {
  return (
    <SafeAreaView style={styles.CheckListScreenContainer}>
      <View style={styles.WeekViewWrap}>
        <WeekItemListView defaultSelectedWeek={15} />
      </View>
      <View style={styles.CheckListWrap}>
        <CheckListView />
      </View>
    </SafeAreaView>
  );
}

export default CheckListScreen;

const styles = StyleSheet.create({
  CheckListScreenContainer: {
    flex: 1,
  },
  WeekViewWrap: { paddingBottom: 16, borderBottomWidth: 1, borderColor: '#F6F5F8' },
  CheckListWrap: { flex: 1 },
});
