import React from 'react';
import { CheckListProvider } from '@/context/CheckListProvider';
import CheckListScreen from '@/screens/CheckListScreen';

function App() {
  return (
    <CheckListProvider>
      <CheckListScreen />
    </CheckListProvider>
  );
}

export default App;
