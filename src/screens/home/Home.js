import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import React from 'react';
import { COLORS, ROUTES } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../../context/usersContext';

import SelectButtonForTransport from './small/selectTransportMethod';
import { EventContext } from '../../../context/eventContexts';
const Home = () => {
  const { signOut, user, sleep } = useContext(UserContext);

  const [visible, setVisible] = useState(false);

  const navigation = useNavigation();
  return (
    <>
      {user ? (
        <View style={styles.container}>
          <View style={styles.wFull}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.navBtn}
              onPress={() => setVisible(true)}>
              <View style={styles.line2} />
              <View style={styles.line2} />
              <View style={styles.line2} />
            </TouchableOpacity>
            <View style={styles.loginBtnWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.JOIN_EVENT)}
                activeOpacity={0.7}
                style={styles.loginBtn}>
                <Image
                  source={require('../../assets/JoinEvent2.jpeg')}
                  style={{ height: '100%', width: '100%', borderRadius: '5%' }}
                />
                <Text style={styles.futureEventText}>Join event</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.loginBtnWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.ADD_FREINDS)}
                activeOpacity={0.7}
                style={styles.loginBtn}>
                <Image
                  source={require('../../assets/InstantEvent2.webp')}
                  style={{ height: '100%', width: '100%', borderRadius: '5%' }}
                />
                <Text style={styles.futureEventText}>Create Instant event</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.loginBtnWrapper}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={signOut}
                style={styles.loginBtn}>
                <Image
                  source={require('../../assets/FutureEvent2.jpeg')}
                  style={{ height: '100%', width: '100%', borderRadius: '5%' }}
                />
                <Text style={styles.futureEventText}>Create Future event</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            style={styles.modalStyle}>
            <View style={styles.sideBarDiv}>
              <View style={styles.sideBarContext}>
                <View style={styles.userHeader}>
                  <View style={styles.circle3}>
                    <Image
                      source={{ uri: user.imageUrl }}
                      style={styles.profilePic3}
                    />
                  </View>
                </View>
                <View style={styles.userNameDiv}>
                  <Text style={styles.userName}>{user.name}</Text>
                </View>
                <View style={styles.sideBarButtons}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.sideBarTouchable}
                    onPress={() => {
                      setVisible(false);

                      navigation.navigate(ROUTES.JOIN_EVENT);
                    }}>
                    <Text style={styles.sideBarText}>Join event</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.sideBarTouchable}
                    onPress={() => {
                      setVisible(false);

                      navigation.navigate(ROUTES.HOME_TAB);
                    }}>
                    <Text style={styles.sideBarText}>Home Page</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.sideBarTouchable}>
                    <Text style={styles.sideBarText}>future event</Text>
                  </TouchableOpacity>
                  <View style={{}}>
                    <SelectButtonForTransport />
                  </View>
                  <TouchableOpacity
                    onPress={signOut}
                    activeOpacity={0.7}
                    style={styles.sideBarTouchable && { marginTop: '70%' }}>
                    <Text style={styles.sideBarText}>sign out</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.navBtnModal}
                onPress={() => setVisible(false)}>
                <View style={styles.line2} />
                <View style={styles.line2} />
                <View style={styles.line2} />
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      ) : (
        <Text>wait pls ..</Text>
      )}
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: '100%',
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnWrapper: {
    height: 230,
    borderRadius: '50%',
    shadowColor: '#000',
    elevation: 5,
    marginBottom: 30,
    justifyContent: 'center',
  },
  loginBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 230,
    borderRadius: '50%',
  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '400',
  },
  wFull: {
    width: '100%',
    marginTop: '20%',
  },
  brandName: {
    fontSize: 42,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.white,
    opacity: 0.9,
  },
  modalStyle: {
    backfaceVisibility: 'visible',
    backgroundColor: 'transparent',
    width: '50%',
  },
  profilePic3: {
    height: 75,
    width: 75,
    borderRadius: 50,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 2.5,
  },
  sideBarDiv: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  sideBarContext: {
    backgroundColor: 'white',
    width: '40%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  userHeader: {
    backgroundColor: COLORS.primary,
    height: '18.2%',
    width: '100%',
    alignItems: 'center',
  },
  circle4: {
    height: 85,
    width: 85,
    backgroundColor: 'white',
    borderRadius: 50,
    // marginLeft: 45,
    marginTop: 55,
  },
  sideBarTouchable: {
    height: '13%',
    width: '100%',
  },
  userNameDiv: {
    marginTop: '20%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: '5%',
    color: 'black',

    shadowColor: 'white',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  sideBaruserName: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: '5%',
    marginLeft: '20%',
    color: 'black',
    position: 'absolute',
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  sideBarButtons: {
    marginTop: '50%',
    marginRight: '8%',
    width: '80%',
  },
  sideBarText: {
    color: COLORS.gray,
    fontSize: 20,
    fontWeight: '600',
  },
  navBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    height: 40,
    marginLeft: '83%',
    top: '-5.7%',
    backgroundColor: 'white',
    borderRadius: '8%',
  },
  navBtnModal: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '14.1%',
    height: 40,
    marginLeft: '40.65%',
    top: '10.75%',
    backgroundColor: 'white',
    borderRadius: '8%',
  },
  line2: {
    width: 35,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 2,
    borderRadius: 2,
  },
  futureEventText: {
    fontFamily: 'oleo',
    color: 'white',
    position: 'absolute',
    fontSize: 45,
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  circle3: {
    height: 85,
    width: 85,
    backgroundColor: 'white',
    borderRadius: 50,
    // marginLeft: 45,
    marginTop: 130,
  },
});
{
  /* <Modal visible={visible} animationType="fade" transparent={true} style={styles.modalStyle}>
  <View style={styles.sideBarDiv}>
    <View style={styles.sideBarContext}>
      <View style={styles.userHeader}>
        <Text
          style={{
            color: "white",
            marginRight: "30%",
            marginTop: "30%",
            width: 100,
            fontWeight: "600",
          }}
        >
          Better2Gether
        </Text>
        <View style={styles.circle4}>
          <Image source={{ uri: user.imageUrl }} style={styles.profilePic3} />
        </View>
      </View>
      <View style={styles.userNameDiv}>
        <Text style={styles.sideBaruserName}>{user.name}</Text>
      </View>
      <View style={styles.sideBarButtons}>
        <TouchableOpacity activeOpacity={0.7} style={styles.sideBarTouchable} onPress={() => navigation.navigate(ROUTES.JOIN_EVENT)}>
          <Text style={styles.sideBarText}>Join event</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.sideBarTouchable} onPress={() => navigation.navigate(ROUTES.ADD_FREINDS)}>
          <Text style={styles.sideBarText}>instant event</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.sideBarTouchable}>
          <Text style={styles.sideBarText}>future event</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signOut} activeOpacity={0.7} style={styles.sideBarTouchable && { marginTop: "70%" }}>
          <Text style={styles.sideBarText}>sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
    <TouchableOpacity activeOpacity={0.7} style={styles.navBtnModal} onPress={() => setVisible(false)}>
      <View style={styles.line2} />
      <View style={styles.line2} />
      <View style={styles.line2} />
    </TouchableOpacity>
  </View>
</Modal>; */
}
