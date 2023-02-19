import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Login, ForgotPassword, Register, ResetPassword } from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROUTES, COLORS } from '../constants';
import HomeNavigator from './HomeNavigator';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../context/usersContext';
import jwtdecode from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';

function AuthNavigator() {
  const Stack = createStackNavigator();
  const { user, validateId } = useContext(UserContext);

  const navigation = useNavigation();
  // useEffect(() => {
  //   AsyncStorage.getItem("token")
  //     .then(async (res) => {
  //       if (res) {
  //         const decoded = jwtdecode(res);
  //         if (await validateId(decoded._id)) {
  //           navigation.navigate(ROUTES.HOME);
  //         } else {
  //           navigation.navigate(ROUTES.LOGIN);
  //         }
  //       } else {
  //         console.log("no token provided");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);
  return (
    <Stack.Navigator screenOptions={{}} initialRouteName={ROUTES.LOGIN}>
      <>
        {!user ? (
          <>
            <Stack.Screen
              name={ROUTES.LOGIN}
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={ROUTES.FORGOT_PASSWORD}
              component={ForgotPassword}
              options={({ route }) => ({
                headerTintColor: COLORS.white,
                headerBackTitle: 'Back',
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
              })}
            />
            <Stack.Screen
              name={ROUTES.RESET_PASSWORD}
              component={ResetPassword}
              options={({ route }) => ({
                headerTintColor: COLORS.white,
                headerBackTitle: 'Back',
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
              })}
            />
            <Stack.Screen
              name={ROUTES.REGISTER}
              component={Register}
              options={({ route }) => ({
                headerTintColor: COLORS.white,
                headerBackTitle: 'Back',
                headerStyle: {
                  backgroundColor: COLORS.primary,
                },
              })}
            />
          </>
        ) : (
          <Stack.Screen
            name={ROUTES.HOME}
            component={HomeNavigator}
            options={{ headerShown: false }}
          />
        )}
      </>
    </Stack.Navigator>
  );
}
export default AuthNavigator;
