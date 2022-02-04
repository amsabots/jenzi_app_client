const user_data_actions = {
  create_user: function (payload) {
    return {
      type: 'CREATE_USER',
      payload,
    };
  },
  create_user: function (user_object) {
    return {
      type: 'UPDATE_USER',
      payload,
    };
  },
  create_user: function () {
    return {
      type: 'REMOVE_USER',
      payload,
    };
  },
};

export {user_data_actions};
