import React, {useState, useCallback, useEffect, useMemo} from 'react';
//redux stuffs
import {connect, useDispatch} from 'react-redux';
import {task_actions, UISettingsActions} from '../store-actions';
//navigation stuff
import {useFocusEffect} from '@react-navigation/native';

//components, styles, view-components e.t.c
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  InteractionManager,
} from 'react-native';
import {
  Badge,
  TextInput,
  Button,
  Divider,
  Chip,
  Snackbar,
} from 'react-native-paper';
// ==== view components =======
import {LoaderSpinner, LoadingNothing, DefaultToolBar} from '../components';
import {COLORS, FONTS, SIZES} from '../constants/themes';
import {generate_random_hex, screens} from '../constants';

const mapStateToProps = state => {
  const {tasks} = state;
  return {tasks};
};

const logger = console.log.bind(console, '[file: project-creator-wizard.js] ');

const InputBox = ({
  onInputChangeListener,
  nativeViewId,
  onRemoveClicked,
  value,
}) => {
  return (
    <View style={{marginVertical: SIZES.base}}>
      {/* remove input prompt */}
      <View style={styles._chip_right}>
        <TouchableOpacity
          style={styles._remove_input}
          onPress={() => onRemoveClicked(nativeViewId)}>
          <Text
            style={{
              ...FONTS.body_bold,
              color: COLORS.white,
              textAlign: 'center',
            }}>
            -
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        mode="outlined"
        dense
        outlineColor={COLORS.light_secondary}
        activeOutlineColor={COLORS.blue_deep}
        multiline
        value={value}
        numberOfLines={2}
        maxLength={300}
        onChangeText={txt =>
          onInputChangeListener({label: txt, id: nativeViewId})
        }
      />
    </View>
  );
};

const ProjectCreatorWizard = ({navigation, tasks}) => {
  // destructure the props from the selected store state
  const {current_project} = tasks;
  console.log('Initializing.....');
  const [title, setTitle] = useState('');
  const [requirements, setRequirements] = useState({});
  const [snackVisible, setSnackVisible] = useState(false);
  // contains an array of objects defined as {inputId:string, value:string}
  const [requirementsInputBoxes, setRequirementInputBox] = useState([]);
  const [is_view_ready, setViewReady] = useState(false);

  // component hooks
  const dispatch = useDispatch();

  //interactions manager handler
  InteractionManager.runAfterInteractions(() => {
    setViewReady(true);
    //logger(`View complete loading`);
  }, []);

  //component functions
  const add_new_requirement_box = () => {
    const input_native_id = generate_random_hex();
    setRequirementInputBox(prev => [...prev, {inputId: input_native_id}]);
  };

  const handleInputRemoval = id => {
    setRequirementInputBox(prev => prev.filter(el => el.inputId !== id));
    delete requirements[id];
  };

  const initiateProject = () => {
    if (!title)
      return ToastAndroid.showWithGravity(
        'Project title is required',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    const data = [];
    dispatch(task_actions.unset_current_project());
    for (const [key, value] of Object.entries(requirements)) {
      data.push({inputId: key, value});
    }
    dispatch(task_actions.set_current_project(data, title));
    setSnackVisible(true);
  };

  // update UI with the current project state from the store
  useEffect(() => {
    if (Object.keys(current_project).length) {
      setTitle(current_project.title);
      setRequirementInputBox(current_project.requirements);
      current_project.requirements.forEach(element => {
        setRequirements(prev => {
          return {...prev, [element.inputId]: element.value};
        });
      });
    }
  }, []);

  // run anytime this screen receives focus - equivalent of android @onResume view lifecycle hooks
  useFocusEffect(
    useCallback(() => {
      dispatch(UISettingsActions.status_bar(false));
    }, []),
  );

  //display this while the nested screens is loading
  if (!is_view_ready)
    return (
      <View style={{flex: 1, ...SIZES.centerInView}}>
        <LoaderSpinner.DoubleRing loading={true} size={100} />
        <Text>Preparing environment, Please wait.......</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <DefaultToolBar
        navigation={navigation}
        title={'Project creator Wizard'}
        del
        onDeleteClicked={() => dispatch(task_actions.unset_current_project())}
      />
      <ScrollView>
        <View style={styles.body}>
          {/*  ================ TOP TITLE SECTION =============== */}
          <View style={[styles._sections]}>
            <Text style={styles._text_label}>
              Provide project title{' '}
              <Text style={{color: COLORS.secondary}}>*</Text>
            </Text>
            <TextInput
              placeholder="Enter project title"
              dense={true}
              underlineColor={COLORS.light_green}
              activeUnderlineColor={COLORS.secondary}
              maxLength={100}
              value={title}
              onChangeText={txt => setTitle(txt)}
            />
          </View>
          <Divider />
          {/* =============== END OF TOP SECTION =============== */}
          <View style={[styles._sections, {flex: 1}]}>
            <View style={styles._chip_right}>
              <Chip
                style={{backgroundColor: COLORS.secondary}}
                onPress={add_new_requirement_box}>
                <Text style={{...FONTS.caption, color: COLORS.white}}>
                  Add requirement
                </Text>
              </Chip>
            </View>
            {/* ============== Requirements sections */}
            {!Object.keys(requirementsInputBoxes).length ? (
              Nothing
            ) : (
              <View style={{flex: 1}}>
                {requirementsInputBoxes.map((el, idx) => (
                  <InputBox
                    key={idx}
                    nativeViewId={el.inputId}
                    value={requirements[el.inputId]}
                    onRemoveClicked={id => handleInputRemoval(id)}
                    onInputChangeListener={content =>
                      setRequirements(prev => {
                        return {...prev, [content.id]: content.label};
                      })
                    }
                  />
                ))}
              </View>
            )}

            <View style={{marginVertical: SIZES.padding_32}}>
              <Button mode="contained" onPress={initiateProject}>
                {!title ? 'Create Project' : 'Update Project'}
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackVisible}
        duration={60000}
        style={{backgroundColor: COLORS.secondary}}
        onDismiss={() => setSnackVisible(false)}
        action={{
          label: 'Send Requests',
          onPress: () => navigation.navigate(screens.home),
        }}>
        <Text style={{...FONTS.caption}}>
          {' '}
          Project has been created/updated.
        </Text>
      </Snackbar>
    </View>
  );
};

const Nothing = (
  <View style={{flex: 1, marginTop: SIZES.padding_32}}>
    <LoadingNothing
      label={'Click requirements to add task info and any extra information'}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  _sections: {
    padding: SIZES.padding_16,
  },
  _text_label: {
    ...FONTS.body_medium,
    marginBottom: SIZES.padding_12,
  },
  _chip_right: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  _remove_input: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.padding_4,
    height: SIZES.padding_32,
    width: SIZES.padding_32,
    justifyContent: 'center',
  },
});
export default connect(mapStateToProps)(React.memo(ProjectCreatorWizard));
