import axios from 'axios';
import qs from 'query-string';

import config from '../config';

const { apis }: any = config;

type TypeGetQuoteProps = {
  buyToken: string;
  sellToken: string;
  sellAmount: string;
  decimals: number;
  includePriceComparisons?: boolean;
  excludedSources?: string;
  includedSources?: string;
};

export class Service0x {
  private axios: any;

  constructor() {
    this.axios = axios.create({
      baseURL: apis['0x'],
    });
  }

  getQuote = async (props: TypeGetQuoteProps) => {
    try {
      const url = `/swap/v1/quote?${qs.stringify(props)}`;
      const result = await this.axios.get(url);
      // console.log('Service0x getQuote:', result);
      return {
        success: true,
        data: result.data,
      };
    } catch (e) {
      // console.error(e);
      return { success: false, data: undefined, error: e.response.data };
    }
  };
}
