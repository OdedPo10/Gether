import React, { useState, useRef, useEffect, createRef } from 'react';
import staticData from '../../../data';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker } from 'react-native-maps';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { X_RapidAPI_Key } from '@env';
import { GOOGLE_API_key } from '@env';

import { COLORS, ROUTES } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { EventContext } from '../../../context/eventContexts';
import { UserContext } from '../../../context/usersContext';
import { useContext } from 'react';
import SelectButtonForTransport from './small/selectTransportMethod';
import axios from 'axios';
export default function PickRes() {
  //! states
  const { event, createEvent, resetEventState } = useContext(EventContext);
  const { user, deviceLocaition, signOut } = useContext(UserContext);
  const [resturant, setResturant] = useState('');
  const [usersTiming, setUsersTiming] = useState([]);
  const [data, setData] = useState('');
  const [visible, setVisible] = useState(false);
  const [frindVisable, setfrindVisable] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    latitude: 32.08139799365371,
    latitudeDelta: 0.046104369607917306,
    longitude: 34.78045893833041,
    longitudeDelta: 0.028144754469394684,
  });
  let [tempData, setTempData] = useState('');
  const colors = ['#390099', '#9E0059', '#FFBD00', '#FF5400', '#31572C'];

  //! functions
  const changeResturant = async (rest) => {
    setUsersTiming([]);
    if (frindVisable) setfrindVisable(!frindVisable);
    await calculateRoute(rest);
    await sleep(300);

    if (!frindVisable) setfrindVisable(!frindVisable);
  };
  const calculateRoute = async (rest) => {
    setResturant(rest);
    await sleep(100);
  };
  function getDistance(coord1, coord2) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    let lat1 = parseFloat(coord1.courentLat);
    let lon1 = parseFloat(coord1.courentLng);
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
  const submiteRes = async () => {
    let result = await createEvent(resturant);
    if (result == true) {
      navigation.navigate(ROUTES.LIVE_VIEW);
      console.log('event was created');
    } else {
      Alert.alert('somthing weent wrong try again');
    }
  };
  const getResturants = async () => {
    let bounderies = getBoundByRegion(mapCenter);
    let URL =
      'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary';
    let options = {
      params: {
        bl_latitude: bounderies.minLat,
        tr_latitude: bounderies.maxLat,
        bl_longitude: bounderies.minLng,
        tr_longitude: bounderies.maxLng,
        lunit: 'km',
      },
      headers: {
        'X-RapidAPI-Key': X_RapidAPI_Key, // need to reaemove
        'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com',
      },
    };
    console.log(X_RapidAPI_Key);
    try {
      let result = await axios.get(URL, options);
      console.log('--------');
      console.log(result.status);
      if (result.data) {
        setTempData(result.data.data);
      }
    } catch (error) {
      Alert.alert(
        'We have a problem with our resturant server, pls try again later'
      );
    }
  };
  const getBoundByRegion = (region, scale = 1) => {
    /*
     * Latitude : max/min +90 to -90
     * Longitude : max/min +180 to -180
     */
    // Of course we can do it mo compact but it wait is more obvious
    const calcMinLatByOffset = (lng, offset) => {
      const factValue = lng - offset;
      if (factValue < -90) {
        return (90 + offset) * -1;
      }
      return factValue;
    };

    const calcMaxLatByOffset = (lng, offset) => {
      const factValue = lng + offset;
      if (90 < factValue) {
        return (90 - offset) * -1;
      }
      return factValue;
    };

    const calcMinLngByOffset = (lng, offset) => {
      const factValue = lng - offset;
      if (factValue < -180) {
        return (180 + offset) * -1;
      }
      return factValue;
    };

    const calcMaxLngByOffset = (lng, offset) => {
      const factValue = lng + offset;
      if (180 < factValue) {
        return (180 - offset) * -1;
      }
      return factValue;
    };

    const latOffset = (region.latitudeDelta / 2) * scale;
    const lngD =
      region.longitudeDelta < -180
        ? 360 + region.longitudeDelta
        : region.longitudeDelta;
    const lngOffset = (lngD / 2) * scale;

    return {
      minLng: calcMinLngByOffset(region.longitude, lngOffset), // westLng - min lng
      minLat: calcMinLatByOffset(region.latitude, latOffset), // southLat - min lat
      maxLng: calcMaxLngByOffset(region.longitude, lngOffset), // eastLng - max lng
      maxLat: calcMaxLatByOffset(region.latitude, latOffset), // northLat - max lat
    };
  };
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  //! div navigation
  const [elRefs, setElRefs] = useState([]);
  const mapRef = useRef();
  const scrollRef = useRef();
  const navigation = useNavigation();
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, -SCREEN_HEIGHT / 5);
    })
    .onEnd(() => {
      if (translateY.value > 0) {
        translateY.value = withSpring(SCREEN_HEIGHT / 4.5, { damping: 30 });
      } else {
        translateY.value = withSpring(-SCREEN_HEIGHT / 8, { damping: 30 });
      }
    });
  useEffect(() => {
    translateY.value = withSpring(SCREEN_HEIGHT / 4.5);

    if (event) {
      let temp = event.users.map((friend) => {
        return {
          latitude: friend.courentLat,
          longitude: friend.courentLng,
        };
      });
      mapRef.current?.fitToCoordinates(temp, {
        bottom: 300,
        right: 30,
        left: 30,
        top: 100,
      });
    }
    console.log('befor sort resturant-----------------');
    sortRestorants();
  }, [tempData]);
  useEffect(() => {
    setData(staticData);
  }, []);
  const sortRestorants = async () => {
    let temp = { data: tempData };
    if (temp) {
      let tilesToDelete = [];
      temp.data.map((res, index) => {
        if (!res?.detail) {
          let results = event.users.map((user) => {
            return getDistance(user, res);
          });
          res.average = results.reduce((a, b) => a + b) / results.length;
        } else {
          tilesToDelete.push(index);
        }
      });
      for (let i = tilesToDelete.length - 1; i >= 0; i--) {
        temp.data.splice(tilesToDelete[i], 1);
      }

      temp.data.sort((a, b) => a.average - b.average);

      setData(temp);
    }
  };
  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  const scrollDiv = (i) => {
    translateY.value = withSpring(-SCREEN_HEIGHT / 4.6, { damping: 30 });
    let y = 300 * i;
    scrollRef.current.scrollTo({
      x: 0,
      y: y,
      animated: true,
      animation: { duration: 2000 },
    });
  };
  //!-------------------

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={deviceLocaition}
        zoomControlEnabled={true}
        onRegionChangeComplete={(e) => {
          setMapCenter(e);
        }}
        showsScale={true}>
        {event.users.length > 0 ? (
          <>
            {/* print the users */}
            {event.users.length > 0 &&
              event.users.map((friend, i) => {
                return (
                  <Marker
                    coordinate={{
                      latitude: friend.courentLat,
                      longitude: friend.courentLng,
                    }}>
                    <View style={styles.circle}>
                      <Image
                        source={{ uri: friend.imageUrl }}
                        style={styles.profilePic}
                      />
                    </View>
                  </Marker>
                );
              })}
          </>
        ) : (
          ''
        )}
        {/* print the directions */}
        {event.users.length > 0 && resturant
          ? event.users.map((friend, i) => {
              let origin = {
                latitude: parseFloat(friend.courentLat),
                longitude: parseFloat(friend.courentLng),
              };
              return (
                <>
                  <MapViewDirections
                    origin={origin}
                    destination={{
                      latitude: resturant.latitude,
                      longitude: resturant.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    apikey={GOOGLE_API_key}
                    strokeWidth={3}
                    strokeColor={colors[i]}
                    mode={friend.transportMode}
                    optimizeWaypoints={true}
                    onReady={(result) => {
                      mapRef.current.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: 30,
                          left: 30,
                          bottom: 300,
                          top: 100,
                        },
                      });
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

        {/* print the resturants */}
        {data &&
          data.data.map((place, i) => {
            return (
              <Marker
                key={i}
                coordinate={{
                  latitude: parseFloat(place.latitude),
                  longitude: parseFloat(place.longitude),
                }}
                pinColor={selectedIndex !== i ? '#FE7F2D' : '#8338EC'}
                onPress={() => {
                  scrollDiv(i);
                  setSelectedIndex(i);
                }}
                title={place.name}></Marker>
            );
          })}
      </MapView>

      <View style={styles.bigContainer}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            top: '4%',
            justifyContent: 'space-between',
          }}>
          {/* friends botton */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.frindBtn}
            onPress={() => setfrindVisable(!frindVisable)}>
            <Image
              source={require('../../assets/frinds.png')}
              style={{ height: '80%', width: '80%' }}
            />
          </TouchableOpacity>
          {/* create event button */}
          {resturant ? (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.createEvent}
              onPress={submiteRes}>
              <Text style={styles.createEventText}>create event</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={getResturants}
              activeOpacity={0.7}
              style={styles.createEvent}>
              <Text style={styles.createEventText}>search here</Text>
            </TouchableOpacity>
          )}

          {/* side bar button  */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.navBtn}
            onPress={() => setVisible(true)}>
            <View style={styles.line2} />
            <View style={styles.line2} />
            <View style={styles.line2} />
          </TouchableOpacity>
        </View>

        {/* friends small card */}
        {frindVisable ? (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            snapToInterval={400}
            decelerationRate="fast"
            contentContainerStyle={styles.scrollContainer}>
            <View style={styles.cardContainer}>
              {event.users.length > 0 &&
                event.users.map((friend, i) => {
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
                    <View style={styles.userCard}>
                      <View style={styles.textTiming}>
                        <View
                          style={{
                            height: 55,
                            width: 55,
                            backgroundColor: colors[i],
                            borderRadius: 50,
                            shadowColor: 'black',
                            shadowOffset: { width: 1, height: 1 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                          }}>
                          <Image
                            source={{ uri: friend.imageUrl }}
                            style={styles.profilePic2}
                          />
                        </View>
                        <View style={styles.userDistance}>
                          <Text style={styles.restName}>
                            {parseFloat(
                              usersTiming[friend._id]?.distance
                            ).toFixed(2)}{' '}
                            km
                          </Text>
                          <Text style={{ color: COLORS.gray }}>Distance</Text>
                        </View>
                        <View style={styles.userDistance}>
                          <Text style={styles.restName}>
                            {parseInt(usersTiming[friend._id]?.duration)} min
                          </Text>
                          <Text style={{ color: COLORS.gray }}>Time</Text>
                        </View>
                        <View style={styles.userMethed}>
                          <FontAwesome5
                            name={icon}
                            style={{
                              color: 'black',
                              fontSize: 25,
                              fontWeight: '100',
                            }}
                          />
                          <Text style={{ color: COLORS.gray }}>Method</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
            </View>
          </ScrollView>
        ) : (
          ''
        )}
      </View>

      {/* resturant cards drag */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          showsVerticalScrollIndicator={false}
          style={[styles.info, rBottomSheetStyle]}>
          <View style={styles.line} />
          <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
            {/* places cards */}
            {data &&
              data.data.map((place, i) => {
                if (place?.detail == 0) {
                  // empty resturant
                  return (
                    <View style={styles.card} key={'asdasdas'} ref={elRefs[i]}>
                      <Image
                        style={styles.pic}
                        source={{
                          uri: 'https://media-cdn.tripadvisor.com/media/photo-l/0c/11/6d/c4/rubi-bar.jpg',
                        }}
                      />

                      <View style={styles.dits}>
                        <Text style={styles.restName}>Meat Bar</Text>
                        <View style={styles.typeButton}>
                          <Text style={styles.restType}>
                            drinks
                            {', '}
                            food{' '}
                          </Text>
                          <View style={styles.buttonContain}>
                            <TouchableWithoutFeedback onPress={() => []}>
                              <FontAwesome5
                                name="directions"
                                style={{
                                  color: 'grey',
                                  fontSize: 23,
                                  fontWeight: '100',
                                  marginTop: '-2%',
                                }}
                              />
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                        <Text style={styles.dot}>
                          ....................................................................................................
                        </Text>
                        <View style={styles.Dist}>
                          <View style={styles.DistIconHolder}>
                            <Text style={styles.restDist}>4.5</Text>
                            <FontAwesome
                              name="star"
                              style={{
                                color: 'grey',
                                fontSize: 23,
                                fontWeight: '100',
                              }}
                            />
                          </View>

                          <View style={styles.DistIconHolder}>
                            <Text style={styles.restDist}>Open now</Text>
                            <FontAwesome5
                              name="clock"
                              style={{
                                color: 'grey',
                                fontSize: 25,
                                fontWeight: '100',
                              }}
                            />
                          </View>

                          <View style={styles.DistIconHolder}>
                            <Text style={styles.restDist}>1234</Text>
                            <FontAwesome5
                              name="walking"
                              style={{
                                color: 'grey',
                                fontSize: 25,
                                fontWeight: '100',
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                } else {
                  return (
                    //real resturant
                    <View
                      style={styles.card}
                      key={place.location_id}
                      ref={elRefs[i]}>
                      {place?.photo?.images?.original && (
                        <Image
                          style={styles.pic}
                          source={{ uri: place.photo.images.original.url }}
                        />
                      )}

                      <View style={styles.dits}>
                        <Text style={styles.restName}>
                          {place?.name && place.name}
                        </Text>
                        <View style={styles.typeButton}>
                          <Text style={styles.restType}>
                            {place?.cuisine[1]?.name && place?.cuisine[1]?.name}
                            {', '}
                            {place?.cuisine[2]?.name &&
                              place?.cuisine[2]?.name}{' '}
                          </Text>
                          <View style={styles.buttonContain}>
                            <TouchableWithoutFeedback
                              onPress={() => changeResturant(place)}>
                              <FontAwesome5
                                name="directions"
                                style={{
                                  color: 'grey',
                                  fontSize: 23,
                                  fontWeight: '100',
                                  marginTop: '-2%',
                                }}
                              />
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                        <Text style={styles.dot}>
                          ....................................................................................................
                        </Text>
                        <View style={styles.Dist}>
                          <View style={styles.DistIconHolder}>
                            <Text style={styles.restDist}>
                              {place?.rating && place.rating}{' '}
                            </Text>
                            <FontAwesome
                              name="star"
                              style={{
                                color: 'grey',
                                fontSize: 23,
                                fontWeight: '100',
                              }}
                            />
                          </View>

                          <View style={styles.DistIconHolder}>
                            <Text style={styles.restDist}>
                              {place?.open_now_text && place.open_now_text}{' '}
                            </Text>
                            <FontAwesome5
                              name="clock"
                              style={{
                                color: 'grey',
                                fontSize: 25,
                                fontWeight: '100',
                              }}
                            />
                          </View>

                          <View style={styles.DistIconHolder}>
                            <Text style={styles.restDist}>
                              {Math.floor(place.average * 1000)}m{' '}
                            </Text>
                            <FontAwesome5
                              name="walking"
                              style={{
                                color: 'grey',
                                fontSize: 25,
                                fontWeight: '100',
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }
              })}
          </ScrollView>
        </Animated.View>
      </GestureDetector>

      {/* the side bar */}
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
  );
}

//! style ------------------------------------------------------
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textTiming: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%',
  },
  resMarkerDiv: {
    display: 'flex',

    flexDirection: 'row',
    color: '#FB8500',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  info: {
    backgroundColor: 'white',
    height: SCREEN_HEIGHT / 2,
    alignSelf: 'center',
    width: '100%',
    position: 'absolute',
    marginTop: '155%',
    borderRadius: '30%',
  },
  card: {
    marginTop: 30,
    alignSelf: 'center',
    height: 270,
    width: '94%',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    borderTopLeftRadius: '8%',
    borderTopRightRadius: '8%',
  },
  dits: {
    backgroundColor: 'white',
    borderBottomLeftRadius: '8%',
    borderBottomRightRadius: '8%',
  },
  Dist: {
    backgroundColor: 'white',
    borderBottomLeftRadius: '8%',
    borderBottomRightRadius: '8%',
    marginBottom: '-3%',
    marginLeft: '2%',
    marginRight: '2%',
    width: '96%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
  pic: {
    height: '50%',
    width: '100%',
    borderTopLeftRadius: '8%',
    borderTopRightRadius: '8%',
  },
  restName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: '2%',
    marginLeft: '2%',
  },
  restType: {
    fontSize: 18,
    fontWeight: '200',
    marginLeft: '2%',
    // marginTop: '1%',
    borderBottomColor: 'white',
    borderStyle: 'dotted',
    width: '65%',
  },
  restDist: {
    fontSize: 18,
    fontWeight: '200',

    color: 'grey',
  },
  dot: {
    color: 'grey',
    marginBottom: '1%',
  },
  circle: {
    height: 55,
    width: 55,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  profilePic: {
    height: 48,
    width: 48,
    borderRadius: 50,
    position: 'absolute',
    marginLeft: 3,
    marginTop: 3,
  },
  typeButton: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '20%',
    marginBottom: '1%',
  },
  buttonContain: {
    width: '9%',
    backgroundColor: 'transparent',
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
    height: 70,
    marginLeft: 39,
  },
  userCard: {
    width: 390,
    height: 70,
    backgroundColor: 'white',
    marginRight: 10,
    borderRadius: '8%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '100%',
  },

  arrivaldata: {
    fontSize: 15,
    fontWeight: '400',
    marginLeft: '30%',
    color: 'black',
  },
  profilePic2: {
    height: 50,
    width: 50,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 3,
  },
  bigContainer: {
    height: '14.5%',
    width: '100%',
    position: 'absolute',
    marginTop: 50,
  },
  circle1: {
    height: 55,
    width: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  line2: {
    width: 35,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 2,
    borderRadius: 2,
  },
  navBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    height: 40,
    marginRight: '4.35%',
    // marginLeft: '61%',
    top: '-3%',
    backgroundColor: 'white',
    borderRadius: '8%',
  },
  frindBtn: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    height: 40,
    marginLeft: '4.7%',
    top: '-3%',
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
    top: '12.7%',
    backgroundColor: 'white',
    borderRadius: '8%',
  },
  circle3: {
    height: 85,
    width: 85,
    backgroundColor: 'white', //edae49
    borderRadius: 50,
    marginLeft: 10,
    marginTop: 130,
    position: 'absolute',
  },
  profilePic3: {
    height: 75,
    width: 75,
    borderRadius: 50,
    marginTop: 2,
    alignSelf: 'center',
  },
  userName: {
    fontSize: 25,
    fontWeight: '600',
    marginTop: '5%',
    color: 'black',
    position: 'absolute',
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  sideBarText: {
    color: COLORS.gray,
    fontSize: 20,
    fontWeight: '600',
  },
  modalStyle: {
    backfaceVisibility: 'visible',
    backgroundColor: 'transparent',
    width: '50%',
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
    // justifyContent: 'flex-end',
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
  sideBarButtons: {
    marginTop: '50%',
    marginRight: '8%',
    width: '80%',
  },
  sideBarTouchable: {
    height: '13%',
    width: '100%',
  },
  createEventText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  createEvent: {
    backgroundColor: '#70e000',
    marginTop: '-3%',
    width: '50%',
    borderRadius: '50%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDistance: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: '70%',
    borderRightWidth: 2,
    borderRightColor: COLORS.grayLight,
    width: '50%',
  },
  userMethed: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: '70%',
    width: '50%',
  },
  DistIconHolder: {
    width: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
