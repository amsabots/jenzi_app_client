import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Caption} from 'react-native-paper';
//toast
import {
  LoadingModal,
  DefaultToolBar,
  CircularImage,
  InfoChips,
} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
// icons
import AIcons from 'react-native-vector-icons/AntDesign';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {useDispatch, connect} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {screens} from '../constants';

const stateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const MenuItem = ({icon_name = 'adduser', to_screen, label, navigation}) => {
  return (
    <TouchableOpacity
      style={sub_styles._container}
      onPress={() => navigation.navigate(to_screen)}>
      <View style={sub_styles._icon_container}>
        <AIcons
          name={icon_name}
          size={SIZES.icon_size}
          color={COLORS.blue_deep}
        />
      </View>
      <Text style={{...FONTS.body_medium}}>{label}</Text>
    </TouchableOpacity>
  );
};

const sub_styles = StyleSheet.create({
  _container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding_12,
  },
  _icon_container: {
    height: SIZES.padding_32,
    width: SIZES.padding_32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.light_bluish,
    marginRight: SIZES.icon_size,
  },
});

const Profile = ({navigation, user_data}) => {
  // ui variables - transient
  const [showLoader, setShowModal] = useState(false);
  const {user} = user_data;
  // redux store
  const dispatch = useDispatch();
  // mount on the first render only
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);

  return (
    <View style={{flex: 1}}>
      {/* toolbar */}
      <DefaultToolBar navigation={navigation} title="Profile" />
      <View style={styles.container}>
        <LoadingModal show={showLoader} onDismiss={() => setShowModal(false)} />
        <ScrollView>
          {/* section one - details preview */}
          <View style={[styles._section_card, styles._current_profile]}>
            <CircularImage size={72} />
            <Text style={{...FONTS.body1}}>{user?.name}</Text>
            <Caption>{user?.username}</Caption>
            <View style={styles._account_state}>
              <InfoChips
                text={user?.is_verified ? 'Verified' : 'Unverified'}
                textColor={COLORS.info}
              />
              <InfoChips
                text={user?.is_active ? 'Active' : 'Disabled'}
                textColor={COLORS.secondary}
              />
            </View>
            {/*  */}
            <Text>Contact: {user?.phone_number || user?.username}</Text>
          </View>
          {/*  */}
          <View style={styles._profile_manager}>
            <Text
              style={{
                ...FONTS.body_medium,
                color: COLORS.blue_deep,
                marginBottom: SIZES.padding_16,
              }}>
              Profile managers
            </Text>
            <MenuItem
              label={'Basic Info'}
              navigation={navigation}
              to_screen={screens.profile_basic_details}
            />
            <MenuItem
              label={'Password Editor'}
              icon_name={'key'}
              navigation={navigation}
              to_screen={screens.profile_password_edit}
            />
            <MenuItem
              label={'Account Preferences'}
              icon_name={'tool'}
              navigation={navigation}
              to_screen={screens.profile_password_edit}
            />
          </View>
          {/*  */}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.disabled_grey,
  },
  _section_card: {
    paddingVertical: SIZES.padding_32,
    paddingHorizontal: SIZES.padding_16,
    backgroundColor: COLORS.white,
    marginBottom: SIZES.padding_16,
  },
  _current_profile: {
    alignItems: 'center',
  },
  _account_state: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SIZES.base,
  },
  _profile_manager: {
    paddingHorizontal: SIZES.padding_16,
  },
});

export default connect(stateToProps)(Profile);
