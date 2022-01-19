import React, {useEffect, useMemo, useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {useDispatch} from 'react-redux';
import {COLORS} from '../constants/themes';

//ui components
import {DefaultToolBar} from '../components';

const Projects = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);
  return (
    <View style={styles.container}>
      <DefaultToolBar navigation={navigation} title="Projects" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Projects;
