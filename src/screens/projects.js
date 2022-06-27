import React, {useEffect, useRef, useCallback, useState, useMemo} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {Caption, Card, Chip} from 'react-native-paper';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {connect, useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {TabView, SceneMap} from 'react-native-tab-view';

//ui components
import {DefaultToolBar} from '../components';

//sub components UI builders
import axios from 'axios';
import {axios_endpoint_error, endpoints} from '../endpoints';

axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

//tabs
const CompletedProjects = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'red'}}>
      <Text>Hello first screen</Text>
    </View>
  );
};
//tabs
const OtherProjects = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'blue'}}>
      <Text>Hello second screen</Text>
    </View>
  );
};

const renderScene = SceneMap({
  first: CompletedProjects,
  second: OtherProjects,
});
/**
 * =================== Main Component =================
 */
const Projects = ({navigation, user_data}) => {
  //set project variables
  const [loading, setLoading] = useState(false);
  const [deletable, showDeletable] = useState(false);
  const [projects, set_projects] = useState([]);
  // ======= TABS ============
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const routes = useMemo(
    () => [
      {key: 'first', title: 'First'},
      {key: 'second', title: 'Second'},
    ],
    [],
  );
  //redux
  const dispatch = useDispatch();

  //render project item

  function loadProjects() {
    setLoading(true);
    axios
      .get(`/tasks/client/1`, {timeout: 15000})
      .then(res => {
        set_projects(res.data);
      })
      .catch(error => axios_endpoint_error(error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProjects();
    dispatch(UISettingsActions.status_bar(false));
  }, []);
  return (
    <View style={styles.container}>
      <DefaultToolBar
        navigation={navigation}
        title="Projects"
        del={deletable}
        refresh={true}
        onRefreshClicked={loadProjects}
      />
      <View style={styles.container}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  const {tasks, user_data} = state;
  return {tasks, user_data};
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(mapStateToProps)(Projects);
