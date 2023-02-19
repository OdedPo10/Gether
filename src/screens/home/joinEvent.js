import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React from 'react';
import { COLORS, ROUTES } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../../context/usersContext';
import { EventContext } from '../../../context/eventContexts';

import { Input } from 'react-native-elements';
import LiveView from './LiveView';

const JoinEvent = () => {
  const navigation = useNavigation();
  const [room, setRoom] = useState('');
  const { enterRoom, changeStatus, event, resetEventState } =
    useContext(EventContext);
  const [shakeAnim] = useState(new Animated.Value(0));
  useEffect(() => {
    console.log(event);
    if (event.roomID) {
      Alert.alert('you are already in event', `would you like to getThere?`, [
        {
          text: 'yes',
          onPress: () => navigation.navigate(ROUTES.LIVE_VIEW),
        },
        {
          text: 'no',
          onPress: () => resetEventState(),
        },
      ]);
    }
  }, []);
  const submitRoom = async (roomID) => {
    let result = await enterRoom(roomID);
    if (result) {
    } else {
      setInput1('');
      setInput2('');
      setInput3('');
      setInput4('');
      setInput5('');
      setInput6('');
      input1Ref.current.focus();
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => shakeAnim.setValue(0));
    }
  };

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');
  const [input5, setInput5] = useState('');
  const [input6, setInput6] = useState('');

  const input1Ref = React.useRef(null);
  const input2Ref = React.useRef(null);
  const input3Ref = React.useRef(null);
  const input4Ref = React.useRef(null);
  const input5Ref = React.useRef(null);
  const input6Ref = React.useRef(null);

  const handleInput1Change = (text) => {
    setInput1(text);
    if (text.length === 1) input2Ref.current.focus();
  };

  const handleInput2Change = (text) => {
    setInput2(text);
    if (text.length === 1) input3Ref.current.focus();
    else if (!text.length) input1Ref.current.focus();
  };

  const handleInput3Change = (text) => {
    setInput3(text);
    if (text.length === 1) input4Ref.current.focus();
    else if (!text.length) input2Ref.current.focus();
  };

  const handleInput4Change = (text) => {
    setInput4(text);
    if (text.length === 1) input5Ref.current.focus();
    else if (!text.length) input3Ref.current.focus();
  };

  const handleInput5Change = (text) => {
    setInput5(text);
    if (text.length === 1) input6Ref.current.focus();
    else if (!text.length) input4Ref.current.focus();
  };

  const handleInput6Change = (text) => {
    setInput6(text);
    if (!text.length) input5Ref.current.focus();
    else if (text) {
      setRoom(input1 + input2 + input3 + input4 + input5 + text);
      submitRoom(
        input1 +
          input2 +
          input3 +
          input4.toLowerCase() +
          input5.toLowerCase() +
          text.toLowerCase()
      );
    }
  };

  const handleKeyPress = (ref, text) => {
    if (text.length === 0) ref.current.focus();
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <Text style={styles.loginContinueTxt2}>
          There is a <Text style={styles.brandName}>Gether</Text>ing happen's
          without you, Join now !
        </Text>
        <Text style={styles.loginContinueTxt}>Please enter your event ID</Text>
        <Animated.View
          style={[
            {
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-evenly',
            },
            {
              transform: [
                {
                  translateX: shakeAnim.interpolate({
                    inputRange: [
                      0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8,
                      0.9, 1,
                    ],
                    outputRange: [
                      -5, -10, -15, -10, -5, 0, 5, 10, 15, 10, 5, 0,
                    ],
                  }),
                },
              ],
            },
          ]}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-evenly',
            }}>
            <TextInput
              placeholder="X"
              ref={input1Ref}
              maxLength={1}
              value={input1}
              keyboardType="number-pad"
              onChangeText={handleInput1Change}
              onKeyPress={({ nativeEvent: { key } }) =>
                handleKeyPress(input1Ref, input1)
              }
              style={styles.input}
            />
            <TextInput
              placeholder="X"
              ref={input2Ref}
              maxLength={1}
              value={input2}
              keyboardType="number-pad"
              onChangeText={handleInput2Change}
              onKeyPress={({ nativeEvent: { key } }) =>
                handleKeyPress(input2Ref, input2)
              }
              style={styles.input}
            />
            <TextInput
              placeholder="X"
              ref={input3Ref}
              maxLength={1}
              value={input3}
              keyboardType="number-pad"
              onChangeText={handleInput3Change}
              onKeyPress={({ nativeEvent: { key } }) =>
                handleKeyPress(input3Ref, input3)
              }
              style={styles.input}
            />
            <TextInput
              placeholder="X"
              ref={input4Ref}
              maxLength={1}
              value={input4}
              onChangeText={handleInput4Change}
              onKeyPress={({ nativeEvent: { key } }) =>
                handleKeyPress(input4Ref, input4)
              }
              style={styles.input}
            />
            <TextInput
              placeholder="X"
              ref={input5Ref}
              maxLength={1}
              value={input5}
              onChangeText={handleInput5Change}
              onKeyPress={({ nativeEvent: { key } }) =>
                handleKeyPress(input5Ref, input5)
              }
              style={styles.input}
            />
            <TextInput
              placeholder="X"
              ref={input6Ref}
              maxLength={1}
              value={input6}
              onChangeText={handleInput6Change}
              onKeyPress={({ nativeEvent: { key } }) =>
                handleKeyPress(input6Ref, input6)
              }
              style={styles.input}
            />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default JoinEvent;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnWrapper: {
    backgroundColor: COLORS.primary,
    height: 120,
    marginTop: 12,
    // borderRadius: '50%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 80,
    justifyContent: 'center',
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
  wFull: {
    width: '100%',
  },
  brandName: {
    fontSize: 42,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.primary,
    opacity: 0.9,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 0,
    // borderRadius: 5,
    height: 60,
    paddingVertical: 0,
    fontSize: 40,
    fontWeight: '500',
    marginBottom: 40,
  },
  loginContinueTxt: {
    fontSize: 21,
    textAlign: 'center',
    color: COLORS.gray,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  loginContinueTxt2: {
    fontSize: 21,
    textAlign: 'center',
    color: COLORS.gray,
    marginBottom: 16,
    fontWeight: 'bold',
    bottom: '15%',
  },
});
