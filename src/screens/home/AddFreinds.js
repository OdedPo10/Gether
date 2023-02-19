import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { CheckBox, Input } from 'react-native-elements';
import { COLORS, ROUTES } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { UserContext } from './../../../context/usersContext';
import { EventContext } from '../../../context/eventContexts';
import Loading from '../auth/loading';
import CheckBoxComponent from './small/checkBox';
import CheckBoxComponentContacts from './small/sendSMS';
export default function AddFreinds() {
  const navigation = useNavigation();
  const [users, setUsers] = useState('');
  const { addFriends, event, resetEventState } = useContext(EventContext);
  const { getAllUsers, user, finished, sleep } = useContext(UserContext);

  const scrollRef = useRef();
  const [usersSelected, setUsersSelected] = useState([]);

  const [contact, setContact] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [usersSelectedIndex, setUsersSelectedIndex] = useState([]);
  const [paginaitionIndex, setPaginationIndex] = useState(1);
  useEffect(() => {
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
    if (event.users.length > 0) {
      resetEventState();
      navigation.navigate(ROUTES.HOME_TAB);
    }

    let x = async () => {
      let temp = [];

      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          let listOfUsers = await getAllUsers();

          if (event.users.length > 0 && listOfUsers) {
            event.users.map((friend) => {
              let index = listOfUsers.findIndex((u) => friend._id == u._id);
              listOfUsers.splice(index, 1);
            });
          } else {
            let index = listOfUsers.findIndex((u) => u._id == user._id);
            listOfUsers.splice(index, 1);
          }

          if (listOfUsers.length > 0 || data.length > 0) {
            // for (let i = 0; i < listOfUsers.length; i++) {
            //   for (let j = 0; j < listOfUsers.length; j++) {
            //     if (data[j].phoneNumbers[0]?.number && data[j].phoneNumbers[0]?.number == listOfUsers[i].phone) {
            //       temp.push(j);
            //     }
            //   }
            // }
            // for (let i = 0; i < temp.length - 1; i++) {
            //   for (let j = 0; j < temp.length - 1 - i; j++) {
            //     if (temp[j] > temp[j + 1]) {
            //       let holder = temp[j];
            //       temp[j] = temp[j + 1];
            //       temp[j + 1] = holder;
            //     }
            //   }
            // }

            // for (let i = temp.length - 1; i >= 0; i--) {
            //   data.splice(temp[i], 1);
            // }
            temp = [...listOfUsers, ...data];

            setContact(temp);
            setFilteredContacts(temp);
          }
        }
      }
    };
    x();
    return () => {
      setUsersSelected([]);
    };
  }, []);
  useEffect(() => {
    if (!searchText) {
      setFilteredContacts(contact);
    } else {
      setFilteredContacts(
        contact.filter(
          (person) =>
            person.PhoneNumbers &&
            (person.name.toLowerCase().includes(searchText.toLowerCase()) ||
              person?.phoneNumbers[0].digits
                .toLowerCase()
                .includes(searchText.toLowerCase()))
        )
      );
    }
  }, [searchText]);
  const addUser = (id, index) => {
    let temp = usersSelected;

    if (!temp.includes(id) && id != user._id) {
      // indexTemp.push(index);
      temp.push(id);
      setUsersSelected(temp);
      // setUsersSelectedIndex(indexTemp);
    }
  };
  const displayUsers = () => {
    let temp = filteredContacts.slice(
      50 * (paginaitionIndex - 1),
      50 * paginaitionIndex
    );
    return temp.map((person, i) => {
      if (person.imageAvailable == 'user') {
        return (
          <View style={styles.card} key={i}>
            <View style={styles.dits}>
              <TouchableOpacity onPress={() => addUser(person._id)}>
                <View
                  style={{
                    height: 65,
                    width: 65,
                    backgroundColor: COLORS.primary,
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={{ uri: person.imageUrl }}
                    style={{ width: 60, height: 60, borderRadius: '50%' }}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  width: 300,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text style={styles.personName}>{person.name}</Text>
                {person.phone && <Text>{person.phone}</Text>}
              </View>
            </View>
            <CheckBoxComponent addUser={addUser} personId={person._id} />
          </View>
        );
      } else
        return (
          <View style={styles.card} key={i}>
            <View style={styles.dits}>
              <Image
                source={require('../../assets/blankAvatar.png')}
                style={{ width: 65, height: 65, borderRadius: '50%' }}
              />
              <View
                style={{
                  width: 300,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <Text style={styles.personName}>{person.name}</Text>
                {person.phoneNumbers ? (
                  person?.phoneNumbers[0]?.digits ? (
                    <Text>{person?.phoneNumbers[0]?.digits}</Text>
                  ) : (
                    <Text>{person?.phoneNumbers[0]?.number}</Text>
                  )
                ) : (
                  ''
                )}
              </View>
            </View>
            <CheckBoxComponentContacts />
          </View>
        );
    });
  };
  const submitUsers = async () => {
    if (event.resName != '') {
      let temp = usersSelected;
      let result = await addFriendsToExisting(temp, event._id);
      console.log(result);
      navigation.navigate(ROUTES.LIVE_VIEW);
      return;
    } else {
      let temp = usersSelected;
      temp.push(user._id);
      let result = await addFriends(temp);

      if (result) {
        navigation.navigate(ROUTES.PICK_RES);
        return;
      }
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={submitUsers}
        activeOpacity={0.7}
        style={styles.createButton}>
        {!finished ? (
          <Loading></Loading>
        ) : (
          <Text style={styles.createButtonText}>CREATE</Text>
        )}
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <Input
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by name or number"
          inputContainerStyle={styles.searchInput}
        />
      </View>

      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.inviteAfter}
            onPress={() => {
              setPaginationIndex(paginaitionIndex - 1);
            }}>
            <Text style={styles.uninviteButText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.inviteAfter}
            onPress={() => {
              setPaginationIndex(paginaitionIndex + 1);
            }}>
            <Text style={styles.uninviteButText}>Next</Text>
          </TouchableOpacity>
        </View>
        {filteredContacts ? displayUsers() : ''}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    height: 70,
    width: '100%',
    borderColor: 'grey',
    borderWidth: 1,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createButton: {
    backgroundColor: COLORS.primary,
    marginLeft: '40%',
    width: '20%',
    borderRadius: '50%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dits: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
  },
  personName: {
    fontSize: 21,
    textAlign: 'center',
    color: COLORS.gray,

    fontWeight: 'bold',
  },
  check: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  inviteAfter: {
    width: '20%',
    borderRadius: '5%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  uninviteButText: {
    color: COLORS.gray,
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: '-5%',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
