import { getFromStorage, setToStorage } from "../../utils/localStorage";

const defaultChainType = getFromStorage('chainType');

const initialState = {
  counter: 0,
  type: '',
  chainId: null,
  chainType: defaultChainType || 'Ethereum',
};

export default (state = initialState, params: any) => {
  switch (params.type) {
    case 'WALLET:INIT':
      // eslint-disable-next-line no-case-declarations
      const newState = JSON.parse(
        JSON.stringify({
          ...state,
          ...{ counter: state.counter + 1 },
        }),
      );
      return newState;
    case 'WALLET:SET_TYPE':
      return {
        ...state,
        ...{ type: params.payload },
      };
    case 'WALLET:SET_CHAIN_ID':
      return {
        ...state,
        ...{ chainId: params.payload },
      };
    case 'WALLET:SET_CHAIN_TYPE':
      setToStorage('chainType', params.payload);
      return {
        ...state,
        ...{ chainType: params.payload },
      };
    default:
      return state;
  }
};
