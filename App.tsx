import React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckListScreen from '@/screens/CheckListScreen';
import { CheckListProvider } from '@/context/CheckListProvider';
import { SafeAreaView, StyleSheet } from 'react-native';
import { toastConfig } from '@/helpers/ToastHelpers';

const Stack = createNativeStackNavigator<StackParamList>();

type StackParamList = {
  Checklists: undefined;
};

function App() {
  return (
    <SafeAreaView style={styles.AppContainer}>
      <CheckListProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: '#FFFFFF' } }}>
            <Stack.Screen name="Checklists" component={CheckListScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CheckListProvider>
      <Toast position="bottom" config={toastConfig} />
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  AppContainer: {
    flex: 1,
  },
});
