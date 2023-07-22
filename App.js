import React, { useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Alert,
  AppState,
} from 'react-native';
import SignupScreen from './src/screens/signupScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/Homescreen';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';
import moment from 'moment';
import { AuthenticationContextProvider } from './src/Authentication/authentication.context';
import { AuthenticationContext } from './src/Authentication/authentication.context';
import { MaterialIcons } from '@expo/vector-icons';
import ChatScreen from './src/screens/chat.screen';
import AccountScreen from './src/screens/AccountScreen';
const firebaseConfig = {
  apiKey: 'AIzaSyB4gIOWmCoLVFgmd5wa07rsU7zBSKXvWjU',
  authDomain: 'mealstogo-d1511.firebaseapp.com',
  projectId: 'mealstogo-d1511',
  storageBucket: 'mealstogo-d1511.appspot.com',
  messagingSenderId: '719628156900',
  appId: '1:719628156900:web:c167ef1683cac73721d1f1',
  databaseURL: 'https://mealstogo-d1511-default-rtdb.firebaseio.com',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'green',
  },
};

const Stack = createStackNavigator();
const Navigation = () => {
  const { isAuthenticated, onLogout, user } = useContext(AuthenticationContext);
  if (isAuthenticated) {
    AppState.addEventListener('change', (nextAppState) => {
      // console.log('------------>');
      // console.log(nextAppState);
      const database = firebase.database();
      const myRef = database.ref('users/' + user.uid);
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        myRef
          .update({
            status: moment().format('YYYY-MM-DD HH:mm:ss'),
          })
          .then(() => {
            // Alert.alert('Status Updated', 'Status is now online');
            console.log('Status updated');
          })
          .catch((error) => {
            // Alert.alert('Error', 'Failed to update status');
            console.log('Error updating status', error);
          });
      }
      if (nextAppState === 'active') {
        myRef
          .update({
            status: 'online',
          })
          .then(() => {
            // Alert.alert('Status Updated', 'Status is now online');
            console.log('Status updated');
          })
          .catch((error) => {
            // Alert.alert('Error', 'Failed to update status');
            console.log('Error updating status', error);
          });
      }
    });
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: 'green',
        }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home Screen"
              // component={HomeScreen}
              options={{
                headerRight: () => (
                  <MaterialIcons
                    name="account-circle"
                    size={34}
                    color="green"
                    style={{ marginRight: 10 }}
                    onPress={onLogout}
                  />
                ),
                title: 'WhatsApp',
              }}>
              {(props) => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="Chat"
              options={({ route }) => ({
                title: (
                  <View>
                    <Text>{route.params.name}</Text>
                    <Text>{route.params.status}</Text>
                  </View>
                ),
              })}>
              {(props) => <ChatScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Account">
              {(props) => <AccountScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <>
      <AuthenticationContextProvider>
        <PaperProvider theme={theme}>
          <StatusBar barStyle="light-content" backgroundColor="green" />
          <View style={styles.container}>
            <Navigation />
          </View>
        </PaperProvider>
      </AuthenticationContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
