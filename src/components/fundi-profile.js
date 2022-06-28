import React, {useState, useEffect, useCallback} from 'react';

import {Button, Chip, Divider} from 'react-native-paper';
import {View, Text, StyleSheet, ToastAndroid, Vibration} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {connect, useDispatch} from 'react-redux';
import {fundiActions, UISettingsActions} from '../store-actions';

//UI sub components
import {ServiceRequest, PendingRequests} from '../screens/ui-views';

//components
//prettier-ignore
import {CircularImage, InfoChips, LoaderSpinner, LoadingNothing, LoadingModal} from '.';
//icons
import AIcons from 'react-native-vector-icons/AntDesign';
import {pusher_filters} from '../constants';

//toast
import Toast from 'react-native-toast-message';
//
import {axios_endpoint_error, endpoints} from '../endpoints';
import axios from 'axios';
import _ from 'lodash';
axios.defaults.timeout = 10000;
axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

const logger = console.log.bind(console, `[file: fundi-profile.js]`);
//
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

const Fundi_projects = ({project}) => {
  const [client_info, set_client_info] = useState('N/A');
  useEffect(() => {
    axios.get(`/clients/${project.clientId}`).then(res => {
      set_client_info(res.data);
    });
    return () => {
      set_client_info('N/A');
    };
  }, []);
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: SIZES.base,
        }}>
        <AIcons
          name="verticleleft"
          size={SIZES.padding_16}
          color={COLORS.green}
        />
        <Text style={{...FONTS.captionBold, marginLeft: SIZES.padding_16}}>
          {project?.title || 'Project Info Missing'}
        </Text>
      </View>
      <Text
        style={{textAlign: 'right', ...FONTS.caption, color: COLORS.blue_deep}}>
        <Text style={{color: COLORS.grey_dark}}>Client: </Text>
        {client_info.name}
      </Text>
    </View>
  );
};

const Fundi_trainedBy = ({trained_by}) => {
  const {organization, verified} = trained_by;
  return (
    <View>
      <View>
        <Chip
          style={{
            backgroundColor: COLORS.light_green,
            marginRight: SIZES.base,
          }}
          icon={verified ? 'check-circle-outline' : ''}
          textStyle={{color: COLORS.green}}>
          {trained_by?.organization || 'N/A'}
        </Chip>
      </View>
    </View>
  );
};

const DetailsView = ({fundis, user_data, tasks, navigation}) => {
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [trainedBy, set_trained_by] = useState([]);
  const [projects, set_fundi_projects] = useState([]);
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
      user: _.pick(user, 'id', 'client_id', 'name', 'username'),
      destination: _.pick(fundi, 'account_id', 'id', 'name', 'username'),
      status: pusher_filters.request_user,
    };
    console.log(payload);
    set_modal_loader(true);
    try {
      const res = await axios.post(
        `${endpoints.realtime_base_url}/jobs/requests`,
        payload,
        {timeout: 8000},
      );
      payload.requestId = res.data.requestId;
      dispatch(fundiActions.get_all_Sent_requests([payload]));
      //prettier-ignore
      return Toast.show({type: 'success',text2: 'Request sent, Please wait response.....'});
    } catch (error) {
      //prettier-ignore
      return Toast.show({type: 'error',text2: 'Failed Retry later.....',});
    } finally {
      set_modal_loader(false);
    }
  };

  //call the requests delete endpoint when the cancel icon has been clicked on the requests sent component
  const handleCancelRequest = el => {
    //prettier-ignore
    Toast.show({type:"info", text2:"Cancelling the request, Please wait....", position:"bottom"})
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

  useEffect(() => {
    setLoad(true);
    axios
      .get(`/fundi-tasks/user/${fundi.id}`)
      .then(async res => {
        const {data} = res.data;
        const projects_data = data?.filter(el => {
          if (el?.fundi_data?.state?.toLowerCase() === 'inprogress') return el;
        });
        const {data: d} = await axios.get(
          `/fundi-trained-by/fundi/${fundi.id}`,
        );
        set_fundi_projects(projects_data);
        set_trained_by(d);
      })
      .catch(err => console.log(err))
      .finally(() => setLoad(false));
    return () => {
      setLoad(false);
    };
  }, []);

  return Object.keys(fundi).length ? (
    <View style={styles.container}>
      {/* ===== loading modal */}
      <LoadingModal
        show={modal_loader}
        onDismiss={() => set_modal_loader(false)}
        label="Sending........"
      />
      <CircularImage size={100} url={fundi?.photo_url} />
      {/*  */}
      <View style={styles._details}>
        <Text style={{...FONTS.body_bold, marginBottom: SIZES.base}}>
          {fundi?.name || 'Not Available'}
        </Text>
        {/* NCA section */}
        <View style={{alignItems: 'center', marginBottom: SIZES.padding_16}}>
          <Text style={{...FONTS.captionBold, color: COLORS.secondary}}>
            NCA number:
          </Text>
          <Text style={{...FONTS.caption}}>
            {fundi?.nca_number || 'Not yet registered with NCA'}
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
            ) : trainedBy.length ? (
              trainedBy.map((el, idx) => (
                <Fundi_trainedBy trained_by={el} key={idx} />
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
                flexWrap: 'wrap',
                marginTop: SIZES.base,
              }}>
              {load ? (
                <Loader label="Loading user projects........" />
              ) : projects.length ? (
                projects.map((el, idx) => (
                  <Fundi_projects key={idx} project={el} />
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
      </View>
      {/* =========== handler attached to on accept of the module window from the adjacent activity =============  */}
      {fundis.sent_requests.length < 1 && (
        <>
          <View style={styles._border_line}></View>
          <ServiceRequest
            sendRequest={handleSendRequest}
            current_project={current_project}
            navigation={navigation}
          />
          <View style={styles._border_line}></View>
        </>
      )}
    </View>
  ) : (
    <LoadingNothing label={'No details available'} />
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
