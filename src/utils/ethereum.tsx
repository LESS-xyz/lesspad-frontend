import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BigNumber as BN } from 'bignumber.js/bignumber';
import web3 from 'web3';

import Button from '../components/Button';
import config from '../config';
import { modalActions } from '../redux/actions';

import s from '../pages/PageCreatePool/CreatePool.module.scss';

export const convertFromWei = (amount: string | number, decimals: string | number) => {
  try {
    const tenBN = new BN(10);
    const decimalsBN = new BN(decimals);
    const result = new BN(amount).div(tenBN.pow(decimalsBN)).toString(10);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const convertToWei = (amount: string | number, decimals: string | number) => {
  try {
    const tenBN = new BN(10);
    const decimalsBN = new BN(decimals);
    const result = new BN(amount).multipliedBy(tenBN.pow(decimalsBN)).toString(10);
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const convertHexToString = (hex: string) => {
  const removedZeros = hex.replace(/00/g, '');
  return web3.utils.toAscii(removedZeros);
};

export const useTransactionHash = () => {
  const { chainType } = useSelector(({ wallet }: any) => wallet);
  const dispatch = useDispatch();
  const toggleModal = useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);
  const handleTransactionHash = useCallback(
    (txHash: string) => {
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContainer}>
            <p>Transaction submitted</p>
            <div className={s.messageContainerButtons}>
              <Button href={`${config.EXPLORERS[chainType]}/tx/${txHash}`}>View on explorer</Button>
            </div>
          </div>
        ),
      });
    },
    [toggleModal, chainType],
  );
  return { handleTransactionHash };
};
