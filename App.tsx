import React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckListScreen from '@/screens/CheckListScreen';
import { CheckListProvider } from '@/context/CheckListProvider';
import { SafeAreaView, StyleSheet } from 'react-native';
import { toastConfig } from '@/helpers/ToastHelpers';
import KeyboardAreaView from '@/components/molecules/KeyboardAreaView';

const Stack = createNativeStackNavigator<StackParamList>();

type StackParamList = {
  Checklists: undefined;
};

function App() {
  return (
    <KeyboardAreaView>
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
    </KeyboardAreaView>
  );
}

export default App;

const styles = StyleSheet.create({
  AppContainer: {
    flex: 1,
  },
});
