import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
//redux store
import {useDispatch, connect} from 'react-redux';
import {UISettingsActions} from '../store-actions';

//iocns
import MIcons from 'react-native-vector-icons/MaterialIcons';
import EIcons from 'react-native-vector-icons/Entypo';
//Ui components
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {CircularImage} from '../components';
import {Button, Dialog, Portal, Paragraph} from 'react-native-paper';
//
import Toast from 'react-native-toast-message';

const mapStateToProps = state => {
  return {state};
};

const Logout = ({navigation}) => {
  const dispatch = useDispatch();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [confirmBtn, setConfirmBtn] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);

  const handleLogout = () => {
    setShowConfirmation(true);
    setConfirmText(
      'We are sad to see you gone but you can always come back next time',
    );
    setType('logout');
    setConfirmBtn('Logout');
  };

  const handleDelete = () => {
    setShowConfirmation(true);
    setConfirmText(
      `This action is non reversible, you will loose all your data\n\n Please confirm you want to purge and delete your Account`,
    );
    setType('delete');
    setConfirmBtn('Delete');
  };

  const handleDismiss = () => {
    setShowConfirmation(false);
  };

  const handleOnAccept = () => {
    setShowConfirmation(false);
    if (type === 'logout') {
      Toast.show({type: 'info', text2: 'Logged out successfully'});
    } else if (type === 'delete') {
      Toast.show({type: 'error', text2: 'Deleted account successfully'});
    }
  };

  return (
    <View style={styles.container}>
      <EIcons
        color={COLORS.secondary}
        name="cross"
        size={SIZES.padding_32}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.content_wrapper}>
        <CircularImage size={120} />
        <Text style={{...FONTS.body1, marginVertical: SIZES.base}}>
          NAME GOES HERE
        </Text>
        <Text style={{...FONTS.body_medium}}>email@gmail.com</Text>
        <Button
          mode="contained"
          style={{
            width: '80%',
            backgroundColor: COLORS.primary,
            marginTop: SIZES.padding_32,
          }}
          onPress={() => handleLogout()}>
          Logout
        </Button>
        <Button
          onPress={handleDelete}
          mode="outlined"
          color={COLORS.secondary}
          style={{
            width: '80%',
            borderColor: COLORS.secondary,
            marginVertical: SIZES.padding_16,
            borderWidth: 1,
          }}>
          Delete Account
        </Button>
      </View>
      {/* dialogur box */}
      <Portal>
        <Dialog visible={showConfirmation} onDismiss={handleDismiss}>
          <Dialog.Content>
            <Paragraph>{confirmText}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleOnAccept} color={COLORS.secondary}>
              {confirmBtn}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: SIZES.padding_16},
  content_wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default connect(mapStateToProps)(Logout);
