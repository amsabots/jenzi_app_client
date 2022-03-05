import _ from 'lodash';

const initialState = {
  chats: [],
  selected_chat: {},
  chat_rooms: [],
};

export const chats = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'LOAD_CHATS':
      return {...state, chats: payload};
    case 'ACTIVE_CHAT':
      return {...state, selected_chat: payload};

    default:
      return state;
  }
};
