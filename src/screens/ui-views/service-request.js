import React, {useState, useEffect, useMemo, memo, useCallback} from 'react';
import {Button, Portal, Modal, TextInput} from 'react-native-paper';
import {View, Text, StyleSheet} from 'react-native';
// constants
import {SIZES} from '../../constants/themes';
import {COLORS} from '../../constants/themes';
//
import _ from 'lodash';

//redux
import {useDispatch, connect} from 'react-redux';
import axios from 'axios';
//
import {endpoints} from '../../endpoints';
import Toast from 'react-native-toast-message';

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

const ServiceRequestView = ({sendRequest, fundis}) => {
  const [showModal, setShowModal] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  const handleAccept = useCallback(() => {
    sendRequest();
    setShowModal(false);
  }, [showModal]);

  return (
    <View style={{marginVertical: SIZES.padding_16}}>
      <Button
        mode="contained"
        disabled={disableBtn}
        style={{backgroundColor: COLORS.secondary}}
        onPress={() => {
          setShowModal(true);
        }}>
        request service
      </Button>
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
