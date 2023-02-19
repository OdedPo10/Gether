import SelectDropdown from 'react-native-select-dropdown';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import { useContext } from 'react';
import { COLORS } from '../../../constants';
import { UserContext } from '../../../../context/usersContext';
import { EventContext } from '../../../../context/eventContexts';
const SelectButtonForTransport = ({ eventExist }) => {
  const transportTypes = ['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'];
  const [travelMode, setTravelMode] = useState('WALKING');
  const { changeUserTransportMode, user } = useContext(UserContext);
  const { event, refreshEvent } = useContext(EventContext);

  const submitMode = async () => {
    console.log(eventExist);
    if (eventExist == true) {
      console.log('started');
      await changeUserTransportMode(travelMode);
      await refreshEvent(event.roomID);
      console.log('ended');
    } else {
      let answer = await changeUserTransportMode(travelMode);
    }
  };
  return (
    <>
      <SelectDropdown
        data={transportTypes}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem);
          setTravelMode(selectedItem);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        defaultButtonText={user.transportMode}
        dropdownStyle={{
          width: '35%',
          borderRadius: '5%',
        }}
        buttonStyle={{
          width: '110%',
          borderRadius: '5%',
        }}
        buttonTextStyle={{
          fontSize: 16,
          textAlign: 'center',
          fontWeight: '700',
          color: COLORS.dark,
          opacity: 0.9,
        }}
        rowTextStyle={{
          fontSize: 15,
          textAlign: 'center',
          fontWeight: '400',
          color: COLORS.dark,
          opacity: 0.9,
        }}
      />
      <TouchableOpacity onPress={() => submitMode()}>
        <Text style={styles.signupBtn}>Change Mode</Text>
      </TouchableOpacity>
    </>
  );
};

export default SelectButtonForTransport;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  selectTransportDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    padding: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectTransportText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.primary,
    opacity: 0.9,
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
    fontSize: 32,
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
    // borderRadius: 5,
    height: 55,
    paddingVertical: 0,
  },

  loginBtnWrapper: {
    backgroundColor: COLORS.primary,
    height: 55,
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
  },
  linearGradient: {
    width: '100%',
    // borderRadius: 50,
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
  row: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignItems: 'center',
  },
});
