import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Colors,
  ActivityIndicator,
} from 'react-native-paper';
import { AuthenticationContext } from '../Authentication/authentication.context';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { onLogin, error, isLoading } = useContext(AuthenticationContext);
  // if (isLoading) {
  //   return <ActivityIndicator size="large" color="#00ff00" />;
  // }
  return (
    <KeyboardAvoidingView behavior="position">
      <View style={styles.box1}>
        <Text style={styles.text}>Welcome to Whatsapp 5.0</Text>
        <Image style={styles.img} source={require('../../assets/wa.png')} />
      </View>
      <View style={styles.box2}>
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
        {!isLoading ? (
          <Button mode="contained" onPress={() => onLogin(email, password)}>
            Login
          </Button>
        ) : (
          <ActivityIndicator animating={true} color={Colors.blue300} />
        )}

        <TouchableOpacity onPress={() => navigation.navigate('signup')}>
          <Text style={{ textAlign: 'center' }}>Dont have an account ?</Text>
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
