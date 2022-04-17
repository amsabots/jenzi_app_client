import React, {useState, useEffect, useCallback} from 'react';

// redux state
import {connect, useDispatch} from 'react-redux';
import {task_actions} from '../../store-actions';

// component views
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, FONTS, SIZES} from '../../constants/themes';
import {Badge, Divider} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {screens} from '../../constants';

const mapStateToProps = state => {
  const {tasks} = state;
  return {tasks};
};

const CurrentProject = ({tasks, navigation}) => {
  const {title, requirements} = tasks.current_project;
  if (Object.values(tasks.current_project).filter(Boolean).length < 1)
    return null;

  return (
    <View style={styles.containers}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flexGrow: 1}}>
          <Text
            style={{
              ...FONTS.captionBold,
              color: COLORS.blue_deep,
              textDecorationLine: 'underline',
            }}>
            Existing project info
          </Text>
          <Text style={{...FONTS.caption, marginVertical: SIZES.base}}>
            {title}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate(screens.project_creator_wizard)}>
          <Badge>View details</Badge>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containers: {
    marginVertical: SIZES.base,
    paddingHorizontal: SIZES.padding_16,
  },
});

export default connect(mapStateToProps)(CurrentProject);
