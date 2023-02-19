import axios from 'axios';
import React from 'react';
import { ROUTES } from '../src/constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useContext } from 'react';
import { UserContext } from './usersContext';

import { Alert } from 'react-native';
import { clockRunning } from 'react-native-reanimated';
export const EventContext = React.createContext('');

const EventProvider = ({ children }) => {
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [event, setEvent] = useState({
    resName: '',
    rating: '',
    resLink: '',
    resLng: '',
    resLat: '',
    resImageUrl: '',
    users: [],
  });
  const [type, setType] = useState('');

  //! functions
  // clear state
  const resetEventState = () => {
    setEvent({
      resName: '',
      rating: '',
      resLink: '',
      resLng: '',
      resLat: '',
      resImageUrl: '',
      users: [],
    });
  };
  //* pick users from db to add to the event
  const addFriends = async (users) => {
    if (users.length > 0) {
      let temp = event;
      let result = await axios.post(
        `https://gethersocketserver.onrender.com/users/getusers`,
        users
      );
      temp.users = result.data;

      setEvent(temp);
      return true;
    } else {
      return false;
    }
  };
  //* pick the resturant for the event
  const createEvent = async (resturant) => {
    if (
      resturant.name &&
      resturant.rating &&
      resturant.web_url &&
      resturant.photo.images.small
    ) {
      let temp = {
        resName: '',
        rating: '',
        resLink: '',
        resLng: '',
        resLat: '',
        resImageUrl: '',
        users: event.users,
        usersStatus: [],
        cuisine: [],
        address: '',
      };
      if (resturant.cuisine.length > 1) {
        temp.resName = resturant.name;
        temp.rating = resturant.rating;
        temp.resLink = resturant.web_url;
        temp.resLat = resturant.latitude;
        temp.resLng = resturant.longitude;
        temp.resImageUrl = resturant.photo.images.original.url;
        temp.cuisine = [resturant.cuisine[0].name, resturant.cuisine[1].name];
        temp.users = temp.users.map((user) => user._id);
        temp.users.map((user, index) => {
          if (index == temp.users.length - 1) temp.usersStatus.push('approved');
          else temp.usersStatus.push('pending');
        });
        temp.address = resturant.address;
      } else {
        temp.resName = resturant.name;
        temp.rating = resturant.rating;
        temp.resLink = resturant.web_url;
        temp.resLat = resturant.latitude;
        temp.resLng = resturant.longitude;
        temp.resImageUrl = resturant.photo.images.original.url;
        temp.users = temp.users.map((user) => user._id);
        temp.users.map((user, index) => {
          if (index == temp.users.length - 1) temp.usersStatus.push('approved');
          else temp.usersStatus.push('pending');
        });
        temp.address = resturant.address;
      }

      try {
        let result = await axios.post(
          `https://gethersocketserver.onrender.com/events`,
          temp
        );

        let body = 'Join : ';
        result.data.users.map((user) => {
          body = body + user.name + ', ';
        });
        body =
          body +
          'for a wonderful time at: ' +
          result.data.resName +
          '! youre room ID is : ' +
          result.data.roomID;
        result.data.users.map((friend, index) => {
          if (friend._id != user._id) {
            if (user.expoToken != 'no token provided') {
              let message = {
                to: friend.expoToken,
                sound: 'default',
                title: 'You were invited to a meal!',
                body: body,
                data: { someData: 'goes here' },
              };
              sendPushNotification(message);
            }
          }
        });

        setEvent(result.data);
        return true;
      } catch (error) {
        console.log('server problem' + ' ---------' + error);
        return false;
      }
    } else {
      console.log('not the correct resturant values');
      return false;
    }
  };
  //*delet the event
  const deleteEvent = async (id) => {
    try {
      let result = await axios.delete(
        `https://gethersocketserver.onrender.com/events` + '/' + id
      );
      if (result.data == 'event was deleted') {
        setEvent({
          resName: '',
          rating: '',
          resLink: '',
          resLng: '',
          resLat: '',
          resImageUrl: '',
          users: [],
        });
        Alert.alert('event was secsesfuly deleted');
        return true;
      } else return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  //* join an event that already eexist
  const enterRoom = async (roomId) => {
    try {
      let result = await axios.get(
        `https://gethersocketserver.onrender.com/events` + '/' + roomId
      );
      let exist = result.data.users.findIndex(
        (frined) => frined._id == user._id
      );

      if (exist !== -1) {
        setEvent(result.data);
        await sleep(500);
        navigation.navigate(ROUTES.PREVIEW_EVENT);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  //* update user status in mongo
  const acceptEvent = async (decision) => {
    try {
      if (decision == 'approved') {
        let answer = await changeStatus(event._id, user._id, 'approved');
        if (answer) {
          await sleep(500);
          navigation.navigate(ROUTES.LIVE_VIEW);
          return true;
        }
      } else {
        let answer = await changeStatus(event._id, user._id, 'disapproved');
        setEvent({
          resName: '',
          rating: '',
          resLink: '',
          resLng: '',
          resLat: '',
          resImageUrl: '',
          users: [],
        });
        await sleep(500);
        navigation.navigate(ROUTES.HOME_TAB);
      }
    } catch (error) {
      console.log('accept event error : ' + error);
    }
  };
  //* change user status in event
  const changeStatus = async (eventId, userId, status) => {
    try {
      let dataToSend = {
        eventId,
        userId,
        status,
      };
      let result = await axios.put(
        `https://gethersocketserver.onrender.com/events/status`,
        dataToSend
      );

      setEvent(result.data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  //* refresh evnt fron data base
  const refreshEvent = async (roomId) => {
    try {
      let result = await axios.get(
        `https://gethersocketserver.onrender.com/events` + '/' + roomId
      );

      let exist = result.data.users.findIndex(
        (frined) => frined._id == user._id
      );

      if (exist !== -1) {
        setEvent(result.data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  //* remove user from event
  const removeUser = async (userID, roomID) => {
    let url =
      `https://gethersocketserver.onrender.com/events` + '/remove/' + roomID;
    let result = await axios.post(url, { userID });
    console.log(result.data);
    if (
      result.data == 'couldnt find user' ||
      result.data == 'couldnt find event'
    ) {
      console.log('couldnt finish the deletion');
      return false;
    } else {
      console.log('userID: ' + userID);
      console.log('user>_id: ' + user._id);
      if (userID == user._id) {
        setEvent(result.data);
        navigation.navigate(ROUTES.HOME_TAB);
        Alert.alert('You are no longer a participant in this event ');
        return true;
      } else {
        setEvent(result.data);
        return true;
      }
    }
  };
  //* add users to existing event
  const addFriendsToExisting = async (users, eventID) => {
    console.log(users);
    try {
      let url = `https://gethersocketserver.onrender.com/events/` + eventID;
      console.log(eventID);
      console.log(users);
      let result = await axios.put(url, users);
      console.log('-----');
      console.log(result);
      if (result.data == 'couldnt find users or event') {
        console.log('couldnt find users or event');
        return false;
      } else {
        setEvent(result.data);
        await sleep(500);
        navigation.navigate(ROUTES.LIVE_VIEW);
      }
      return 'ok';
    } catch (error) {
      console.log(error.message);
    }
  };
  //!---------------

  return (
    <EventContext.Provider
      value={{
        changeStatus,
        event,
        enterRoom,
        deleteEvent,
        acceptEvent,
        createEvent,
        addFriends,
        refreshEvent,
        removeUser,
        resetEventState,
        addFriendsToExisting,
      }}>
      {children}
    </EventContext.Provider>
  );
};
export default EventProvider;

const sendPushNotification = async (message) => {
  await axios
    .post('https://exp.host/--/api/v2/push/send', message, {
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
