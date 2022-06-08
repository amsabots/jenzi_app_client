import React, {useState, useEffect} from 'react';
import {
  View,
  InteractionManager,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import {useDispatch, connect} from 'react-redux';
import {Portal, Modal, Button} from 'react-native-paper';
import Dialog from 'react-native-dialog';
import {
  FundiDetails,
  DefaultToolBar,
  LoaderSpinner,
  LoadingNothing,
} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {fundiActions, UISettingsActions} from '../store-actions';
import {screens} from '../constants';

const mapStateToProps = state => {
  const {ui_settings, fundis} = state;
  return {ui_settings, fundis};
};

const RequestDeclinedAlert = ({show, onCancel, label}) => {
  return (
    <View>
      <Dialog.Container visible={show} onBackdropPress={onCancel}>
        <View>
          <Text style={{...FONTS.body_bold, color: COLORS.danger}}>
            Request Declined
          </Text>
          {/* Body  */}
          <View>
            <View>
              <LoadingNothing width={64} height={64} />
            </View>
            <Text style={{...FONTS.body}}>{label}</Text>
          </View>
        </View>
        <Dialog.Button label="Ok" onPress={onCancel} />
      </Dialog.Container>
    </View>
  );
};

const HomeDetailsPreview = ({navigation, route, ui_settings, fundis}) => {
  const [is_ready, setReady] = useState(false);
  const [project_success, setSuccessModal] = useState(false);
  const [request_declined, setRequestDeclined] = useState(true);
  const data = route.params;
  const dispatch = useDispatch();
  //component function handlers
  const handle_user_declined = () => {
    dispatch(UISettingsActions.update_project_tracker(null));
    setRequestDeclined(false);
  };

  // get data from store props
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setReady(true);
      dispatch(fundiActions.set_selected_fundi(data));
    });
    return () => {
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const {project_tracker} = ui_settings;
    if (project_tracker) {
      const {action, payload} = project_tracker;
      switch (Number(action)) {
        case 1:
          setSuccessModal(true);
          break;
        case 2:
          setRequestDeclined(true);
          break;
      }
    }

    return () => {
      setSuccessModal(false);
    };
  }, [ui_settings.project_tracker]);

  if (!is_ready)
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <LoadingNothing />
        <Text
          style={{
            ...FONTS.captionBold,
            textAlign: 'center',
            color: COLORS.blue_deep,
            marginTop: SIZES.padding_16,
          }}>
          Fetching data, please wait.....
        </Text>
      </View>
    );

  return (
    <ScrollView>
      <View>
        <DefaultToolBar navigation={navigation} title="Fundi Info" />
        <FundiDetails />

        {/* Some awesome modal stuff */}
        <Portal>
          <RequestDeclinedAlert
            show={request_declined}
            onCancel={handle_user_declined}
            label={
              fundis?.selected_fundi?.account?.name +
              ' Has declined your request. Exit and select another fundi'
            }
          />
          {/* Success modal - prompt user to provide next screen prompt action input */}
          <Modal
            visible={project_success}
            onDismiss={() => {
              setSuccessModal(false);
              dispatch(UISettingsActions.update_project_tracker({}));
            }}
            contentContainerStyle={styles._modal_style}
            dismissable={false}>
            <View style={styles._modal_container_wrapper}>
              <LoaderSpinner.SuccessAnimation width={120} height={120} />
              <Text
                style={{
                  ...FONTS.body_medium,
                  marginHorizontal: SIZES.base,
                }}>
                Fundi accepted your request. We have initiated the project
                automatically for the period it will be active. Please remember
                to update project status.
              </Text>
              <View style={styles._modal_footer_container}>
                <Button>
                  <Text
                    style={{...FONTS.caption, color: COLORS.grey_dark}}
                    onPress={() => navigation.navigate(screens.projects)}>
                    Open project
                  </Text>
                </Button>
                <Button>
                  <Text
                    style={{...FONTS.captionBold}}
                    onPress={() => navigation.navigate(screens.conversation)}>
                    Open chats
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
        </Portal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SIZES.base,
  },
  _modal_style: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    alignSelf: 'baseline',
    width: '90%',
    marginHorizontal: SIZES.padding_16,
    paddingVertical: SIZES.base,
  },
  _modal_container_wrapper: {
    alignItems: 'center',
  },
  _modal_footer_container: {
    marginTop: SIZES.padding_16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  _modal_footer_btns: {
    flexGrow: 1,
  },
});

export default connect(mapStateToProps)(HomeDetailsPreview);
