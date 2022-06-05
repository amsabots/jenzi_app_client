import React, {useState, useEffect, useCallback} from 'react';

import {Button, Chip, Divider} from 'react-native-paper';
import {View, Text, StyleSheet, ToastAndroid, Vibration} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {connect, useDispatch} from 'react-redux';
import {fundiActions, UISettingsActions} from '../store-actions';

//UI sub components
import {ServiceRequest, PendingRequests} from '../screens/ui-views';

//components
import {
  CircularImage,
  ReviewContainer,
  InfoChips,
  LoaderSpinner,
  LoadingNothing,
  LoadingModal,
} from '.';
//icons
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {pusher_filters} from '../constants';

//toast
import Toast from 'react-native-toast-message';
import axios from 'axios';
axios.defaults.timeout = 10000;
import {endpoints} from '../endpoints';

const logger = console.log.bind(console, `[file: fundi-profile.js]`);
const mapStateToProps = state => {
  const {fundis, user_data, tasks} = state;
  return {fundis, user_data, tasks};
};

const Loader = ({type = 'a', label = 'Fetching........'}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <LoaderSpinner.ArcherLoader loading={true} />
      <Text>{label}</Text>
    </View>
  );
};

const DetailsView = ({
  leadinglabel = 'No details available',
  fundis,
  user_data,
  tasks,
}) => {
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [trainedBy, setTraineddBy] = useState([]);
  const [projects, setLoadProjects] = useState([]);
  // timer to track the request validity period -

  const {selected_fundi: fundi} = fundis;
  const {current_project} = tasks;
  const [modal_loader, set_modal_loader] = useState(false);

  //get the title provided and validate
  const handleSendRequest = async () => {
    if (Object.values(current_project).filter(Boolean).length < 1)
      return Toast.show({
        type: 'error',
        text1: 'Missing project',
        text2: 'Create project first then come back here',
      });
    //
    const {user} = user_data;
    const payload = {
      payload: current_project,
      user: user,
      destination: fundi.account,
      status: pusher_filters.request_user,
    };
    set_modal_loader(true);

    try {
      const res = await axios.post(
        `${endpoints.realtime_base_url}/jobs/requests`,
        payload,
        {timeout: 8000},
      );
      payload.requestId = res.data.requestId;
      dispatch(fundiActions.get_all_Sent_requests([payload]));
      return Toast.show({
        type: 'success',
        text2: 'Request sent, Please wait response.....',
      });
    } catch (error) {
      return Toast.show({
        type: 'error',
        text2: 'Failed Retry later.....',
      });
    } finally {
      set_modal_loader(false);
    }
  };

  //call the requests delete endpoint when the cancel icon has been clicked on the requests sent component
  const handleCancelRequest = el => {
    ToastAndroid.showWithGravity(
      'cancelling....',
      ToastAndroid.CENTER,
      ToastAndroid.LONG,
    );
    try {
      axios.delete(
        `${endpoints.realtime_base_url}/jobs/requests/${el.requestId}`,
        {
          timeout: 5000,
        },
      );
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(fundiActions.delete_current_requests());
      dispatch(
        UISettingsActions.snack_bar_info(
          'The requested has been cancelled successfully. You can always try again later',
        ),
      );
      Vibration.vibrate();
    }
  };

  return Object.keys(fundi).length ? (
    <View style={styles.container}>
      {/* ===== loading modal */}
      <LoadingModal
        show={modal_loader}
        onDismiss={() => set_modal_loader(false)}
        label="Sending........"
      />
      <CircularImage size={100} url={fundi.account.photo_url} />
      {/*  */}
      <View style={styles._details}>
        <Text style={{...FONTS.body_bold, marginBottom: SIZES.base}}>
          {fundi.account.name || 'Not Available'}
        </Text>
        {/* NCA section */}
        <View style={{alignItems: 'center', marginBottom: SIZES.padding_16}}>
          <Text style={{...FONTS.captionBold, color: COLORS.secondary}}>
            NCA number:
          </Text>
          <Text style={{...FONTS.caption}}>
            {fundi.account.ncaNumber || 'Not yet registered with NCA'}
          </Text>
          <Divider s />
        </View>

        {/* ====================== */}
        <View
          style={{
            marginVertical: SIZES.base,
            width: '100%',
          }}>
          <Text style={styles._section_header}>Trained by</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {load ? (
              <Loader label="Loading training organizations........" />
            ) : projects.length ? (
              [1, 2].map((el, idx) => (
                <InfoChips
                  key={idx}
                  text={'NIBS College'}
                  textColor={COLORS.blue_deep}
                  containerStyles={{
                    marginRight: SIZES.padding_4,
                    marginBottom: SIZES.padding_4,
                  }}
                />
              ))
            ) : (
              <LoadingNothing label={'Training not available'} width={100} />
            )}
          </View>
          {/* ============= projects */}
          <View style={{marginVertical: SIZES.padding_12}}>
            <Text style={styles._section_header}>Completed projects</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: SIZES.base,
              }}>
              {load ? (
                <Loader label="Loading user projects]........" />
              ) : trainedBy.length ? (
                [1, 2, 3, 4, 5, 6].map((el, idx) => (
                  <Chip
                    style={{marginBottom: 4, marginRight: SIZES.padding_16}}>
                    SGR construction
                  </Chip>
                ))
              ) : (
                <LoadingNothing label={'0 Projects done'} width={100} />
              )}
            </View>
          </View>
        </View>

        {/* =================== component to show the request sending status =============== */}
        <PendingRequests onCancel={el => handleCancelRequest(el)} />
        {/* ============= ============================= */}
        <View style={styles._border_line}></View>
      </View>
      {/* =========== handler attached to on accept of the module window from the adjacent activity =============  */}
      {fundis.sent_requests.length < 1 && (
        <ServiceRequest sendRequest={handleSendRequest} />
      )}
      <View style={styles._border_line}></View>
      {/* <View style={styles._reviews}>
        <ReviewContainer />
      </View> */}
    </View>
  ) : (
    <LoadingNothing label={leadinglabel} />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SIZES.padding_12,
    paddingHorizontal: SIZES.padding_16,
  },
  _details: {
    marginVertical: SIZES.base,
    width: '100%',
    alignItems: 'center',
  },
  _reviews: {
    width: '100%',
  },
  _section_header: {
    color: COLORS.secondary,
    ...FONTS.captionBold,
    marginBottom: SIZES.base,
  },
  _border_line: {
    borderColor: COLORS.light_secondary,
    borderWidth: SIZES.stroke,
    width: '100%',
    marginVertical: SIZES.padding_12,
  },
});

export const FundiDetails = connect(mapStateToProps)(DetailsView);
