import {COLORS} from '../constants/themes';

const UISettingsActions = {
  status_bar: (hide = false) => {
    if (hide) {
      return {
        type: 'STATUS_BAR',
        payload: {
          translucent: true,
          bg_color: 'transparent',
        },
      };
    }
    return {
      type: 'STATUS_BAR',
      payload: {
        translucent: false,
        bg_color: COLORS.secondary,
      },
    };
  },
  // UI REFRESH
  refresh_component: () => {
    return {
      type: 'REFRESH_COMPONENT',
      payload: '',
    };
  },
};

export {UISettingsActions};
