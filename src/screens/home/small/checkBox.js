import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { COLORS, ROUTES } from '../../../constants';

const CheckBoxComponent = ({ addUser, personId }) => {
  const [isSelected, setSelection] = useState(false);

  return (
    <>
      {isSelected ? (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.inviteAfter}
          onPress={() => {}}>
          <Text style={styles.uninviteButText}>Pending..</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.invite}
          onPress={() => {
            setSelection(true);
            addUser(personId);
          }}>
          <Text style={styles.uninviteButText}>Add</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  invite: {
    backgroundColor: '#80ed99',
    marginRight: '4%',
    width: '20%',
    marginTop: '3.5%',
    borderRadius: '50%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteAfter: {
    backgroundColor: '#edae49',
    marginRight: '4%',
    width: '20%',
    marginTop: '3.5%',
    borderRadius: '50%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteContacts: {
    backgroundColor: COLORS.gray,
    marginRight: '4%',
    width: '20%',
    marginTop: '2%',
    // borderTopLeftRadius: '50%',
    // borderTopRightRadius: '50%',
    // borderBottomRightRadius: '50%',
    // borderBottomLeftRadius: '50%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uninviteButText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
export default CheckBoxComponent;
