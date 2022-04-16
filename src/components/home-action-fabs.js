import * as React from 'react';
import {FAB, Portal} from 'react-native-paper';
import {screens} from '../constants';
import {COLORS} from '../constants/themes';

const HomeFab = ({navigation}) => {
  const [state, setState] = React.useState({open: false});

  const onStateChange = ({open}) => setState({open});

  const {open} = state;

  return (
    <Portal>
      <FAB.Group
        open={open}
        icon={'plus'}
        fabStyle={{backgroundColor: COLORS.secondary}}
        color={COLORS.white}
        actions={[
          {
            icon: 'star',
            label: 'Create project',
            color: COLORS.white,
            style: {backgroundColor: COLORS.secondary},
            onPress: () => navigation.navigate(screens.project_creator_wizard),
          },
          {
            icon: 'chat',
            label: 'chats & Conversation',
            color: COLORS.white,
            style: {backgroundColor: COLORS.secondary},
            onPress: () => navigation.navigate(screens.chats_screen),
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
    </Portal>
  );
};

export default HomeFab;
