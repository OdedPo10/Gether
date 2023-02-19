import axios from 'axios';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { ROUTES, COLORS } from '../src/constants';
import { useNavigation } from '@react-navigation/native';
import jwtdecode from 'jwt-decode';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export const UserContext = React.createContext('');

const UserProvider = ({ children }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [userIDforreset, setuserIDforreset] = useState('');
  const [finished, setFinished] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [deviceLocaition, setDevicelocaition] = useState({
    latitude: 32.089844,
    longitude: 34.809876,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // ? for locaition

  async function getDeviceLocaition() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Allow the app to use location service.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;

      let temp = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      console.log(temp);
      return temp;
    }
  }

  //? for validate log in
  useEffect(() => {
    AsyncStorage.getItem('token')
      .then((res) => {
        if (res) {
          const decoded = jwtdecode(res);
          validateId(decoded._id);
        } else {
          console.log('no token provided');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //? for notificaition
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  useEffect(() => {
    // registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  //? notificaition

  //! authentication
  const login = async (data) => {
    try {
      let deviceToken = await registerForPushNotificationsAsync();

      let result = await axios.post(
        `https://gethersocketserver.onrender.com/users/login`,
        {
          data,
          deviceToken,
        }
      );

      if (result.data) {
        setUser(result.data);

        let answer = await updateUserLocaition(result.data._id);

        result = await axios.post(
          `https://gethersocketserver.onrender.com/users/login`,
          {
            data,
            deviceToken,
          }
        );

        setUser(result.data);
        setFinished(true);

        AsyncStorage.setItem('token', result.headers['x-auth-token']);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  const validateId = async (id) => {
    try {
      let deviceToken = await registerForPushNotificationsAsync();
      let fullUrl =
        `https://gethersocketserver.onrender.com/users/validate/` + id;

      let result = await axios.post(fullUrl, { deviceToken });
      if (result.data) {
        setUser(result.data);
        AsyncStorage.setItem('token', result.headers['x-auth-token']);
        let answer = await updateUserLocaition(id);
        setFinished(true);
        console.log('user locaition updated');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const signUp = async (data, file, transport) => {
    //! check password

    try {
      if (data.password1 == data.password2) {
        let deviceToken = await registerForPushNotificationsAsync();
        const finalUser = {
          name: data.firstName + ' ' + data.lastName,
          email: data.email,
          phone: data.phone,
          courentLat: deviceLocaition != '' ? deviceLocaition.lat : '',
          courentLng: deviceLocaition != '' ? deviceLocaition.lng : '',
          password: data.password1,
          fileStr: file,
          expoToken: deviceToken,
          transportMode: transport,
        };
        console.log(finalUser);
        let result = await axios.post(
          `https://gethersocketserver.onrender.com/users/signup`,
          finalUser
        );
        if (result.data) {
          setUser(result.data);
          AsyncStorage.setItem('token', result.headers['x-auth-token']);
          let answer = await updateUserLocaition(result.data._id);
          setFinished(true);
          return true;
        } else {
          return false;
        }
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  //!----
  const signOut = () => {
    AsyncStorage.removeItem('token')
      .then((res) => {
        setFinished(false);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setUser('');
    navigation.navigate(ROUTES.LOGIN);
  };
  const getAllUsers = async () => {
    try {
      let result = await axios.get(
        `https://gethersocketserver.onrender.com/users`
      );
      if (result.data.length > 0) return result.data;
      else return false;
    } catch (err) {
      console.log(err);
    }
  };
  const checkMail = async (mail) => {
    try {
      let url = `https://gethersocketserver.onrender.com/users/bymail/${mail}`;
      let result = await axios.get(url);
      if (result.data != 'user does not exist') {
        console.log(result.data);
        setuserIDforreset(result.data._id);
        return result.data._id;
      } else return false;
    } catch (error) {
      console.log('catch error' + error.message);
    }
  };
  const updateUserLocaition = async (id, locaition = '') => {
    if (!locaition) {
      locaition = await getDeviceLocaition();
      let url = `https://gethersocketserver.onrender.com/users/` + id;
      let result = await axios.put(url, locaition);

      return result.data;
    } else {
      let url = `https://gethersocketserver.onrender.com/users/` + id;
      let result = await axios.put(url, locaition);
    }
  };
  const changePassword = async (password, userID) => {
    try {
      let url = `https://gethersocketserver.onrender.com/users/password/${userID}`;
      let result = await axios.put(url, { password });
      if (result.data == 'password was changed') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('password cahnge erroe:  ' + error);
    }
  };
  const changeUserTransportMode = async (transportMode) => {
    try {
      let url = `https://gethersocketserver.onrender.com/users/transport/${user._id}`;
      let result = await axios.put(url, { transportMode });
      if (result.data == 'cant change type') {
        return false;
      } else {
        setUser(result.data);
        return true;
      }
    } catch (error) {
      console.log('cant cahnge transport:  ' + error);
    }
  };
  //!---------------
  return (
    <UserContext.Provider
      value={{
        user,
        finished,
        userIDforreset,
        deviceLocaition,
        login,
        sleep,
        signUp,
        signOut,
        signOut,
        checkMail,
        validateId,
        getAllUsers,
        changePassword,
        updateUserLocaition,
        changeUserTransportMode,
        getDeviceLocaition,
      }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log(status);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return 'no token provided';
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log('only real device my friend !!');
    return 'no token provided';
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
