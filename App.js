import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignupScreen';
import MainNavigator from './MainNavigator';
import ProfileScreen from './screens/ProfileScreen';
import FinancialReportScreen from './screens/FinancialReportScreen';
import CreateBudgetScreen from './screens/CreateBudgetScreen';
import Budget from './screens/Budget';
import BudgetScreen from './screens/BudgetScreen';
import 'core-js/features/set-immediate';
import SettingsScreen from './screens/SettingsScreen';


const Stack = createStackNavigator();

export default function App() {
  console.log('BudgetScreen:', BudgetScreen);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={MainNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FinancialReport" component={FinancialReportScreen} />
        <Stack.Screen name="CreateBudgetScreen" component={CreateBudgetScreen} />
        <Stack.Screen name="BudgetScreen" component={BudgetScreen} />
        <Stack.Screen name="Budget" component={Budget} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
