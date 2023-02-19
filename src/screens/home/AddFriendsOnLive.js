import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text, Alert, ScrollView, Image, Button, TouchableOpacity } from "react-native";
import * as Contacts from "expo-contacts";
import { CheckBox, Input } from "react-native-elements";
import { COLORS, ROUTES } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { UserContext } from "../../../context/usersContext";
import { EventContext } from "../../../context/eventContexts";
import { clockRunning } from "react-native-reanimated";

export default function AddFreindsOnLive() {
  const { addFriends, event, addFriendsToExisting } = useContext(EventContext);
  const navigation = useNavigation();
  const scrollRef = useRef();
  const [contact, setContact] = useState("");
  const [users, setUsers] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const { getAllUsers, user } = useContext(UserContext);
  const [usersSelected, setUsersSelected] = useState([]);

  useEffect(() => {
    let x = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          setContact(data);
          setFilteredContacts(data);
        }
      }
      let listOfUsers = await getAllUsers();

      if (listOfUsers) {
        setUsers(listOfUsers);
      }
    };
    x();
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredContacts(contact);
    } else {
      setFilteredContacts(contact.filter((person) => person.PhoneNumbers && (person.name.toLowerCase().includes(searchText.toLowerCase()) || person?.phoneNumbers[0].digits.toLowerCase().includes(searchText.toLowerCase()))));
    }
  }, [searchText]);

  const addUser = (id) => {
    let temp = usersSelected;

    if (!temp.includes(id)) {
      temp.push(id);
      setUsersSelected(temp);
    }
  };

  const submitUsers = async () => {
    let temp = usersSelected;

    let result = await addFriendsToExisting(temp, event._id);

    if (!result) {
      Alert.alert("woops somthing went wrong !");
    }
  };
  return (
    <View style={styles.container}>
      <Button title="create" onPress={submitUsers} />
      <View style={styles.searchContainer}>
        <Input value={searchText} onChangeText={setSearchText} placeholder="Search by name or number" inputContainerStyle={styles.searchInput} />
      </View>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {users &&
          users.map((person, i) => {
            if (person._id == user._id || event.users.findIndex((element) => element._id == person._id) != -1) {
              return "";
            }
            return (
              <View style={styles.card} key={i}>
                <View style={styles.dits}>
                  <TouchableOpacity onPress={() => addUser(person._id)}>
                    <Image source={{ uri: person.imageUrl }} style={{ width: 65, height: 65 }} />
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 300,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.personName}>{person.name}</Text>
                    {person.phone && <Text>{person.phone}</Text>}
                  </View>
                </View>
                <View style={styles.check}>
                  <CheckBox onPress={() => addUser(person._id)} />
                </View>
              </View>
            );
          })}
      </ScrollView>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* {filteredContacts &&
          filteredContacts.map((person, i) => {
            return (
              <View style={styles.card} key={i}>
                <View style={styles.dits}>
                  <Image source={require("../../assets/blankAvatar.png")} style={{ width: 65, height: 65 }} />
                  <View
                    style={{
                      width: 300,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text style={styles.personName}>{person.name}</Text>
                    {person.phoneNumbers && <Text>{person?.phoneNumbers[0]?.digits}</Text>}
                  </View>
                </View>
                <View style={styles.check}>
                  <CheckBox style={{}} />
                </View>
              </View>
            );
          })} */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "center",
    height: 70,
    width: "100%",
    borderColor: "grey",
    borderWidth: 1,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dits: {
    display: "flex",
    flexDirection: "row",
    width: "50%",
  },
  personName: {
    fontSize: 21,
    textAlign: "center",
    color: COLORS.gray,

    fontWeight: "bold",
  },
  check: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});
