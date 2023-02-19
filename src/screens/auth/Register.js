import React from 'react';
import { useState, useEffect } from 'react';
import { COLORS, ROUTES } from '../../constants';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import avatar from '../../assets/blankAvatar.png';
import { useForm, Controller } from 'react-hook-form';
import { useContext } from 'react';
import { UserContext } from './../../../context/usersContext';
import * as FileSystem from 'expo-file-system';
import SelectDropdown from 'react-native-select-dropdown';
import Loading from './loading';

const Register = () => {
  const navigation = useNavigation();
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState('');
  const [transport, setTransport] = useState('DRIVING');
  const { signUp } = useContext(UserContext);
  const transportTypes = ['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'];
  //!form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password1: '',
      password2: '',
    },
  });

  //*get premmision to photos
  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasGalleryPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      //* set up image to send to data base
      setImage(result.uri);
      let type = result.uri.split('.');
      let painIntheAss = 'data:image/' + type[1] + ';base64,';
      let image = await FileSystem.readAsStringAsync(result.uri, {
        encoding: 'base64',
      });

      setSelectedFile(painIntheAss + image);
    }

    if (hasGalleryPermission === false) {
      return <Text>No access to Internal Stoarge</Text>;
    }
  };

  const captureImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
      let type = result.uri.split('.');
      let painIntheAss = 'data:image/' + type[1] + ';base64,';

      let image = await FileSystem.readAsStringAsync(result.uri, {
        encoding: 'base64',
      });

      setSelectedFile(painIntheAss + image);
    }
    if (hasGalleryPermission === false) {
      return <Text>No access to Internal Stoarge</Text>;
    }
  };
  const [RegisterClicked, setRegisterClicked] = useState(false);
  const onSubmit = async (data) => {
    console.log('here');
    setRegisterClicked(true);
    let result = await signUp(data, selectedFile, transport);
    console.log(result);
    // reset();
    result == true ? navigation.navigate(ROUTES.HOME) : handleUnsecsses();
  };
  const handleUnsecsses = () => {
    setRegisterClicked(false);
    Alert.alert('failed to sign up');
  };
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.container}>
        <View style={styles.wFull}>
          <View style={styles.row}>
            <TouchableOpacity
              title=""
              onPress={() =>
                Alert.alert(
                  'Edit profile picture',
                  'A profile pic helps friends recognize you',
                  [
                    {
                      text: 'Choose from libary',
                      onPress: () => pickImage(),
                    },
                    { text: 'Take photo', onPress: () => captureImage() },
                  ]
                )
              }>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {image ? (
                  <View
                    style={{
                      height: 95,
                      width: 95,
                      borderRadius: '50%',
                      backgroundColor: COLORS.primary,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '4%',
                    }}>
                    <Image
                      source={{ uri: image }}
                      style={{
                        height: 90,
                        width: 90,
                        borderRadius: '50%',
                        marginRight: 1,
                      }}
                    />
                  </View>
                ) : (
                  <Image source={avatar} style={{ height: 110, width: 110 }} />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.loginContinueTxt}>
              Get To <Text style={styles.brandName}>Gether</Text> with us
            </Text>
          </View>
          <ScrollView
            style={{ height: '65%' }}
            showsVerticalScrollIndicator={false}>
            <Controller
              control={control}
              // rules={{
              //   required: true,
              // }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  placeholder="First name"
                />
              )}
              name="firstName"
            />
            {/* {errors.firstName && <Text>{errors.firstName.message}</Text>} */}
            <Controller
              control={control}
              // rules={{
              //   required: true,
              // }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  placeholder="Last name"
                />
              )}
              name="lastName"
            />
            {/* {errors.lastName && <Text>{errors.lastName.message}</Text>} */}
            <Controller
              control={control}
              // rules={{
              //   pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              //   required: true,
              // }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  placeholder="Email"
                />
              )}
              name="email"
            />
            {/* {errors.email && <Text>{errors.email.message}</Text>} */}
            <Controller
              control={control}
              // rules={{
              //   pattern: /^\+\d{10}$/,
              //   required: true,
              // }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  placeholder="Phone number"
                />
              )}
              name="phone"
            />
            {/* {errors.phone && <Text>{errors.phone.message}</Text>} */}

            <Controller
              control={control}
              // rules={{
              //   required: true,
              //   pattern: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
              // }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  placeholder="Password"
                />
              )}
              name="password1"
            />

            {/* {errors.password1 && <Text>{errors.password1.message}</Text>} */}
            <Controller
              control={control}
              // rules={{
              //   required: true,
              //   pattern: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
              // }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.input}
                  placeholder="Confirm Password"
                />
              )}
              name="password2"
            />
            {/* {errors.password2 && <Text>{errors.password2.message}</Text>} */}

            <View style={styles.selectTransportDiv}>
              <Text style={styles.selectTransportText}>Pick your ride:</Text>
              <SelectDropdown
                data={transportTypes}
                onSelect={(selectedItem, index) => {
                  setTransport(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                defaultButtonText={'DRIVING'}
                buttonTextStyle={{
                  fontSize: 15,
                  textAlign: 'center',
                  fontWeight: '400',
                  color: COLORS.primary,
                  opacity: 0.9,
                }}
                dropdownStyle={{
                  borderRadius: '5%',
                }}
                rowTextStyle={{
                  fontSize: 15,
                  textAlign: 'center',
                  fontWeight: '400',
                  color: COLORS.dark,
                  opacity: 0.9,
                }}
              />
            </View>
            <View style={{ height: 200 }}></View>
          </ScrollView>
          <View style={styles.loginBtnWrapper}>
            <TouchableOpacity
              disabled={RegisterClicked}
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.7}
              style={styles.loginBtn}>
              {RegisterClicked ? (
                <Loading></Loading>
              ) : (
                <Text style={styles.loginText}>Register</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}> Already have an account? </Text>

          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
            <Text style={styles.signupBtn}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;

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
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    height: 55,
    paddingVertical: 0,
  },
  selectTransportText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '400',
    color: COLORS.grayLight,
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
    borderRadius: 5,
    height: 55,
    paddingVertical: 0,
  },

  loginBtnWrapper: {
    backgroundColor: COLORS.primary,
    height: 55,
    marginTop: 12,
    borderRadius: '50%',
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
    borderRadius: 50,
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
