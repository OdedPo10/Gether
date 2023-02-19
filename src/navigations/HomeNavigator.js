import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, AddFreinds, PickRes, LiveView, PreviewEvent } from '../screens';
import JoinEvent from '../screens/home/joinEvent';
import { ROUTES, COLORS } from '../constants';
import AddFreindsOnLive from './../screens/home/AddFriendsOnLive';

const Stack = createStackNavigator();

function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name={ROUTES.HOME_TAB}
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.JOIN_EVENT}
        component={JoinEvent}
        options={({ route }) => ({
          headerTintColor: COLORS.white,
          headerBackTitle: 'Home',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
        })}
      />
      <Stack.Screen name={ROUTES.PREVIEW_EVENT} component={PreviewEvent} />
      <Stack.Screen name={ROUTES.ADD_FREINDS} component={AddFreinds} />
      <Stack.Screen
        name={ROUTES.ADD_FREINDS_TO_EXISTING}
        component={AddFreindsOnLive}
      />
      <Stack.Screen
        name={ROUTES.PICK_RES}
        component={PickRes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.LIVE_VIEW}
        component={LiveView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
export default HomeNavigator;
