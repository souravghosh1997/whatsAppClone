import react, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as firebase from 'firebase';
import Feather from 'react-native-vector-icons/Feather';
import { Button } from 'react-native-paper';
import { AuthenticationContext } from '../Authentication/authentication.context';
export default function AccountScreen({ user }) {
  const [profile, setProfile] = useState('');
  const { onLogout } = useContext(AuthenticationContext);
  useEffect(() => {
    const database = firebase.database();
    const myRef = database.ref('users/' + user.uid);

    myRef.on('value', (snapshot) => {
      const usersData = snapshot.val();
      setProfile(usersData);
      console.log(usersData);
    });
  }, []);
  if (!profile) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={{ uri: profile.image }} />
      <Text style={styles.text}>Name - {profile.name}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Feather name="mail" size={30} color="white" />
        <Text style={[styles.text, { marginLeft: 10 }]}>{profile.email}</Text>
      </View>
      <Button style={styles.btn} mode="contained" onPress={onLogout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'white',
  },
  text: {
    fontSize: 23,
    color: 'white',
  },
  btn: {
    borderColor: 'white',
    borderWidth: 3,
  },
});
