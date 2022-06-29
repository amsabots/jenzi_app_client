import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  View,
  InteractionManager,
  StyleSheet,
  ScrollView,
} from 'react-native';
// Redux navigation
import {useDispatch, connect} from 'react-redux';
import {Button, Card} from 'react-native-paper';
import {UISettingsActions, task_actions} from '../store-actions';

import {DefaultToolBar, LoaderSpinner, LoadingModal} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {endpoints, axios_endpoint_error} from '../endpoints';
import Entypo from 'react-native-vector-icons/Entypo';
//axios
import axios from 'axios';
import moment from 'moment';
import AssigneeInfo from './project-settings/assignee-info';
import Toast from 'react-native-toast-message';

axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const ProjectInfo = ({navigation, route, user_data}) => {
  const {project} = route.params;
  // application state variables
  const [view_ready, setViewReady] = useState(false);
  const [loading, setLoading] = useState(false);
  //prettier-ignore
  const {task_state, createdAt, title, requirements, text_info, task_id, id} =
    project?.task_entry;
  const requirements_array = requirements
    ? requirements?.split('>').splice(0, 4)
    : ['No project requirements provided'];

  // Redux handlers and hooks
  const dispatch = useDispatch();

  const delete_project_entry = () => {
    setLoading(true);
    axios
      .delete(`/tasks/${id}`)
      .then(() => {
        //prettier-ignore
        Toast.show({type:"success", text2:"Successfully removed the job entry"})
        dispatch(UISettingsActions.refresh_component());
        navigation.goBack();
      })
      .catch(err => axios_endpoint_error(err))
      .finally(() => setLoading(false));
  };

  useCallback(
    InteractionManager.runAfterInteractions(() => {
      setViewReady(true);
    }),
    [],
  );
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
        <DefaultToolBar
          title="Project details"
          navigation={navigation}
          del={true}
          onDeleteClicked={delete_project_entry}
        />
        <View style={[styles.container]}>
          <Text style={styles._project_txt_title}>Project details</Text>
          {/* ============ PROJECT DETAILS ============== */}
          <View style={[styles._section]}>
            {/* body */}
            <View style={{marginHorizontal: SIZES.padding_16}}>
              <Text style={{...FONTS.body_bold, color: COLORS.blue_deep}}>
                {title}
              </Text>
              <Text style={styles._project_time_start}>
                Started: <Text>{moment(createdAt).fromNow()}</Text>
              </Text>
              <Text style={styles._project_txt_requirements}>Requirements</Text>
              <View>
                {requirements_array.map((el, idx) => {
                  return (
                    <View
                      style={{flexDirection: 'row', width: '100%'}}
                      key={idx}>
                      <Entypo
                        name="dot-single"
                        color={`#${task_id.substring(0, 6)}`}
                        size={SIZES.padding_16}
                      />
                      <Text style={{...FONTS.body_light, fontSize: 12}}>
                        {el}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
            {/* footer */}
            <View style={styles._project_info_bottom_section}>
              <View
                style={[
                  styles._project_state_box,
                  {backgroundColor: `#${task_id.substring(0, 6)}30`},
                ]}>
                <Text
                  style={{
                    ...FONTS.captionBold,
                    color: `#${task_id.substring(0, 6)}`,
                  }}>
                  {task_state}
                </Text>
              </View>
            </View>
          </View>
          {/* ====== END OF PROJECT DETAILS =========== */}
        </View>
        <Text style={styles._project_txt_title}>
          Assignees {'&'} project status
        </Text>
        {project?.assigned_to.length ? (
          <AssigneeInfo fundis={project?.assigned_to} navigation={navigation} />
        ) : (
          <Text
            style={{
              ...FONTS.caption,
              textAlign: 'center',
              color: COLORS.blue_deep,
            }}>
            This project has not been assigned to any fundi
          </Text>
        )}
        <Text style={styles._project_txt_title}>Action center</Text>
      </View>
      <LoadingModal show={loading} label={'Processing, Please wait....'} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center_in_view: {justifyContent: 'center', alignItems: 'center'},
  container: {flex: 1},
  _section: {
    backgroundColor: COLORS.white,
    paddingTop: SIZES.base,
  },
  _project_txt_title: {
    marginVertical: SIZES.base,
    ...FONTS.body_medium,
    marginLeft: SIZES.base,
  },
  _project_time_start: {
    ...FONTS.body_light,
    fontSize: 10,
    marginVertical: SIZES.padding_4,
  },
  _project_txt_requirements: {
    ...FONTS.body_light,
    color: COLORS.secondary,
    textDecorationLine: 'underline',
    marginVertical: SIZES.base,
  },
  _project_info_bottom_section: {
    marginTop: SIZES.base,
    alignItems: 'flex-end',
  },
  _project_state_box: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding_12,
    borderTopLeftRadius: SIZES.padding_16,
  },
});

export default connect(mapStateToProps)(ProjectInfo);
