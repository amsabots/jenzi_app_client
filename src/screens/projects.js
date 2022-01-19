import React, {useEffect, useRef, useCallback, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Caption, Card, Chip} from 'react-native-paper';
// redux store
import {UISettingsActions} from '../store-actions/ui-settings';
import {useDispatch} from 'react-redux';
import {COLORS, FONTS, SIZES} from '../constants/themes';

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
const ProjectItem = ({project}) => {
  return (
    <Card style={styles._content_card}>
      <Caption style={{...FONTS.body, marginVertical: SIZES.base}}>
        Category
      </Caption>
      <Text style={{...FONTS.body1, marginBottom: SIZES.base}}>
        Sink pipes installation
      </Text>
      <View style={styles._card_timeline_status}>
        <InfoChips text={'IN PROGRESS'} textColor={COLORS.blue_deep} />
        <Text style={{textAlign: 'right', ...FONTS.caption}}>
          Posted: 2 months Ago
        </Text>
      </View>

      {/*  */}
      <View style={styles._card_fundi_list}>
        <Text style={{...FONTS.body_medium, marginBottom: SIZES.base}}>
          Assigned to the following
        </Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <FundiItem project={project} />
        </View>
      </View>
    </Card>
  );
};

const Projects = ({navigation}) => {
  //set project variables
  const [projects, setProjects] = useState([1]);
  const [loading, setLoading] = useState(false);

  const bref = useRef(null);

  //render project item
  const project_item = ({item}) => <ProjectItem project={p} />;

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

      {/* create project bottom sheet */}
      <CreateProject sheetRef={bref} />
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

export default Projects;
