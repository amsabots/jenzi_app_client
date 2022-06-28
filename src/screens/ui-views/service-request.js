import React, {useState, useEffect, useMemo, memo, useCallback} from 'react';
import {Button, Portal, Modal} from 'react-native-paper';
import {View, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
// constants
import {FONTS, SIZES} from '../../constants/themes';
import {COLORS} from '../../constants/themes';
//
import _ from 'lodash';
import {screens} from '../../constants';

const mapStateToProps = state => {
  const {fundis} = state;
  return {fundis};
};

const RequestTitle = memo(({onAccept, show = false, onHide}) => {
  const [title, setTitle] = useState('');
  return (
    <Portal>
      <Modal
        visible={show}
        onDismiss={onHide}
        contentContainerStyle={styles.modal_conatiner}>
        <View>
          <Text>Please confirm your request to initiate the process</Text>
          <View
            style={{
              marginTop: SIZES.padding_16,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Button onPress={onHide} color={COLORS.primary}>
              Cancel
            </Button>
            <Button onPress={onAccept} color={COLORS.secondary}>
              Send Request
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
});

const ServiceRequestView = ({sendRequest, current_project, navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const [disableBtn, set_disable_button] = useState(false);

  const handleAccept = useCallback(() => {
    sendRequest();
    setShowModal(false);
  }, [showModal]);

  return (
    <View style={{marginVertical: SIZES.padding_16}}>
      {Object.keys(current_project).length ? (
        <Button
          mode="contained"
          disabled={disableBtn}
          style={{backgroundColor: COLORS.secondary}}
          onPress={() => {
            setShowModal(true);
          }}>
          request service
        </Button>
      ) : (
        <Button
          mode="outlined"
          style={{borderColor: COLORS.blue_deep}}
          labelStyle={{...FONTS.caption, textTransform: 'capitalize'}}
          onPress={() => navigation.navigate(screens.project_creator_wizard)}>
          Create project
        </Button>
      )}
      <RequestTitle
        show={showModal}
        onHide={() => setShowModal(false)}
        onAccept={handleAccept}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modal_conatiner: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding_32,
    marginHorizontal: SIZES.padding_16,
    borderRadius: SIZES.base,
  },
});

export const ServiceRequest = connect(mapStateToProps)(ServiceRequestView);
