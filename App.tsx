import React from 'react';
import {SafeAreaView} from 'react-native';

import HeaderView from '@/components/atoms/HeaderView';
import WeekItem from '@/components/atoms/WeekItem';

function App() {
  return (
    <SafeAreaView>
      <HeaderView title="Checklists" />
      <WeekItem />
    </SafeAreaView>
  );
}

export default App;
