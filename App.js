import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createTheme, ThemeProvider } from "@rneui/themed";
import MainStackNavigator from './navigator/MainStackNagivator';
import { Provider } from "react-redux";
import { store } from './Redux/store';

const theme = createTheme({
  Button: {
    style: {
      backgroundColor: "red"
    }
  }
});

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <ThemeProvider theme={theme}>
            <MainStackNavigator />
          </ThemeProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
