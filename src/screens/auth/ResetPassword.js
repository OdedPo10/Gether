import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, ROUTES } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../../context/usersContext';
import { useContext, useRef } from 'react';

const ResetPassword = () => {
  const { userIDforreset, changePassword } = useContext(UserContext);
  const [password1, setpassword1] = useState('');
  const [password2, setpassword2] = useState('');

  const handlePasswordInput1 = (text) => {
    setpassword1(text);
  };
  const handlePasswordInput2 = (text) => {
    setpassword2(text);
  };

  const checkPasswordValue = async () => {
    if (password1 === password2) {
      let result = await changePassword(password1, userIDforreset);
      if (result) {
        Alert.alert(
          'Success',
          `Your password has been changed, please login again`,
          [{ text: 'OK', onPress: () => navigation.navigate(ROUTES.LOGIN) }]
        );
      } else {
        Alert.alert(
          'Oops!',
          `We have some server problems pls try again late`,
          [{ text: 'OK', onPress: () => navigation.navigate(ROUTES.LOGIN) }]
        );
      }
    } else {
      setpassword1('');
      setpassword2('');
      Alert.alert('Failure', `Password does not match, try again`, [
        { text: 'Cancel' },
      ]);
    }
  };

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.wFull}>
          <Text style={styles.loginContinueTxt}>Choose your new password</Text>

          <TextInput
            style={styles.input}
            onChangeText={handlePasswordInput1}
            placeholder="new password"
          />

          <TextInput
            style={styles.input}
            onChangeText={handlePasswordInput2}
            placeholder="confirm password"
          />

          <View style={styles.loginBtnWrapper}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.loginBtn}
              onPress={checkPasswordValue}>
              <Text style={styles.loginText}>Reset password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    padding: 15,
    width: '100%',
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 42,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.primary,
    opacity: 0.9,
  },
  loginContinueTxt: {
    fontSize: 21,
    textAlign: 'center',
    color: COLORS.gray,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    height: 55,
    paddingVertical: 0,
  },

  loginBtnWrapper: {
    backgroundColor: COLORS.primary,
    height: 55,
    marginTop: 12,
    borderRadius: '50%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  linearGradient: {
    width: '100%',
    borderRadius: 50,
  },
  loginBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 55,
  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '400',
  },
  forgotPassText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 15,
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    textAlign: 'center',
    flexDirection: 'row',
  },
  footerText: {
    color: COLORS.gray,
    fontWeight: 'bold',
  },
  signupBtn: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  wFull: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mr7: {
    marginRight: 7,
    height: 55,
    width: 55,
  },
});
