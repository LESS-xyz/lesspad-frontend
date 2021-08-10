const initialState = {
  minVoterBalance: '',
};

export default (state = initialState, params: any) => {
  switch (params.type) {
    case 'LIBRARY:SET':
      // console.log('POOL:SET_POOLS', params.payload)
      // eslint-disable-next-line no-case-declarations
      const newState = JSON.parse(
        JSON.stringify({
          ...state,
          ...params.payload,
        }),
      );
      return newState;
    default:
      return state;
  }
};
