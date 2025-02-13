import React from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { loginSignupStyles as styles } from '../styles/LoginSingup';
import { Profile } from '../commonTypes';
import { Storage } from '../data/Storage';
import axios from 'axios';
import { SERVER_URI } from '../Config';

type LoginProps = {
  navigation: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate: any;
  };
};
function Login(props: LoginProps) {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorState, setErrorState] = React.useState<boolean>(false);

  const onPressForgotPassword = () => {
    props.navigation.navigate('Forgot Password');
  };

  const onPressLogin = () => {
    console.log('on press login');
    axios
      .post(`${SERVER_URI}/login`, {
        username: email.toLowerCase(),
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.message === 'login success') {
          console.log('login successful');
          // User Data object to be processed locally and saved as current login data (cleared after logout)
          const userData: Profile = {
            email: response.data.userData.email,
            firstName: response.data.userData.firstname,
            lastName: response.data.userData.lastname,
            role: response.data.userData.role,
            id: response.data.userData._id,
            profilePic: response.data.userData.profilePic,
            preferences: response.data.userData.preferences,
            pastPicks: response.data.userData.pastPicks,
            recentContacts: response.data.userData.recentContacts,
            location: response.data.userData.location,
            groups: [],
          };
          Storage.set('profile', JSON.stringify(userData));
          props.navigation.navigate('Home');
        }
      })
      .catch((error) => {
        console.log('error');
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.data.message === 'login failed')
            console.log('login unsuccessful');
          else {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const onPressSignUp = () => {
    props.navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        autoComplete="password"
        secureTextEntry={true}
        textContentType="password"
      />
      {errorState && (
        <Text style={styles.errorMessage}>
          email and password do not match 😭
        </Text>
      )}
      <Text onPress={onPressForgotPassword} style={styles.link}>
        Forgot password
      </Text>
      <Text onPress={onPressSignUp} style={styles.link}>
        Sign up
      </Text>
      <View style={styles.loginButtonContainer}>
        <Button title="Login" onPress={onPressLogin} color="#FF6D6E" />
      </View>
    </View>
  );
}

export { Login };
