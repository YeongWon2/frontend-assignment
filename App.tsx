import React from 'react';
import { SafeAreaView } from 'react-native';

import HeaderView from '@/components/atoms/HeaderView';
import WeekItem from '@/components/molecules/WeekItem';
import WeekItemList from '@/components/organisms/WeekItemList';
import { CheckListProvider } from '@/context/CheckListProvider';

function App() {
  return (
    <CheckListProvider>
      <SafeAreaView>
        <HeaderView title="Checklists" />
        <WeekItemList />
      </SafeAreaView>
    </CheckListProvider>
  );
}

export default App;
