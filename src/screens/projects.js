import React, {useEffect, useMemo, useCallback, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {useDispatch} from 'react-redux';
import {COLORS} from '../constants/themes';

//ui components
import {DefaultToolBar, LoaderSpinner, LoadingNothing} from '../components';

// project item - for the flatlist
const ProjectItem = ({project}) => {
  return (
    <View>
      <Text>Hello world</Text>
    </View>
  );
};

const Projects = ({navigation}) => {
  //set project variables
  const [projects, setProjects] = useState([1]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(UISettingsActions.status_bar(false));
  }, []);
  return (
    <View style={styles.container}>
      <DefaultToolBar navigation={navigation} title="Projects" />
      <View style={styles._content_wrapper}>
        {loading ? (
          <>
            <LoaderSpinner.ArcherLoader size={140} loading={loading} />
            <Text>Fetching projects...</Text>
          </>
        ) : projects.length ? (
          <View style={styles._project_list}>
            <ProjectItem />
          </View>
        ) : (
          <LoadingNothing
            label={'No projects found, come back later'}
            textColor={COLORS.primary}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  _content_wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  _project_list: {
    flex: 1,
    backgroundColor: 'red',
  },
});

export default Projects;
