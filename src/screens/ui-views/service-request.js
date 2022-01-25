import React, {useState, useEffect, useMemo} from 'react';
import {Button, Portal, Modal, TextInput} from 'react-native-paper';
import {View, Text, StyleSheet} from 'react-native';
// constants
import {SIZES} from '../../constants/themes';
import {COLORS} from '../../constants/themes';

const RequestTitle = ({onAccept, show = falsen, onHide, user}) => {
  return (
    <Portal>
      <Modal
        visible={show}
        onDismiss={onHide}
        contentContainerStyle={styles.modal_conatiner}>
        <View>
          <TextInput
            placeholder="Enter project title"
            dense={true}
            mode="outlined"
            outlineColor={COLORS.secondary}
            activeOutlineColor={COLORS.secondary}
          />
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
};

const ServiceRequest = ({user, sendRequest, disableBtn = false}) => {
  const [showModal, setShowModal] = useState(false);

  const handleAccept = () => {
    setShowModal(false);
    sendRequest(user);
  };
  return (
    <View style={{marginVertical: SIZES.padding_16}}>
      <Button
        mode="contained"
        disabled={disableBtn}
        style={{backgroundColor: COLORS.secondary}}
        onPress={() => setShowModal(true)}>
        request service
      </Button>
      <RequestTitle
        show={showModal}
        onHide={() => setShowModal(false)}
        onAccept={handleAccept}
        user={user}
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

export {ServiceRequest};
