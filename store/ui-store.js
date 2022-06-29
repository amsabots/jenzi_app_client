const state = {
  translucent: false,
  bg_color: null,
  modalShow: false,
  refresh_state: Math.random(),
  project_banner: {},
  snack_bar_info: '',
  project_tracker: null,
};

const UISettings = (s = state, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'STATUS_BAR':
      return {...s, ...payload};
    case 'REFRESH_COMPONENT':
      return {...s, refresh_state: Math.random()};
    case 'SHOW_PROJECT_BANNER':
      return {...s, project_banner: payload};
    case 'HIDE_PROJECT_BANNER':
      return {...s, project_banner: {}};
    case 'SNACKBAR_INFO':
      return {...state, snack_bar_info: payload};
    case 'REFRESH_UI':
      return {...state, refresh_state: Math.random()};
    case 'PROJECT_STATE_TRACKER':
      return {...state, project_tracker: payload};
    default:
      return state;
  }
};

export {UISettings};
