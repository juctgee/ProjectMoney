import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

// Logo Component
const Logo = ({ source, style }) => (
  <View style={styles.logoContainer}>
    <Image source={source} style={style} />
  </View>
);

// SignUpScreen Component
export default function SignUpScreen() {
  const navigation = useNavigation();

  // States for form data
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle sign up
  const handleSignUp = async () => {
    console.log("Sign Up Button Pressed");

    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      console.log('Sending data:', { username, email, password });

      const response = await fetch('http://192.168.1.48:8082/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      console.log('API Response:', data);

      if (response.ok) {
        Alert.alert('Success', 'User registered successfully');
        console.log("Navigating to Login Screen");
        
        // ส่งข้อมูลไปยังหน้า Login หลังจากสมัครสำเร็จ
        navigation.navigate('Login'); // สามารถเพิ่มข้อมูลไปยังหน้าถัดไปได้ที่นี่หากต้องการ
      } else {
        Alert.alert('Error', data.error || 'Failed to register');
      }
    } catch (err) {
      Alert.alert('Error', `Network request failed: ${err.message}`);
      console.error('Network error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        style={styles.backgroundImage}
        source={require('../assets/images/background.png')}
      />

      <Logo
        source={require('../assets/images/lustres.png')}
        style={styles.logoLarge}
      />

      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Sign Up</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="gray"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="gray"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Already have an account?{' '}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
  },
  logoLarge: {
    width: 200,
    height: 200,
    top: 50,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 250,
  },
  titleContainer: {
    marginBottom: 20,
  },
  titleText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 50,
  },
  form: {
    width: '80%',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 20,
    width: '100%',
    marginBottom: 10,
  },
  input: {
    height: 40,
    color: 'black',
  },
  signUpButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  signUpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signupContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  signupText: {
    color: 'gray',
  },
  loginLink: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});
