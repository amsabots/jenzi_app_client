const fundis = [];

const fundisData = (state = fundis, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'ADD_FUNDIS':
      console.log('fundis added.....');
      return [...state, ...payload];
    case 'UPDATE_FUNDI':
      console.log('fundi entry updated.....');
      const index = state.indexOf(payload);
      if (i < 0) {
        const newfundi = {...state[index], ...payload};
        state[index] = newfundi;
      }
      return fundis;
    case 'REMOVE_FUNDI':
      console.log('fundi entry removed.....');
      const i = state.indexOf(payload);
      if (i < 0) return state.filter((_, idx) => idx !== i);
    case 'TEST_FUNDI':
      console.log('fundi store is listening');
      return state;
    default:
      return state;
  }
};
export {fundisData};
