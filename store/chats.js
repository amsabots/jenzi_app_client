import _ from 'lodash';

const initialState = {
  chats: [],
  selected_chat: {},
};

export const chats = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'LOAD_CHATS':
      return {...state, chats: payload};
    default:
      return state;
  }
};
