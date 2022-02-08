const state = {
  translucent: false,
  bg_color: null,
  modalShow: false,
  refresh_state: Math.random(),
};

const UISettings = (s = state, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'STATUS_BAR':
      return {...s, ...payload};
    case 'REFRESH_COMPONENT':
      return {...s, refresh_state: Math.random()};
    default:
      return state;
  }
};

export {UISettings};
