import React, { useState, useRef, useEffect, createRef } from 'react';

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
import Fontiso from 'react-native-vector-icons/Fontisto';
import { COLORS, ROUTES } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { EventContext } from '../../../context/eventContexts';
import { UserContext } from '../../../context/usersContext';
import { GOOGLE_API_key } from '@env';
import { useContext } from 'react';

export default function PreviewEvent() {
  //! states
  const { event, acceptEvent } = useContext(EventContext);
  const colors = ['#390099', '#9E0059', '#FFBD00', '#FF5400', '#31572C'];

  const mapRef = useRef();
  useEffect(() => {
    let temp = event.users.map((friend) => {
      return {
        latitude: friend.courentLat,
        longitude: friend.courentLng,
      };
    });
    temp.push({ latitude: event.resLat, longitude: event.resLng });
    mapRef.current?.fitToCoordinates(temp, {
      bottom: 30,
      right: 10,
      left: 10,
      top: 30,
    });
  }, []);
  return (
    <>
      {event.resName && (
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.declineButton}
                onPress={() => {
                  acceptEvent('disapproved');
                }}>
                <Text style={styles.uninviteButText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.acceptButton}
                onPress={() => {
                  acceptEvent('approved');
                }}>
                <Text style={styles.uninviteButText}>Enter event</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <View style={styles.picDiv}>
                <Image style={styles.pic} source={{ uri: event.resImageUrl }} />
              </View>

              <View style={styles.headlinHolder}>
                <Text style={styles.mainHeadlin}>{event.resName}</Text>
                <Text style={styles.seconedHeadling}>
                  {event?.cuisine && event?.cuisine[0]} ,{' '}
                  {event.cuisine && event?.cuisine[1]}
                </Text>
              </View>

              {/* <Text style={styles.dot}>....................................................................................................</Text> */}

              <View style={styles.resDescription}>
                <View style={styles.restDist}>
                  <Text style={styles.littleHeading}>
                    {event.rating}
                    <FontAwesome
                      name="star"
                      style={{
                        color: 'grey',
                        fontSize: 23,
                        fontWeight: '100',
                      }}
                    />
                  </Text>

                  <Text style={styles.littleHeading}>
                    {' '}
                    {Math.floor(10 * 1000)}m{' '}
                    <FontAwesome5
                      name="walking"
                      style={{
                        color: 'grey',
                        fontSize: 25,
                        fontWeight: '100',
                      }}
                    />
                  </Text>

                  <Text style={styles.littleHeading}>
                    {' '}
                    learn more
                    <FontAwesome5
                      name="walking"
                      style={{
                        color: 'grey',
                        fontSize: 25,
                        fontWeight: '100',
                      }}
                    />
                  </Text>
                </View>
              </View>
            </View>

            <ScrollView
              style={styles.friendScrollContainer}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              snapToInterval={400}
              decelerationRate="fast">
              {event &&
                event.users.map((friend, index) => {
                  let statusIcon = '';

                  if (event.usersStatus[index] === 'approved') {
                    statusIcon = 'like';
                  } else if (event.usersStatus[index] === 'disapproved') {
                    statusIcon = 'dislike';
                  } else {
                    statusIcon = 'hourglass-start';
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
                    <View style={styles.userCard}>
                      <View style={styles.textTiming}>
                        <View style={styles.circle1}>
                          <Image
                            source={{ uri: friend.imageUrl }}
                            style={styles.profilePic2}
                          />
                        </View>
                        <View style={styles.userDistance}>
                          <Text style={styles.restName}>{friend.name}</Text>
                          <Text style={{ color: COLORS.gray }}>
                            Friend name
                          </Text>
                        </View>
                        <View style={styles.userDistance}>
                          <Fontiso name={statusIcon} style={styles.status1} />
                          <Text style={{ color: COLORS.gray }}>Status</Text>
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
                    // <View style={styles.userCard}>
                    //   <View style={styles[circleStyle]}>
                    //     <Image
                    //       source={{ uri: friend.imageUrl }}
                    //       style={styles.profilePic3}
                    //     />
                    //   </View>
                    //   <View style={styles.nameIconHolder}>
                    //     <Text style={styles.userName}>{friend.name}</Text>
                    //     <View style={styles.iconHolder}>
                    //       <FontAwesome5
                    //         name={icon}
                    //         style={{
                    //           color: 'grey',
                    //           fontSize: 25,
                    //           fontWeight: '100',
                    //         }}
                    //       />
                    //       <Fontiso name={statusIcon} style={styles[statusStyle]} />
                    //     </View>
                    //   </View>
                    // </View>
                  );
                })}
            </ScrollView>

            <View style={styles.map}>
              <MapView
                ref={mapRef}
                style={styles.mapStyle}
                region={{
                  latitude: parseFloat(event.resLat),
                  longitude: parseFloat(event.resLng),
                }}
                zoomControlEnabled={true}
                showsScale={true}>
                <Marker
                  coordinate={{
                    latitude: parseFloat(event.resLat),
                    longitude: parseFloat(event.resLng),
                  }}>
                  <Image
                    source={{ uri: event.resImageUrl }}
                    style={styles.profilePic}
                  />
                </Marker>
                {event.users.length > 0 &&
                  event.users.map((friend, i) => {
                    return (
                      <>
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
                        <MapViewDirections
                          origin={{
                            latitude: parseFloat(friend.courentLat),
                            longitude: parseFloat(friend.courentLng),
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
                            mapRef.current.fitToCoordinates(
                              result.coordinates,
                              {
                                edgePadding: {
                                  right: 30,
                                  left: 30,
                                  bottom: 100,
                                  top: 100,
                                },
                              }
                            );
                          }}
                        />
                      </>
                    );
                  })}
              </MapView>
            </View>

            {/* <View style={styles.map}></View>
        <View style={styles.userArrivalData}></View> */}
            {/* <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            acceptEvent("approved"); //660yoq user :2
            // acceptEvent("disapproved");
          }}
        >
          <Text>accept event </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          activeOpacity={0.7}
          onPress={() => {
            acceptEvent("approved"); //660yoq user :2
            // acceptEvent("disapproved");
          }}
        >
          <Text>accept event </Text>
        </TouchableOpacity> */}
          </ScrollView>
          {/* <Text>preeview event</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          acceptEvent("approved"); //660yoq user :2
          // acceptEvent("disapproved");
        }}
      >
        <Text>accept event </Text>
      </TouchableOpacity>
         */}
        </View>
      )}
    </>
  );
}

//! style ------------------------------------------------------
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: ' 100%',

    display: 'flex',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#80ED99',

    width: '30%',
    marginRight: '2%',
    borderRadius: '50%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    backgroundColor: '#f07167',
    marginLeft: '2%',
    width: '30%',

    borderRadius: '50%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uninviteButText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '90%',
    height: 60,

    marginBottom: '2%',
    marginTop: '2%',
    marginLeft: '5%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  map: {
    width: '90%',
    height: 340,
    backgroundColor: 'white',
    marginLeft: '5%',
    marginTop: '-2%',
  },
  mapStyle: {
    width: '100%',
    height: '100%',
    borderRadius: '8%',
  },
  scrollContainer: {
    height: '90%',
    width: '100%',
    backgroundColor: 'white',
  },
  card: {
    height: 275,
    width: '90%',
    marginLeft: '5%',
    // backgroundColor: "green",
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8%',
  },
  picDiv: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: '8%',
    borderTopRightRadius: '8%',
  },
  pic: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: '8%',
    borderTopRightRadius: '8%',
  },
  headlinHolder: {
    height: '25%',
    width: '100%',

    display: 'flex',
    flexDirection: 'column',
  },
  mainHeadlin: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: '2%',
    marginLeft: '2%',
  },
  seconedHeadling: {
    fontSize: 18,
    fontWeight: '200',
    marginLeft: '2%',
    color: 'grey',
  },
  resDescription: {
    height: '15%',
    width: '100%',

    borderBottomRightRadius: '8%',
    borderBottomLeftRadius: '8%',
  },

  restDist: {
    borderTopColor: 'grey',
    borderTopWidth: 2,
    width: '95%',
    marginLeft: '2.5%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  littleHeading: {
    alignContent: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
  },
  friendScrollContainer: {
    width: '100%',
    // marginLeft: '5%',
    marginTop: '5%',
    height: 100,
  },
  userCard: {
    width: 390,
    height: 70,
    backgroundColor: 'white',
    marginLeft: 21,
    borderRadius: '8%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: 'white',
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
  profilePic3: {
    height: 50,
    width: 50,
    borderRadius: 50,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 2.5,
  },
  userName: {
    fontSize: 25,
    fontWeight: '600',
    color: 'black',
    shadowColor: 'white',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  nameIconHolder: {
    width: '65%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  status1: {
    fontSize: 26,
    fontWeight: '600',
    color: 'black',
  },
  iconHolder: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
  },
  profilePic: {
    height: 48,
    width: 48,
    borderRadius: 50,

    marginLeft: 3,
    marginTop: 3,
  },
  circle: {
    height: 55,
    width: 55,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  textTiming: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%',
  },
  profilePic2: {
    height: 50,
    width: 50,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 3,
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
  restName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: '2%',
    marginLeft: '2%',
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
});
//  container: {
//     flex: 1,
//     height: "100%",
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
//   scrollContainer: {
//     height: "100%",
//   },
//   card: {
//     marginTop: "5%",
//     alignSelf: "center",
//     height: "100%",
//     width: "94%",
//     shadowColor: "#171717",
//     shadowOffset: { width: -2, height: 4 },
//     shadowOpacity: 0.2,
//     display: "flex",
//     flexDirection: "row",
//   },
//   pic: {
//     width: "100%",
//     height: "60%",
//     flex: 0.6,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   dits: {
//     backgroundColor: "white",
//     flex: 0.4,
//     borderRadius: "8%",
//     width: "100%",
//     // height: "100%",
//   },
//   restName: {
//     fontSize: 20,
//     fontWeight: "600",
//     marginTop: "2%",
//     marginLeft: "2%",
//   },
//   typeButton: {
//     display: "flex",
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     height: "20%",
//     marginBottom: "1%",
//   },
//   restType: {
//     fontSize: 18,
//     fontWeight: "200",
//     marginLeft: "2%",
//     // marginTop: '1%',
//     borderBottomColor: "white",
//     borderStyle: "dotted",
//     width: "65%",
//   },
//   buttonContain: {
//     width: "9%",
//     backgroundColor: "transparent",
//   },
//   dot: {
//     color: "grey",
//   },
//   Dist: {
//     backgroundColor: "white",
//     // flex: 1,
//     // borderBottomLeftRadius: "8%",
//     // borderBottomRightRadius: "8%",
//     // borderRadius: '8%',
//   },
//   restDist: {
//     fontSize: 18,
//     fontWeight: "200",
//     marginLeft: "2%",
//     color: "grey",
//   },
