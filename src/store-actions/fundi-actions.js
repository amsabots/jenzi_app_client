const fundiActions = {
  add_fundi: function (fundis) {
    return {
      type: 'ADD_FUNDIS',
      payload: fundis,
    };
  },
  update_fundi: function (fundiObject) {
    return {
      type: 'UPDATE_FUNDI',
      payload: fundiObject,
    };
  },
  remove_fundi: function (fundiObject) {
    return {
      type: 'REMOVE_FUNDI',
      payload: fundiObject,
    };
  },
  test_store: function () {
    return {type: 'TEST_FUNDI'};
  },
};
export {fundiActions};
