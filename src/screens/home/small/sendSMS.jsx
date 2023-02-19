import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { COLORS, ROUTES } from '../../../constants';

const CheckBoxComponentContacts = () => {
  const [isSelected, setSelection] = useState(false);

  return (
    <>
      {isSelected ? (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.inviteAfter}
          onPress={() => {}}>
          <Text style={styles.uninviteButText}>Sent</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.inviteContacts}
          onPress={() => {
            setSelection(true);
          }}>
          <Text style={styles.uninviteButText}>SMS</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: COLORS.grayLight,
    marginRight: '4%',
    width: '20%',
    marginTop: '3.5%',
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
});
export default CheckBoxComponentContacts;
