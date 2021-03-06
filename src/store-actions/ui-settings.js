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

  show_project_banner: banner_message => {
    return {
      type: 'SHOW_PROJECT_BANNER',
      payload: banner_message,
    };
  },
  hide_project_banner: () => {
    return {
      type: 'HIDE_PROJECT_BANNER',
    };
  },
  snack_bar_info: info_message => {
    return {
      type: 'SNACKBAR_INFO',
      payload: info_message,
    };
  },
  refresh_ui_view: () => {
    return {
      type: `REFRESH_UI`,
    };
  },
  //PROJECT_STATE_TRACKER
  update_project_tracker: project_state => {
    return {
      type: `PROJECT_STATE_TRACKER`,
      payload: project_state,
    };
  },
};

export {UISettingsActions};
