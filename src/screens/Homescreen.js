import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { FAB } from 'react-native-paper';
import * as firebase from 'firebase';

export default function HomeScreen({ user, navigation }) {
  //console.log(user);
  const [AllUsers, setAllUsers] = useState(null);
  const getUsers = async () => {
    const database = firebase.database();
    const myref = database.ref('users');
    myref
      .once('value')
      .then((snapshot) => {
        // Alert.alert('aa', 'Save');
        const data = snapshot.val();
        const userList = Object.keys(data).map((key) => ({
          ...data[key],
        }));
        setAllUsers(userList);
      })
      .catch((error) => {
        Alert.alert('aa', 'err');
        console.log('Error:', error);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const RenderCard = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Chat', {
            name: item.name,
            uid: item.uid,
            status: item.status,
          })
        }>
        <View style={styles.mycard}>
          <Image source={{ uri: item.image }} style={styles.img} />
          <View>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{item.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={AllUsers}
        renderItem={({ item }) => {
          if (item.uid != user.uid) {
            return <RenderCard item={item} />;
          }
        }}
        keyExtractor={(item) => item.uid}
      />

      <FAB
        style={styles.fab}
        icon="face-man-profile"
        color="black"
        onPress={() => navigation.navigate('Account')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  img: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'green' },
  text: {
    fontSize: 18,
    marginLeft: 15,
  },
  mycard: {
    flexDirection: 'row',
    margin: 3,
    padding: 4,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
});
