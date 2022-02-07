import React, {useEffect, useRef, useCallback, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {Caption, Card, Chip} from 'react-native-paper';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {connect, useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';

//
import {FlatList} from 'react-native-gesture-handler';
import {Checkbox} from 'react-native-paper';

import moment from 'moment';

//ui components
import {
  DefaultToolBar,
  LoaderSpinner,
  LoadingNothing,
  InfoChips,
  CircularImage,
} from '../components';

//sub components UI builders
import {CreateProject} from './ui-views';
import axios from 'axios';
import {endpoints, errorMessage} from '../endpoints';
import {task_actions} from '../store-actions/task-actions';
import {ProjectOptions, TaskUpdate} from './ui-views';

//assigned fundis
const FundiItem = ({project}) => {
  const [fundis, setFundis] = useState([]);
  const [load, setLoading] = useState(false);

  //use effect hook to call db and get assigned fundis
  return load ? (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <LoaderSpinner.ArcherLoader loading={load} />
      <Text>Fetching fundis...</Text>
    </View>
  ) : fundis.length ? (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {new Array(3).fill(0).map((el, idx) => (
        <Text
          style={{marginBottom: SIZES.base, marginRight: SIZES.base}}
          key={idx}>
          <Chip avatar={<CircularImage />}>Andrew Mwebi</Chip>
        </Text>
      ))}
    </View>
  ) : (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <LoadingNothing height={70} width={70} />
      <Text>No fundis assigned</Text>
    </View>
  );
};

// project item - for the flatlist
const ProjectItem = ({project, onSelected, longPress}) => {
  const {taskState, createdAt, title, selected} = project;
  const task_state_color = task_state => {
    switch (task_state) {
      case 'ON_GOING':
        return COLORS.blue_deep;
      case 'COMPLETE':
        return COLORS.secondary;
      default:
        return COLORS.primary;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        ToastAndroid.show('Long press for options', ToastAndroid.SHORT)
      }
      onLongPress={() => longPress(project)}>
      <Card style={styles._content_card}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Caption style={{...FONTS.caption, marginVertical: SIZES.base}}>
            Payment pending
          </Caption>
          {selected && <Checkbox disabled={true} status={'checked'} />}
        </View>
        <Text style={{...FONTS.body1, marginBottom: SIZES.base}}>{title}</Text>
        <View style={styles._card_timeline_status}>
          <InfoChips text={taskState} textColor={task_state_color(taskState)} />
          <Text style={{textAlign: 'right', ...FONTS.caption}}>
            {moment(createdAt).fromNow()}
          </Text>
        </View>

        {/*  */}
        <View style={styles._card_fundi_list}>
          <Text style={{...FONTS.body_medium, marginBottom: SIZES.base}}>
            Assigned to the following
          </Text>
          <View style={{flexDirectioPENDINGn: 'row', flexWrap: 'wrap'}}>
            <FundiItem project={project} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

/**
 * =================== Main Component =================
 */
const Projects = ({navigation, tasks, user_data}) => {
  const {jobs, posted_jobs} = tasks;
  //set project variables
  const [loading, setLoading] = useState(false);
  const [deletable, showDeletable] = useState(false);
  const [options, setOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState();

  //redux
  const dispatch = useDispatch();

  //bottom sheet
  const btm_sheet = useRef(null);

  const bref = useRef(null);

  const handleLongPress = p => {
    setOptions(true);
    setSelectedOption(p);
    dispatch(task_actions.set_selected_job(p));
  };

  //render project item
  const project_item = ({item}) => (
    <ProjectItem
      project={item}
      onSelected={s => showDeletable(s)}
      longPress={p => handleLongPress(p)}
    />
  );

  function loadProjects() {
    setLoading(true);
    axios
      .get(
        `${endpoints.client_service}/jobs/owner/${user_data.user.id}?page=0&pageSize=100`,
      )
      .then(res => {
        const t = res.data.data;
        if (t.length) {
          t.forEach(element => {
            t[t.indexOf(element)] = {...element, selected: false};
          });
          dispatch(task_actions.load_jobs(t));
        }
      })
      .catch(err => errorMessage(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
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
      <View style={styles._content_wrapper}>
        {/* Show this when user long presses a project item */}
        {selectedOption && (
          <ProjectOptions
            onDismiss={() => setOptions(false)}
            show={options}
            project={selectedOption}
            onUpdateState={() => {
              setOptions(false);
              btm_sheet.current.snapTo(1);
            }}
          />
        )}

        {loading ? (
          <>
            <LoaderSpinner.ArcherLoader size={140} loading={loading} />
            <Text>Fetching projects...</Text>
          </>
        ) : jobs.length ? (
          <View style={styles._project_list}>
            {jobs.length ? (
              <FlatList
                data={jobs}
                renderItem={project_item}
                key={item => item.taskId}
                onRefresh={() => loadProjects()}
                refreshing={true}
              />
            ) : (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <LoadingNothing
                  label={'You have not done any projects with us'}
                />
              </View>
            )}
          </View>
        ) : (
          <LoadingNothing
            label={'No projects found, come back later'}
            textColor={COLORS.primary}
          />
        )}
      </View>
      <TaskUpdate sheetRef={btm_sheet} />
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
  _content_wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  _project_list: {
    flex: 1,
    width: '100%',
    paddingHorizontal: SIZES.base,
    paddingTop: SIZES.base,
    zIndex: -1,
  },
  _content_card: {
    padding: SIZES.base,
  },
  _card_timeline_status: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    borderBottomColor: COLORS.disabled_grey,
    borderBottomWidth: SIZES.stroke,
    paddingBottom: SIZES.base,
  },
  _card_fundi_list: {
    marginTop: SIZES.base,
  },
});

export default connect(mapStateToProps)(Projects);
