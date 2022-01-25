const initialState = {
  fundis: [],
  selected_fundi: {},
  sent_requests: {},
};

const fundisData = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'ADD_FUNDIS':
      console.log('fundis added.....');
      return {...state, fundis: [...state.fundis, ...payload]};
    case 'UPDATE_FUNDI':
      console.log('updating.....');
      const index = state.fundis.indexOf(payload);
      if (i < 0) {
        console.log('fundi entry updated.....');
        const newfundi = {...state.fundis[index], ...payload};
        state.fundis[index] = newfundi;
      }
      return state;
    case 'REMOVE_FUNDI':
      console.log('fundi entry removed.....');
      const i = state.fundis.indexOf(payload);
      if (i < 0)
        return {...state, fundis: state.fundis.filter((_, idx) => idx !== i)};
      return state;
    case 'TEST_FUNDI':
      console.log('fundi store is listening');
      return state;
    case 'SET_FUNDI':
      console.log('redux: setting  selected fundi....');
      return {...state, selected_fundi: payload};
    default:
      return state;
  }
};
export {fundisData};
