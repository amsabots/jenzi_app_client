import * as React from 'react';
import {FAB, Portal} from 'react-native-paper';
import {screens} from '../constants';
import {COLORS} from '../constants/themes';
import {StyleSheet} from 'react-native';

const HomeFab = ({navigation}) => {
  const [state, setState] = React.useState({open: false});

  const onStateChange = ({open}) => setState({open});

  const {open} = state;

  return (
    <Portal>
      <FAB
        small
        label="New project"
        color={COLORS.white}
        icon="plus"
        onPress={() => navigation.navigate(screens.project_creator_wizard)}
        style={styles.fab}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    backgroundColor: COLORS.secondary,
    right: 0,
    bottom: 0,
  },
});

export default HomeFab;
