import {set} from 'lodash';
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

// Redux navigation
import {useDispatch, connect} from 'react-redux';

import {
  UISettingsActions,
  user_data_actions,
  task_actions,
} from '../store-actions';

import {
  DefaultToolBar,
  LoaderSpinner,
  LoadingNothing,
  PlainFundiProfile,
} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {endpoints} from '../endpoints';

const mapStateToProps = state => {
  const {user_data} = state;
  return {user_data};
};

const ProjectInfo = ({navigation, route, user_data}) => {
  const {project} = route.params;
  const {LONG, SHORT, BOTTOM, TOP} = ToastAndroid;
  // application state variables
  const [view_ready, setViewReady] = useState(false);
  const [fundi, setFundi] = useState();
  // Redux handlers and hooks
  const dispatch = useDispatch();

  useCallback(
    InteractionManager.runAfterInteractions(() => {
      setViewReady(true);
    }),
    [],
  );

  // component functions

  //effects functions
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);

  // use effect for incoming changes from previous screen
  useEffect(() => {
    const {client, fundiId, pendingTaskStates, taskState, createdAt} = project;
    //fetch client information
  }, [route]);

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
    <View style={[styles.container]}>
      <DefaultToolBar title="Project details" navigation={navigation} />
      <View style={[styles.container]}>
        {/* ==============   FUNDI PROFILE VIEWER ======= */}
        <View style={[styles.center_in_view]}>
          <PlainFundiProfile
            fundiId={project.fundiId}
            onFundiFinished={fundi_details => console.log('')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center_in_view: {justifyContent: 'center', alignItems: 'center'},
  container: {flex: 1},
});

export default connect(mapStateToProps)(ProjectInfo);
