import React, {useEffect, useRef, useCallback, useState, useMemo} from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import {Caption, Card, Chip} from 'react-native-paper';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {connect, useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import Iicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

//ui components
import {
  DefaultToolBar,
  InfoChips,
  LoaderSpinner,
  LoadingNothing,
} from '../components';

//sub components UI builders
import axios from 'axios';
import {axios_endpoint_error, endpoints} from '../endpoints';
import moment from 'moment';
import {screens} from '../constants';

axios.defaults.baseURL = endpoints.jenzi_backend + '/jenzi/v1';

const ProjectItem = ({project, onItemClicked}) => {
  const {task_id, title, text_info, task_state, createdAt, requirements} =
    project?.task_entry;
  const requirements_array = requirements
    ? requirements?.split('>').splice(0, 4)
    : ['No project requirements provided'];
  return (
    <Card
      onPress={() => onItemClicked(project)}
      style={{
        borderRadius: SIZES.base,
        overflow: 'hidden',
        minHeight: 100,
        marginBottom: SIZES.base,
      }}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <View
          style={[
            item_styles.left_border,
            {backgroundColor: `#${task_id.substring(0, 6)}`},
          ]}
        />
        <View style={item_styles._right_content_wrapper}>
          <Text style={{...FONTS.body_medium}}>{title}</Text>
          <View style={{marginVertical: SIZES.base}}>
            {/*  */}
            {requirements_array.map((el, idx) => {
              return (
                <View style={{flexDirection: 'row', width: '100%'}} key={idx}>
                  <Entypo
                    name="dot-single"
                    color={`#${task_id.substring(0, 6)}`}
                    size={SIZES.padding_16}
                  />
                  <Text style={{...FONTS.body_light, fontSize: 12}}>{el}</Text>
                </View>
              );
            })}
            {/*  */}
          </View>
          {/* bottom section */}
          <View style={item_styles._bottom_container}>
            {/* === left section =====*/}
            <View style={item_styles._align_center_row}>
              <Iicons
                name="ios-time-outline"
                size={SIZES.icon_size}
                color={`#${task_id.substring(0, 6)}`}
              />
              <Text style={{...FONTS.caption, marginLeft: SIZES.base}}>
                {moment(createdAt).fromNow()}
              </Text>
            </View>
            {/* ==== right section ==== */}
            <View>
              <InfoChips
                text={task_state}
                textColor={`#${task_id.substring(0, 6)}`}
              />
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const item_styles = StyleSheet.create({
  left_border: {
    width: SIZES.base,
    height: '100%',
  },
  _right_content_wrapper: {
    paddingHorizontal: SIZES.padding_12,
    paddingVertical: SIZES.base,
    flex: 1,
  },
  _bottom_container: {
    width: '100%',
    flexDirection: 'row',
    marginTop: SIZES.padding_4,
    justifyContent: 'space-between',
  },
  _align_center_row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  _fundi_initials: {
    height: 25,
    width: 25,
    borderRadius: 12,
    marginLeft: -8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/**
 * =================== Main Component =================
 */
const Projects = ({navigation, user_data}) => {
  //set project variables
  const [loading, setLoading] = useState(false);
  const [deletable, showDeletable] = useState(false);
  const [projects, set_projects] = useState([]);
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
        {loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <LoaderSpinner.DoubleRing loading={true} size={80} />
            <Text style={{...FONTS.caption, color: COLORS.blue_deep}}>
              Fetching data, Please wait....
            </Text>
          </View>
        ) : !projects.length ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <LoadingNothing
              width={180}
              height={180}
              label={'Empty history. Come back later'}
            />
          </View>
        ) : (
          <FlatList
            data={projects}
            style={{
              paddingHorizontal: SIZES.padding_16,
              paddingTop: SIZES.base,
            }}
            keyExtractor={item => item?.task_entry.task_id}
            renderItem={({item}) => {
              return (
                <ProjectItem
                  project={item}
                  onItemClicked={project =>
                    navigation.navigate(screens.project_info, {project})
                  }
                />
              );
            }}
          />
        )}
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
