import React, { useState, createContext } from 'react';
import * as firebase from 'firebase';
import { loginRequest } from './authentication.service';
import { Alert, AppState } from 'react-native';
import moment from 'moment';
export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  firebase.auth().onAuthStateChanged((usr) => {
    if (usr) {
      // console.log(usr.uid);
      setUser(usr);
      setIsLoading(false);

      const database = firebase.database();
      const myRef = database.ref('users/' + usr.uid);

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
    } else {
      setIsLoading(false);
    }
  });

  const onLogin = (email, password) => {
    setIsLoading(true);
    if (!email || !password) {
      alert('please add all the field');
      return;
    }
    loginRequest(email, password)
      .then((u) => {
        setUser(u);
        setIsLoading(false);
        // Alert.alert('aa', 'Save');
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.toString());
      });
  };

  const onRegister = (email, password, name, image) => {
    setIsLoading(true);
    if (!email || !password) {
      Alert.alert('please add all the field');
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((u) => {
        setUser(u);
        setIsLoading(false);
        Alert.alert('asgudg', u.uid);
        const database = firebase.database();
        const myref = database.ref('users/' + u.uid);
        //  Alert.alert('aa', myref);
        myref
          .set({
            name: name,
            email: u.email,
            uid: u.uid,
            image: image,
            status: 'online',
          })
          .then(() => {
            Alert.alert('aa', 'Save');
            console.log('Data saved');
          })
          .catch((error) => {
            Alert.alert('aa', 'err');
            console.log('error ..');
          });
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.toString());
      });
  };

  const onLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        const database = firebase.database();
        const myRef = database.ref('users/' + user.uid);

        myRef
          .update({
            status: moment().format('YYYY-MM-DD HH:mm:ss'),
          })
          .then(() => {
            // Alert.alert('Status Updated', 'Status is now offline');
            console.log('Status updated');
          })
          .catch((error) => {
            // Alert.alert('Error', 'Failed to update status');
            console.log('Error updating status', error);
          });
        setUser(null);
        setError(null);
      });
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        onLogin,
        onRegister,
        onLogout,
      }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
