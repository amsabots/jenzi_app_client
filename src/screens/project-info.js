import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  View,
  InteractionManager,
  StyleSheet,
  ToastAndroid,
} from 'react-native';

//axios
import axios from 'axios';
axios.defaults.timeout = 10000;
import moment from 'moment';

// Redux navigation
import {useDispatch, connect} from 'react-redux';
import {Button, Chip, TextInput} from 'react-native-paper';
import {
  UISettingsActions,
  user_data_actions,
  task_actions,
} from '../store-actions';

import {
  DefaultToolBar,
  InfoChips,
  LoaderSpinner,
  LoadingModal,
  PlainFundiProfile,
} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {endpoints, errorMessage} from '../endpoints';
import {ScrollView} from 'react-native-gesture-handler';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const ProjectInfo = ({navigation, route, user_data}) => {
  const {project} = route.params;
  const {LONG, SHORT, BOTTOM, TOP} = ToastAndroid;
  const {client, fundiId, pendingTaskStates, taskState, createdAt, title} =
    project;
  // application state variables
  const [view_ready, setViewReady] = useState(false);
  const [fundi, setFundi] = useState();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [action, setAction] = useState('');
  const [reason_getter, setReasonGette] = useState(false);
  // Redux handlers and hooks
  const dispatch = useDispatch();

  useCallback(
    InteractionManager.runAfterInteractions(() => {
      setViewReady(true);
    }),
    [],
  );

  // component functions

  const update_job = async task => {
    try {
      setLoading(true);
      await axios.put(`${endpoints.client_service}/jobs/${project.id}`, task);
      const obj = {...project, ...task};
      dispatch(task_actions.update_job(obj));
      ToastAndroid.showWithGravity(
        'The task has been updated successfully, Exit to previous page to effect new changes',
        LONG,
        TOP,
      );
    } catch (error) {
      console.log(error);
      errorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  async function handleReasonSubmit() {
    if (!reason)
      return ToastAndroid.show(
        'A brief reason must be provided',
        ToastAndroid.SHORT,
      );
    let obj = project;
    delete obj['id'];
    if (action == 'cancel') {
      if (pendingTaskStates !== 'CANCEL_PENDING')
        return alert(
          `You cannot cancel this action until the process is initiated by ${fundi.name}. Please contact them through chats  to initiate the process`,
        );
      obj = {...obj, pendingTaskStates: 'CANCELLED', taskState: 'CANCELLED'};
    } else {
      obj = {...obj, pendingTaskStates: 'DISPUTED', taskState: 'DISPUTED'};
    }
    await update_job(obj);
  }

  async function submitReason() {
    if (pendingTaskStates !== 'COMPLETE_PENDING')
      return alert(
        `You cannot complete this action until the process is initiated by ${fundi.name}. Please contact them through chats  to initiate the process`,
      );
    const clone_proj = project;
    delete clone_proj['id'];
    await update_job({
      ...clone_proj,
      pendingTaskStates: 'COMPLETE',
      taskState: 'COMPLETE',
    });
  }

  //effects functions
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);

  // use effect for incoming changes from previous screen

  if (!view_ready) {
    return (
      <View style={[styles.container, styles.center_in_view]}>
        <LoaderSpinner.RingedLoader loading={true} size={100} />
        <Text
          style={{
            ...FONTS.captionBold,
            color: COLORS.secondary,
            marginTop: SIZES.padding_16,
          }}>
          Please wait........
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={[styles.container]}>
        <DefaultToolBar title="Project details" navigation={navigation} />
        <View style={[styles.container]}>
          {/* ==============   FUNDI PROFILE VIEWER ======= */}
          <View style={[styles.center_in_view]}>
            <PlainFundiProfile
              fundiId={project.fundiId}
              onFundiFinished={fundi_details => setFundi(fundi_details)}
              navigation={navigation}
            />
          </View>
          <Text
            style={{
              marginVertical: SIZES.padding_12,
              ...FONTS.body_medium,
              marginLeft: SIZES.base,
            }}>
            Project details
          </Text>
          {/* ============ PROJECT DETAILS ============== */}
          <View style={[styles._section]}>
            <Text style={{...FONTS.body_bold}}>{title}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: SIZES.base,
              }}>
              <View>
                <Text style={{...FONTS.caption}}>Your status</Text>
                <InfoChips text={taskState} textColor={COLORS.secondary} />
              </View>
              {/*===== ============== ============ */}
              <View>
                <Text style={{...FONTS.caption}}>Fundi status</Text>
                <InfoChips
                  text={pendingTaskStates}
                  textColor={COLORS.blue_deep}
                />
              </View>
            </View>
            <Text style={{...FONTS.captionBold, marginTop: SIZES.base}}>
              Started: <Text>{moment(createdAt).fromNow()}</Text>
            </Text>
          </View>
          {/* =============  PROJECT ACTIONS ========== */}
          <Text
            style={{
              marginVertical: SIZES.padding_12,
              ...FONTS.body_medium,
              marginLeft: SIZES.base,
            }}>
            Project actions
          </Text>
          <View style={[styles._section, styles._action]}>
            {taskState !== 'COMPLETE' ? (
              <Chip
                style={{backgroundColor: COLORS.secondary}}
                textStyle={styles._action_chip}
                onPress={() => {
                  setAction('complete');
                  submitReason();
                  setReasonGette(false);
                }}>
                Complete
              </Chip>
            ) : null}
            <Chip
              style={{backgroundColor: COLORS.blue_deep}}
              textStyle={styles._action_chip}
              onPress={() => {
                setAction('cancel');
                setReasonGette(true);
              }}>
              Cancel
            </Chip>
            <Chip
              style={{backgroundColor: COLORS.primary}}
              textStyle={styles._action_chip}
              onPress={() => {
                setAction('dispute');
                setReasonGette(true);
              }}>
              Raise dispute
            </Chip>
          </View>

          {/* =============  PROJECT ACTIONS EXECUTOR ========== */}
          {reason_getter && (
            <>
              <Text
                style={{
                  marginVertical: SIZES.padding_12,
                  ...FONTS.body_medium,
                  marginLeft: SIZES.base,
                }}></Text>
              <View
                style={[styles._section, {paddingBottom: SIZES.padding_32}]}>
                <Text style={{...FONTS.caption, color: COLORS.secondary}}>
                  Provide a brief explanation for your choice of Action
                </Text>

                <TextInput
                  placeholder="Brief details"
                  mode="outlined"
                  dense={true}
                  style={{marginTop: SIZES.base}}
                  activeOutlineColor={COLORS.secondary}
                  multiline={true}
                  label={
                    action === 'cancel'
                      ? 'Why do you wanna cancel'
                      : 'Why are you raising a dispute'
                  }
                  numberOfLines={3}
                  onChangeText={txt => setReason(txt)}
                />
                <Button
                  style={{marginTop: SIZES.padding_16}}
                  mode={'contained'}
                  onPress={() => handleReasonSubmit()}>
                  Submit request
                </Button>
              </View>
            </>
          )}
          {/* ========== END OF CONTAINER WRAPPER ============= */}
          <LoadingModal
            onDismiss={() => setLoading(false)}
            label={'Please wait......'}
            show={loading}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center_in_view: {justifyContent: 'center', alignItems: 'center'},
  container: {flex: 1},
  _section: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding_16,
    paddingVertical: SIZES.base,
  },
  _action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding_32,
  },
  _action_chip: {
    color: COLORS.white,
  },
});

export default connect(mapStateToProps)(ProjectInfo);
