const state = {
  translucent: false,
  bg_color: null,
};

const UISettings = (s = state, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'STATUS_BAR':
      return {...s, ...payload};
    default:
      return state;
  }
};

export {UISettings};