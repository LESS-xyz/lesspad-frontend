import axios from 'axios';

import config from '../config';

const { APIS }: any = config;

type TypeMetamaskLoginProps = {
  address: string;
  msg: string;
  signedMsg: string;
};

type TypeGetPoolSignatureProps = {
  token: string;
  token_address: string;
};

type TypeGetVotingSignatureProps = {
  token: string;
  pool: string;
};

type TypeGetWhitelistSignatureProps = {
  token: string;
  pool: string;
};

type TypeGetTierSignatureProps = {
  token: string;
  presale: string;
};

type TypeGetTiersAndWinnersProps = {
  pool: string;
};

// type TypeAddPoolProps = {
//   type_presale?: string;
//   name: string;
//   address: string;
//   description?: string;
//   price: number;
//   soft_cap: number;
//   hard_cap: number;
//   open_date: string;
//   start_date: string;
//   end_date: string;
//   liquidity: string;
//   liquidity_allocation: string;
//   listing_price: number;
//   lock_days: string;
//   liquidity_allocation_time: string;
//   logo: string;
//   website?: string;
//   telegram?: string;
//   github?: string;
//   twitter?: string;
//   whitepaper?: string;
//   vote_for: number;
//   vote_to_remove: number;
//   user: number;
// };

export class BackendService {
  private axios: any;

  constructor() {
    this.axios = axios.create({ baseURL: APIS.backend });
  }

  getMetamaskMessage = async () => {
    try {
      const url = `/account/get_metamask_message/`;
      const result = await this.axios.get(url);
      // console.log('BackendService getMetamaskMessage:', result);
      return { data: result.data };
    } catch (e) {
      // console.error('BackendService getMetamaskMessage:', e);
      return { data: null, error: e.response.data };
    }
  };

  metamaskLogin = async (props: TypeMetamaskLoginProps) => {
    try {
      /* eslint-disable */
      const { address, msg, signedMsg: signed_msg } = props;
      const propsFormatted = {
        address,
        msg,
        signed_msg,
      };
      /* eslint-enable */
      const url = `/account/metamask_login/`;
      const result = await this.axios.post(url, propsFormatted);
      // console.log('BackendService metamaskLogin:', result);
      return { data: result.data };
    } catch (e) {
      // console.error('BackendService metamaskLogin:', e);
      return { data: null, error: e.response.data };
    }
  };

  getPoolSignature = async (props: TypeGetPoolSignatureProps) => {
    try {
      const url = `/pool/`;
      const result = await this.axios.post(url, props);
      // console.log('BackendService getAllPools:', result);
      return { data: result.data };
    } catch (e) {
      // console.error('BackendService getAllPools:', e);
      return { data: null, error: e.response.data };
    }
  };

  getVotingSignature = async (props: TypeGetVotingSignatureProps) => {
    try {
      const url = `/voting/`;
      const result = await this.axios.post(url, props);
      // console.log('BackendService getAllPools:', result);
      return { data: result.data };
    } catch (e) {
      // console.error('BackendService getAllPools:', e);
      return { data: null, error: e.response.data };
    }
  };

  getWhitelistSignature = async (props: TypeGetWhitelistSignatureProps) => {
    try {
      const url = `/whitelist/`;
      const result = await this.axios.post(url, props);
      // console.log('BackendService getAllPools:', result);
      return { data: result.data };
    } catch (e) {
      // console.error('BackendService getAllPools:', e);
      return { data: null, error: e.response.data };
    }
  };

  getInvestSignature = async (props: TypeGetVotingSignatureProps) => {
    try {
      const url = `/invest/`;
      const result = await this.axios.post(url, props);
      // console.log('BackendService getAllPools:', result);
      return { data: result.data };
    } catch (e) {
      // console.error('BackendService getAllPools:', e);
      return { data: null, error: e.response.data };
    }
  };

  getTierSignature = async (props: TypeGetTierSignatureProps) => {
    try {
      const url = `/tier/`;
      const result = await this.axios.post(url, props);
      // console.log('BackendService getAllPools:', result);
      return { data: result.data };
    } catch (e) {
      // console.error('BackendService getAllPools:', e);
      return { data: null, error: e.response.data };
    }
  };

  getTiersAndWinners = async (props: TypeGetTiersAndWinnersProps) => {
    try {
      const url = `/pool/tiers/`;
      const result = await this.axios.post(url, props);
      // console.log('BackendService getAllPools:', result);
      return { data: result.data };
    } catch (e) {
      // console.error('BackendService getAllPools:', e);
      return { data: null, error: e.response.data };
    }
  };

  getPoolStatus = async (pool: string) => {
    try {
      const result = await this.axios.post('/invest/status/', { pool });
      return result;
    } catch (e) {
      return null;
    }
  };
}
