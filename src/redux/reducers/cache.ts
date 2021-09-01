const initialState = {};

export default (state = initialState, params: any) => {
  const newState = JSON.parse(
    JSON.stringify({
      ...state,
      ...params.payload,
    }),
  );
  switch (params.type) {
    case 'CACHE:SET':
      return newState;
    default:
      return state;
  }
};
