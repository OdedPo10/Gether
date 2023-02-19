//!-------------
//!
//? 553eiy
//? 065srb
//? 32.074463, 34.801550
//? 32.064825, 34.768419
//? 32.064244, 34.852018
//?32.102205, 34.789019
//  parseFloat(usersLocaition[friend._id].latitude) parseFloat(usersLocaition[friend._id].longitude)
//!
//!------------------
import React, { useState, useRef, useEffect, createRef } from 'react';
import data from '../../../data';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker } from 'react-native-maps';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clockRunning,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontiso from 'react-native-vector-icons/Fontisto';
import { Keyframe } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { COLORS, ROUTES } from '../../constants';
import { ThemeProvider, useNavigation } from '@react-navigation/native';
import { EventContext } from '../../../context/eventContexts';
import { UserContext } from '../../../context/usersContext';
import io from 'socket.io-client';
import { GOOGLE_API_key } from '@env';
import { reverseGeocodeAsync } from 'expo-location';
import { useContext } from 'react';
import SelectButtonForTransport from './small/selectTransportMethod';
const socket = io.connect(`https://gethersocketserverreal.onrender.com`);

export default function LiveView() {
  const navigation = useNavigation();
  const {
    sleep,
    event,
    createEvent,
    refreshEvent,
    removeUser,
    deleteEvent,
    resetEventState,
  } = useContext(EventContext);
  const [usersAdress, setUsersAdress] = useState([]);
  const [usersLocaition, setUsersLocaition] = useState('');
  const [usersTiming, setUsersTiming] = useState({});

  const { user, updateUserLocaition, deviceLocaition, signOut } =
    useContext(UserContext);
  const colors = [
    '#390099',
    '#9E0059',
    '#FFBD00',
    '#FF5400',
    '#31572C',
    '#511730',
    '#FB6F92',
    '#48CAE4',
    '#E63946',
    '#BDB246',
    '5F0F40',
  ];
  const [expanded, setExpanded] = useState(false);
  const [frindVisable, setfrindVisable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [info, setinfo] = useState(true);
  const randomArray = [
    { latitude: 32.074717, longitude: 34.768848 },
    { latitude: 32.067153, longitude: 34.77829 },
    { latitude: 32.065679, longitude: 34.798774 },
    { latitude: 32.073098, longitude: 34.800877 },
    { latitude: 32.085752, longitude: 34.810704 },
    { latitude: 32.090951, longitude: 34.803795 },
    { latitude: 32.090988, longitude: 34.796757 },
    { latitude: 32.088842, longitude: 34.782895 },
    { latitude: 32.084879, longitude: 34.772467 },
    { latitude: 32.07997, longitude: 34.769763 },
    { latitude: 32.073461, longitude: 34.765986 },
  ];
  //Calculate the distance between users to location
  function getDistance(coord1, coord2) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    let lat1 = parseFloat(coord1.latitude);
    let lon1 = parseFloat(coord1.longitude);
    let lat2 = parseFloat(coord2.latitude);
    let lon2 = parseFloat(coord2.longitude);

    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    lat1 = toRadians(lat1);
    lat2 = toRadians(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
  function generateRandomLocaition() {
    let random = Math.random() * 10;
    chaneglocaition(randomArray[Math.floor(random)]);
  }
  const mapRef = useRef();
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, -SCREEN_HEIGHT / 10); // was 10
    })
    .onEnd(() => {
      if (translateY.value > 0) {
        translateY.value = withSpring(SCREEN_HEIGHT / 4.5, { damping: 30 });
      } else {
        translateY.value = withSpring(-SCREEN_HEIGHT / 18, { damping: 30 }); // was  18
      }
    });
  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  const pressModal = () => {
    setExpanded(!expanded);
    setinfo(!info);
  };
  const getAdress = async () => {
    let temp = [];
    for (let i = 0; i < event.users.length; i++) {
      let result = await reverseGeocodeAsync({
        latitude: event.users[i].courentLat,
        longitude: event.users[i].courentLng,
      });
      temp.push(
        `${result[0].streetNumber} ${result[0].street}, ${result[0].city},${result[0].isoCountryCode}`
      );
    }

    return temp;
  };
  const getuserscards = (friend, index) => {
    return (
      <View style={styles.expandedDiv}>
        <View>
          <MaterialIcons name="my-location" style={styles.myLocation} />
          <View style={styles.verticalLine}></View>
          <MaterialIcons name="location-on" style={styles.myDestination} />
        </View>
        <View style={styles.curLoc}>
          <Text style={styles.curLocText}>{usersAdress[index]}</Text>
        </View>
        <View style={styles.resLoc}>
          <Text style={styles.resLocText}>{event.address}</Text>
        </View>
        <View style={styles.midContainer}>
          <View style={styles.smallContainer}>
            <View style={styles.headersDiv}>
              <Text style={styles.headerDisText}>DISTANCE</Text>
              <Text style={styles.headerTimeText}>ESTIMATED</Text>
            </View>
            <View style={styles.infoDiv}>
              <Text style={styles.infoDisText}>
                {parseFloat(usersTiming[friend._id].distance).toFixed(2)}
              </Text>
              <Text style={styles.infoTimeText}>
                {getusertime(usersTiming[friend._id].duration)}
              </Text>
            </View>
          </View>
          {friend._id == user._id ? (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.uninviteBut}
              onPress={() => {
                pressModal();
                setfrindVisable(!frindVisable);
                Alert.alert(
                  'You are going to leave my friend',
                  `This action will remove ${user.name} from the event`,
                  [
                    {
                      text: 'Remove',
                      onPress: () => removeUser(user._id, event.roomID),
                    },
                    { text: 'Cancel' },
                  ]
                );
              }}>
              <Text style={styles.uninviteButText}>leave</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.uninviteBut}
              onPress={() => {
                pressModal();
                setfrindVisable(!frindVisable);
                Alert.alert(
                  'You are going to make some one sad!!',
                  `This action will remove ${friend.name} from the event`,
                  [
                    {
                      text: 'Remove',
                      onPress: () => removeUser(friend._id, event.roomID),
                    },
                    { text: 'Cancel' },
                  ]
                );
              }}>
              <Text style={styles.uninviteButText}>Uninvite</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  const getusertime = (usertime) => {
    let currentTime = new Date(Date.now());

    let newTime = new Date(currentTime.getTime() + usertime * 60 * 1000);
    let hours = newTime.getHours();
    let minutes = newTime.getMinutes();
    if (hours % 10 == hours) {
      if (minutes % 10 == minutes) {
        return '0' + hours + ':' + '0' + minutes;
      } else {
        return '0' + hours + ':' + minutes;
      }
    } else {
      if (minutes % 10 == minutes) {
        return hours + ':' + '0' + minutes;
      } else {
        return hours + ':' + minutes;
      }
    }
  };
  // ! USE EFFECTS
  useEffect(() => {
    translateY.value = withSpring(SCREEN_HEIGHT / 4.5);

    if (event.users.length > 0) {
      async function a() {
        let temp = await getAdress();
        setUsersAdress(temp);
      }
      a();
    }
  }, []);
  useEffect(() => {
    socket.emit('join_room', event.roomID);
    socket.on('refresh_event', async () => {
      await refreshEvent(event.roomID);
    });
    socket.on('event_was_deleted', () => {
      resetEventState();
      navigation.navigate(ROUTES.HOME_TAB);
      Alert.alert(`this event was deleted by ${data.name} `);
    });
    return () => {
      socket.emit('leave_room', {
        room: event.roomID,
      });
    };
  }, [socket]);

  //! open this use efect andd and see a world of posibilities!
  //* realy !
  //? try it !

  useEffect(() => {
    const interval = setInterval(() => generateRandomLocaition(), 20000);

    return () => clearInterval(interval);
  }, []);
  //?FUNCTIONS
  const chaneglocaition = async (locaition) => {
    await updateUserLocaition(user._id);
    await refreshEvent(event.roomID);
    socket.emit('mongo_was_updated', { roomID: event.roomID });
  };
  const deleteTheCourentEvent = async () => {
    socket.emit('user_deleted_event', {
      roomID: event.roomID,
      userName: user.name,
    });
    let result = await deleteEvent(event._id);
    if (!result) Alert.alert('failed to delete the event');
    else {
      navigation.navigate(ROUTES.HOME_TAB);
    }
  };

  return (
    <>
      {event.resName && (
        <View style={styles.container}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(event.resLat),
              longitude: parseFloat(event.resLng),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            {event
              ? event.users.map((friend, i) => {
                  return (
                    <>
                      <Marker
                        coordinate={{
                          latitude: parseFloat(friend.courentLat),
                          longitude: parseFloat(friend.courentLng),
                        }}>
                        <View style={styles.circle}>
                          <Image
                            source={{ uri: friend.imageUrl }}
                            style={styles.profilePic}
                          />
                        </View>
                      </Marker>
                      <MapViewDirections
                        origin={{
                          latitude: parseFloat(friend.courentLat),
                          longitude: parseFloat(friend.courentLng),
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                        destination={{
                          latitude: parseFloat(event.resLat),
                          longitude: parseFloat(event.resLng),
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0421,
                        }}
                        apikey={GOOGLE_API_key}
                        strokeWidth={3}
                        strokeColor={colors[i]}
                        mode={friend.transportMode}
                        optimizeWaypoints={true}
                        onReady={(result) => {
                          let temp = usersTiming;

                          temp[friend._id] = {
                            duration: result.duration,
                            distance: result.distance,
                          };
                          setUsersTiming(temp);
                        }}
                      />
                    </>
                  );
                })
              : ''}

            <Marker
              coordinate={{
                latitude: parseFloat(event.resLat),
                longitude: parseFloat(event.resLng),
              }}>
              <View style={styles.circle}>
                <Image
                  source={{ uri: event.resImageUrl }}
                  style={styles.profilePic}
                />
              </View>
            </Marker>
          </MapView>

          <View style={styles.bigContainer}>
            <View style={{ display: 'flex', flexDirection: 'row', top: '4%' }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.frindBtn}
                onPress={() => setfrindVisable(!frindVisable)}>
                <Image
                  source={require('../../assets/frinds.png')}
                  style={{ height: '80%', width: '80%' }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.navBtn}
                onPress={() => setVisible(true)}>
                <View style={styles.line2} />
                <View style={styles.line2} />
                <View style={styles.line2} />
              </TouchableOpacity>
            </View>
            {frindVisable ? (
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                snapToInterval={400}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContainer}>
                <View style={styles.cardContainer}>
                  {event
                    ? event.users.map((friend, index) => {
                        let statusIcon = '';
                        let statusStyle = '';
                        let circleStyle = '';

                        if (event.usersStatus[index] === 'approved') {
                          statusIcon = 'like';
                          statusStyle = 'status1';
                          circleStyle = 'circle1';
                        } else if (event.usersStatus[index] === 'disapproved') {
                          statusIcon = 'dislike';
                          statusStyle = 'status2';
                          circleStyle = 'circle2';
                        } else {
                          statusIcon = 'hourglass-start';
                          statusStyle = 'status3';
                          circleStyle = 'circle3';
                        }
                        let icon = 'walking';
                        switch (friend.transportMode) {
                          case 'DRIVING':
                            icon = 'car-side';
                            break;
                          case 'BICYCLING':
                            icon = 'bicycle';
                            break;
                          case 'TRANSIT':
                            icon = 'train';
                            break;
                        }
                        return (
                          <>
                            <TouchableWithoutFeedback
                              onPress={() => pressModal()}>
                              <View
                                style={[
                                  styles.card,
                                  expanded && styles.cardExpanded,
                                ]}>
                                {/* <FontAwesome5
                            name={icon}
                            style={{
                              color: 'grey',
                              fontSize: 25,
                              fontWeight: '100',
                            }}
                          /> */}
                                <View style={styles[circleStyle]}>
                                  <Image
                                    source={{ uri: friend.imageUrl }}
                                    style={styles.profilePic2}
                                  />
                                </View>
                                <Text style={styles.usernName2}>
                                  {friend.name}
                                </Text>

                                {info ? (
                                  <Text style={styles.clickFor}>
                                    click for more
                                  </Text>
                                ) : (
                                  <Text style={styles.clickFor}>
                                    click for less
                                  </Text>
                                )}
                                <FontAwesome5
                                  name={icon}
                                  style={styles.status4}
                                />
                                <Fontiso
                                  name={statusIcon}
                                  style={styles[statusStyle]}
                                />
                                {expanded ? getuserscards(friend, index) : ''}
                              </View>
                            </TouchableWithoutFeedback>
                          </>
                        );
                      })
                    : ''}
                </View>
              </ScrollView>
            ) : (
              ''
            )}
          </View>
          <GestureDetector gesture={gesture}>
            <Animated.View
              showsVerticalScrollIndicator={false}
              style={[styles.info, rBottomSheetStyle]}>
              <View style={styles.line} />
              <View style={styles.resInfo}>
                <Image style={styles.pic} source={{ uri: event.resImageUrl }} />
                <View style={styles.resInfoText}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(event.resLink)}>
                    <Text style={styles.restTitle}>{event.resName}</Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      marginLeft: '20.5%',
                      marginTop: '10%',
                      fontSize: 16,
                    }}>
                    {event.cuisine[0]}, {event.cuisine[1]}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '200',
                      marginLeft: '21%',
                      marginTop: '5%',
                    }}>
                    {event.rating}
                    <FontAwesome
                      name="star"
                      style={{
                        color: 'black',
                        fontSize: 23,
                        fontWeight: '100',
                      }}
                    />
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.invite}
                    onPress={() => navigation.navigate(ROUTES.ADD_FREINDS)}>
                    <Text style={styles.uninviteButText}>Invite more</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.deleteEv}
                    onPress={() =>
                      Alert.alert(
                        'Delete event',
                        `This action will delete the event`,
                        [
                          {
                            text: 'Delete',
                            onPress: () => deleteTheCourentEvent(),
                          },
                          { text: 'Cancel' },
                        ]
                      )
                    }>
                    <Text style={styles.uninviteButText}>Delete event</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </GestureDetector>
          <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            style={styles.modalStyle}>
            <View style={styles.sideBarDiv}>
              <View style={styles.sideBarContext}>
                <View style={styles.userHeader}>
                  <View style={styles.circle4}>
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
                  <SelectButtonForTransport eventExist={true} />
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
      )}
    </>
  );
}
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    position: 'absolute',
    marginTop: 130,
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
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  info: {
    backgroundColor: 'white',
    height: SCREEN_HEIGHT / 2.2,
    alignSelf: 'center',
    width: '100%',
    position: 'absolute',
    marginTop: '156%',
    borderRadius: '30%',
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
  line2: {
    width: 35,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 2,
    borderRadius: 2,
  },
  pic: {
    height: '67%',
    width: '45%',
    borderRadius: '8%',
    marginLeft: '5%',
  },
  restName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: '2%',
    marginLeft: '2%',
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
  restTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: '5%',
    marginLeft: 50,
    color: 'black',
    display: 'flex',
    width: '60%',
    flexWrap: 'wrap',
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  usernName2: {
    fontSize: 25,
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
  restDist: {
    fontSize: 18,
    fontWeight: '200',
    marginLeft: '2%',
    color: 'grey',
  },
  circle1: {
    height: 55,
    width: 55,
    backgroundColor: '#70e000',
    borderRadius: 50,
    marginLeft: 10,
    marginTop: 7,
  },
  circle2: {
    height: 55,
    width: 55,
    backgroundColor: '#f07167',
    borderRadius: 50,
    marginLeft: 10,
    marginTop: 7,
  },
  circle3: {
    height: 55,
    width: 55,
    backgroundColor: '#edae49',
    borderRadius: 50,
    marginLeft: 10,
    marginTop: 7,
  },
  profilePic: {
    height: 48,
    width: 48,
    borderRadius: '50%',
    position: 'absolute',
    marginLeft: 3,
    marginTop: 3,
  },
  profilePic2: {
    height: 50,
    width: 50,
    borderRadius: '50%',
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 3,
  },
  typeButton: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '20%',
    marginBottom: '-5%',
    marginLeft: '5%',
  },
  scrollContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: '2%',
  },
  cardContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    marginLeft: 39,
  },
  card: {
    width: 390,
    height: 70,
    backgroundColor: 'white',
    marginRight: 10,
    borderRadius: '8%',
  },
  ResCard: {
    backgroundColor: '#f8f9fa',
    marginTop: 30,
    alignSelf: 'center',
    height: 270,
    width: '94%',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
  },
  cardExpanded: {
    height: 238,
    borderBottomLeftRadius: '8%',
    borderBottomRightRadius: '8%',
  },
  status1: {
    fontSize: 26,
    fontWeight: '600',
    marginTop: '6%',
    marginLeft: '88%',
    color: '#70e000',
    position: 'absolute',
  },
  status2: {
    fontSize: 26,
    fontWeight: '600',
    marginTop: '6%',
    marginLeft: '88%',
    color: '#f07167',
    position: 'absolute',
  },
  status3: {
    fontSize: 26,
    fontWeight: '600',
    marginTop: '6%',
    marginLeft: '88%',
    color: '#edae49',
    position: 'absolute',
  },
  status4: {
    fontSize: 26,
    marginTop: '6%',
    marginLeft: '75%',
    color: COLORS.gray,
    position: 'absolute',
  },
  myLocation: {
    fontSize: 28,
    fontWeight: '600',
    marginTop: '3%',
    marginLeft: '5%',
    color: '#edae49',
    position: 'absolute',
  },
  myDestination: {
    fontSize: 28,
    fontWeight: '600',
    marginLeft: '5%',
    marginTop: '15%',
    color: '#f07167',
    position: 'absolute',
  },
  frindBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    height: 40,
    marginLeft: '4.7%',
    top: '-5%',
    backgroundColor: 'white',
    borderRadius: '8%',
  },
  navBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    height: 40,
    marginLeft: '61%',
    top: '-5%',
    backgroundColor: 'white',
    borderRadius: '8%',
  },
  navBtnModal: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    height: 40,
    marginLeft: '40.65%',
    top: '10.7%',
    backgroundColor: 'white',
    borderRadius: '8%',
  },
  bigContainer: {
    height: 295,
    width: '100%',
    position: 'absolute',
    marginTop: 50,
  },
  expandedDiv: {
    width: 390,
    height: 115,
    backgroundColor: '#f8f9fa',
    marginRight: 10,
    marginTop: 10,
    borderBottomRightRadius: '8%',
    borderBottomLeftRadius: '8%',
  },
  verticalLine: {
    height: 25,
    width: '1%',
    marginTop: '9.5%',
    marginLeft: '8.4%',
    borderLeftWidth: '1.5%',
    borderLeftColor: 'grey',
  },
  curLoc: {
    borderBottomWidth: '1%',
    borderBottomColor: '#dad7cd',
    width: '85%',
    marginLeft: '15%',
    marginTop: '-11.5%',
  },
  curLocText: {
    marginBottom: '4%',
    fontSize: 15,
    fontWeight: '400',
  },
  resLoc: {
    borderBottomWidth: '1%',
    borderBottomColor: '#dad7cd',
    width: '100%',
    marginTop: '3%',
  },
  resLocText: {
    marginBottom: '4%',
    marginLeft: '15%',
    fontSize: 15,
    fontWeight: '400',
  },
  midContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  smallContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  headersDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '65%',
  },
  headerDisText: {
    color: 'grey',
    fontSize: 12,
    marginTop: '3%',
    fontWeight: '500',
  },
  headerTimeText: {
    color: 'grey',
    fontSize: 12,
    marginTop: '3%',
    fontWeight: '500',
  },
  infoDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '65%',
    // marginLeft: '%',
  },
  infoDisText: {
    color: 'black',
    fontSize: 15,
    fontWeight: '600',
    marginTop: '3%',
  },
  infoTimeText: {
    color: 'black',
    fontSize: 15,
    fontWeight: '600',
    marginTop: '3%',
  },
  uninviteBut: {
    backgroundColor: '#f07167',
    marginTop: '2%',
    width: '40%',
    borderRadius: '50%',
    height: 40,
    marginLeft: '-25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uninviteButText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  invite: {
    backgroundColor: '#70e000',
    marginTop: '12%',
    marginLeft: '20%',
    width: '70%',
    borderRadius: '50%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteEv: {
    backgroundColor: '#f07167',
    marginTop: '5%',
    marginLeft: '20%',
    width: '70%',
    borderRadius: '50%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resInfo: {
    display: 'flex',
    flexDirection: 'row',
    height: '90%',
    width: '100%',
    justifyContent: 'flex-start',
  },
  resInfoText: {
    height: '100%',
    width: '60%',
    marginLeft: '-9%',
    display: 'flex',
    flexDirection: 'column',
  },
  clickFor: {
    marginLeft: '20%',
    marginTop: '-3.5%',
    marginBottom: '-2%',
    color: 'grey',
  },
  circle: {
    height: 55,
    width: 55,
    backgroundColor: 'white',
    borderRadius: 50,
  },
});

// socket.on("receive_location", (data) => {
//       if (usersLocaition) {
//         Alert.alert("here");
//         if (usersLocaition) {
//         }
//         let temp = { ...usersLocaition };

//         temp[data.userID] = {
//           latitude: parseFloat(data.locaition.latitude),
//           longitude: parseFloat(data.locaition.longitude),
//         };

//         setUsersLocaition(temp);
//       } else {
//         console.log("errrorrrrrrrrrr");
//       }

//  useEffect(() => {
//    //! setting up locaitions for socket
//    let userslocaitionTemp = {};

//    event.users.map((friend) => {
//      if (friend._id == user._id) {
//        userslocaitionTemp[user._id] = {
//          latitude: deviceLocaition.latitude,
//          longitude: deviceLocaition.longitude,
//        };
//      } else {
//        userslocaitionTemp[friend._id] = {
//          latitude: friend.courentLat,
//          longitude: friend.courentLng,
//        };
//      }
//    });
//    console.log("this shit renderd------------");
//    console.log(userslocaitionTemp);
//    setUsersLocaition(userslocaitionTemp);
//  }, [user]);

// const chaneglocaition = () => {
//   let temp = { ...usersLocaition };
//   temp[user._id] = {
//     latitude: handleLat,
//     longitude: handleLng,
//   };
//   setUsersLocaition(temp);
//   console.log(temp);
//   socket.emit("send_locaition", { locaition: temp[user._id], roomID: event.roomID, userID: user._id });
// };

//  socket.emit("send_locaition", { locaition: temp[user._id], roomID: event.roomID, userID: user._id });
