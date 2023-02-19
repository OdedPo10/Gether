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
  Alert,
  Modal,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontiso from 'react-native-vector-icons/Fontisto';

import { COLORS, ROUTES } from '../../constants';
const SideBar = () => {
  return (
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
                style={styles.profilePic4}
              />
            </View>
          </View>
          <View style={styles.userNameDiv}>
            <Text style={styles.sideBaruserName}>{user.name}</Text>
          </View>
          <View style={styles.sideBarButtons}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.sideBarTouchable}>
              <Text style={styles.sideBarText}>Join event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.sideBarTouchable}>
              <Text style={styles.sideBarText}>instant event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.sideBarTouchable}>
              <Text style={styles.sideBarText}>future event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.sideBarTouchable && { marginTop: '220%' }}>
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
  );
};

export default SideBar;

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
  userHeader: {
    backgroundColor: COLORS.primary,
    height: '18.2%',
    width: '100%',
    alignItems: 'center',
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
  profilePic4: {
    height: 75,
    width: 75,
    // borderRadius: 50,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 2.5,
  },
  sideBarTouchable: {
    height: '13%',
    width: '100%',
  },
  userNameDiv: {
    marginTop: '20%',
    marginLeft: '-93%',
  },
  circle4: {
    height: 85,
    width: 85,
    backgroundColor: 'white',
    // borderRadius: 50,
    // marginLeft: 45,
    marginTop: 130,
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
    color: COLORS.grayLight,
    fontSize: 20,
    fontWeight: '600',
  },
});
