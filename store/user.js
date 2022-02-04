import _ from 'lodash';

const initialState = {
  user: {},
};

const user_data = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'CREATE_USER':
      return {...state, user: payload};
    case 'UPDATE_USER':
      return {...state, user: {...state.user, ...payload}};
    case 'REMOVE_USER':
      return {...state, user: {}};
    default:
      return state;
  }
};

export {user_data};
