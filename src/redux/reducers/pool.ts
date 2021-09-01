const initialState = {
  pools: [],
};

export default (state = initialState, params: any) => {
  switch (params.type) {
    case 'POOL:SET_POOLS':
      // console.log('POOL:SET_POOLS', params.payload)
      // eslint-disable-next-line no-case-declarations
      const newState = JSON.parse(
        JSON.stringify({
          ...state,
          ...{ pools: params.payload },
        }),
      );
      return newState;
    default:
      return state;
  }
};
