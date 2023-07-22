import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import { AuthenticationContext } from '../Authentication/authentication.context';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const { onRegister, error, isLoading } = useContext(AuthenticationContext);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }
  const uploadImage = async (uri) => {
    // Alert.alert("aa",uri);
    const response = await fetch(uri);
    // Alert.alert("response",response);
    const blob = await response.blob();
    const imageName = uri.substring(uri.lastIndexOf('/') + 1);
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    // const uploadTask = ref.put(blob);
    await ref.put(blob);
    Alert.alert('aa', 'Progress');
  };
  const pickImageAndUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    Alert.alert('Sourav', result.uri);
    setImage(result.uri);
    // console.log(result.uri);
    uploadImage(result.uri);
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.box1}>
        <Text style={styles.text}>Welcome to Whatsapp 5.0</Text>
        <Image style={styles.img} source={require('../../assets/wa.png')} />
      </View>
      <View style={styles.box2}>
        {!showNext && (
          <>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              mode="outlined"
            />
            <TextInput
              label="password"
              mode="outlined"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
          </>
        )}
        {showNext ? (
          <>
            <TextInput
              label="Name"
              value={name}
              onChangeText={(text) => setName(text)}
              mode="outlined"
            />

            <Button mode="contained" onPress={pickImageAndUpload}>
              select profile pic
            </Button>

            <Button
              mode="contained"
              disabled={image ? false : true}
              onPress={() => onRegister(email, password, name, image)}>
              Signup
            </Button>
          </>
        ) : (
          <Button mode="contained" onPress={() => setShowNext(true)}>
            Next
          </Button>
        )}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ textAlign: 'center' }}>Already have an account ?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    color: 'green',
    margin: 40,
  },
  img: {
    width: 200,
    height: 200,
  },
  box1: {
    alignItems: 'center',
  },
  box2: {
    paddingHorizontal: 10,
    justifyContent: 'space-evenly',
    height: '50%',
  },
});
