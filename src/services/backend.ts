import axios from 'axios';

import config from '../config';

const { apis }: any = config;

type TypeMetamaskLoginProps = {
  address: string;
  msg: string;
  signed_msg: string;
};

type TypeAddPoolProps = {
  type_presale?: string;
  name: string;
  address: string;
  description?: string;
  price: number;
  soft_cap: number;
  hard_cap: number;
  open_date: string;
  start_date: string;
  end_date: string;
  liquidity: string;
  liquidity_allocation: string;
  listing_price: number;
  lock_days: string;
  liquidity_allocation_time: string;
  logo: string;
  website?: string;
  telegram?: string;
  github?: string;
  twitter?: string;
  whitepaper?: string;
  vote_for: number;
  vote_to_remove: number;
  user: number;
};

// todo
type TypeGetVotingSignatureProps = {
  data: string;
};

export class BackendService {
  private axios: any;

  constructor() {
    this.axios = axios.create({ baseURL: apis.backend });
  }

  getMetamaskMessage = async () => {
    try {
      const url = `/account/get_metamask_message/`;
      const result = await this.axios.get(url);
      // console.log('BackendService getMetamaskMessage:', result);
      return { success: true, data: result.data };
    } catch (e) {
      // console.error('BackendService getMetamaskMessage:', e);
      return { success: false, data: undefined, error: e.response.data };
    }
  };

  metamaskLogin = async (props: TypeMetamaskLoginProps) => {
    try {
      const url = `/account/metamask_login/`;
      const result = await this.axios.post(url, props);
      // console.log('BackendService metamaskLogin:', result);
      return { success: true, data: result.data };
    } catch (e) {
      // console.error('BackendService metamaskLogin:', e);
      return { success: false, data: undefined, error: e.response.data };
    }
  };

  getAllPools = async () => {
    try {
      const url = `/pool/`;
      const result = await this.axios.get(url);
      // console.log('BackendService getAllPools:', result);
      return { success: true, data: result.data };
    } catch (e) {
      // console.error('BackendService getAllPools:', e);
      return { success: false, data: undefined, error: e.response.data };
    }
  };

  getPool = async (address: string) => {
    try {
      const url = `/pool/${address}`;
      const result = await this.axios.get(url);
      // console.log('BackendService getAllPools:', result);
      return { success: true, data: result.data };
    } catch (e) {
      // console.error('BackendService getAllPools:', e);
      return { success: false, data: undefined, error: e.response.data };
    }
  };

  addPool = async (props: TypeAddPoolProps) => {
    try {
      const url = `/pool/`;
      const options = {};
      const result = await this.axios.post(url, props, options);
      // console.log('BackendService addPool:', result);
      return { success: true, data: result.data };
    } catch (e) {
      // console.error('BackendService addPool:', e);
      return { success: false, data: undefined, error: e.response.data };
    }
  };

  getVoting = async () => {
    try {
      const url = `/voting/`;
      const result = await this.axios.get(url);
      // console.log('BackendService getVoting:', result);
      return { success: true, data: result.data };
    } catch (e) {
      // console.error('BackendService getVoting:', e);
      return { success: false, data: undefined, error: e.response.data };
    }
  };

  // todo
  getVotingSignature = async (props: TypeGetVotingSignatureProps) => {
    try {
      const url = `/voting/`;
      const options = {
        // headers: { Authorization: 'token' },
      };
      const result = await this.axios.post(url, props, options);
      // console.log('BackendService getVoting:', result);
      return { success: true, data: result.data };
    } catch (e) {
      // console.error('BackendService getVoting:', e);
      return { success: false, data: undefined, error: e.response.data };
    }
  };
}
