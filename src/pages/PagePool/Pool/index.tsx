import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Github from '../../../assets/img/icons/gh-icon.svg';
import Link from '../../../assets/img/icons/link-icon.svg';
import Logo from '../../../assets/img/icons/project-logo.svg';
import Subscribe from '../../../assets/img/icons/subscribe.svg';
import Subtract from '../../../assets/img/icons/subtract-icon.svg';
import Telegram from '../../../assets/img/icons/tg-icon.svg';
import Twitter from '../../../assets/img/icons/twitter-icon.svg';
import YourTier from '../../../components/YourTier/index';
import config from '../../../config';
import ParticipantsTable from '../ParticipantsTable';

import './index.scss';

const { chainSymbols, explorers }: any = config;

const Pool: React.FC = () => {
  const { address }: any = useParams();

  const { chainType } = useSelector(({ wallet }: any) => wallet);

  const currency = chainSymbols[chainType];
  const explorer = explorers[chainType];
  const name = 'Pool';

  const row1 = [
    {
      header: 'Softcap',
      value: `638.094 ${currency}`,
      gradient: true,
      less: false,
      last: false,
    },
    {
      header: 'Presale Rate',
      value: `0.0001454 ${currency}`,
      gradient: false,
      less: false,
      last: false,
    },
    {
      header: 'Liquidity Allocation',
      value: '60%',
      gradient: false,
      less: false,
      last: false,
    },
    {
      header: 'Open Time',
      value: 'June 05, 2021 17:00 PM GMT',
      gradient: false,
      less: false,
      last: true,
    },
  ];

  const row2 = [
    {
      header: 'Hardcap',
      value: `1164 ${currency}`,
      gradient: true,
      less: false,
      last: false,
    },
    {
      header: 'PancakeSwap Listing Rate',
      value: `0.0001740 ${currency}`,
      gradient: false,
      less: false,
      last: false,
    },
    {
      header: 'Liquidity Lock Duration',
      value: '240 days',
      gradient: true,
      less: false,
      last: false,
    },
    {
      header: 'Open Time',
      value: 'June 05, 2021 17:00 PM GMT',
      gradient: false,
      less: false,
      last: true,
    },
  ];

  const row3 = [
    {
      header: 'Presale Type',
      value: 'Public Presale',
      gradient: false,
      less: false,
      last: false,
    },
    {
      header: 'Headstart',
      value: '30 mins',
      gradient: false,
      less: false,
      last: false,
    },
    {
      header: 'Yes Votes',
      value: '125556',
      gradient: false,
      less: true,
      last: false,
    },
    {
      header: 'No Votes',
      value: '0',
      gradient: false,
      less: true,
      last: true,
    },
  ];

  const invest = [
    {
      header: 'VOTE',
      value: '0.000',
      count: '$0.0 USD',
      buttonText: 'Vote',
      less: true,
      last: false,
    },
    {
      header: 'Your Tokens',
      value: '1,000,000',
      count: '$13,780,000 USD',
      buttonText: 'Claim Token',
      less: true,
      last: false,
    },
    {
      header: 'Your BNB Investment',
      value: '0.0 BNB',
      count: '$0.0 USD',
      buttonText: 'Get Refund',
      less: false,
      last: false,
    },
    {
      header: 'Buy Tokens',
      value: '1 Token = 0.000145 BNB',
      count: '',
      buttonText: 'Get Refund',
      less: false,
      last: true,
    },
  ];

  const links = [
    {
      header: 'Token Contract Address',
      value: 'x19314Dfa75CfC1E5154f95daFaB217646bdb79AC',
    },
    {
      header: 'PancakeSwap Address',
      value: '0x19314Dfa75CfC1E5154f95daFaB217646bdb79AC',
    },
    {
      header: 'Locked Liquidity Address',
      value: '0x0e7b582003de0E541548cF02a1F00725Df6E6E6f',
    },
    {
      header: 'PooCoin Address',
      value: '0x19314Dfa75CfC1E5154f95daFaB217646bdb79AC',
    },
    {
      header: 'Presale Contract Address',
      value: '0x685C3083A8EeF94e4eBa075cfD04bf35202C09C5',
    },
  ];

  const linksIcons = [Telegram, Twitter, Link, Github, Subtract];

  return (
    <div className="container">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{name} | Lesspad</title>
        <meta name="description" content={`Pool. ${name}.`} />
      </Helmet>

      <div className="preview">
        <div className="description">
          <div className="logo-center">
            <img className="icon-logo" src={Logo} alt="Logo" />
          </div>
          <div className="description-info">
            <div className="description-info-header">
              <span>{name}</span>
            </div>
            <div className="description-info-text">
              Autonomous interest rate protocol for on-chain lending and borrowing
            </div>
            <div className="subscription">
              <a href={`${explorer}/token/${address}`} className="subscription-text">
                {address}
              </a>
              <img className="icon-subscribe" src={Subscribe} alt="Subscribe" />
            </div>
          </div>
        </div>
        <div className="preview-info">
          <div className="preview-info-days">
            <div className="preview-info-days-text">opens in 3 days</div>
          </div>
          <div className="preview-info-date">Listing: June 07, 2021 18:00 PM GMT</div>
        </div>
      </div>
      <div className="grow">
        <div className="grow-text">0.0001454 {currency} per Token</div>
        <div className="grow-progress">
          <div>0.000 {currency} Raised</div>
          <div>0 Participants</div>
        </div>
        <div className="grow-scale">
          <div className="grow-scale-progress">
            <div className="grow-scale-progress-value" />
          </div>
        </div>
        <div className="grow-info">
          <div className="grow-min">0.000% (Min 44.931%)</div>
          <div className="grow-max">0.000 / 1164.000 {currency}</div>
        </div>
      </div>

      <div className="box">
        <div className="row row-items">
          {row1.map((item, i) => (
            <div className={`${item.last ? 'item last' : 'item'} ${i % 2 !== 0 && 'cell'}`}>
              {item.header}
              {item.gradient ? (
                <div className="gradient-text">{item.value}</div>
              ) : (
                <div className="item-text">
                  {item.value}
                  {item.less ? <div className="item-text-gradient">LESS</div> : null}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="row row-items">
          {row2.map((item, i) => (
            <div className={`${item.last ? 'item last' : 'item'} ${i % 2 !== 0 && 'cell'}`}>
              {item.header}
              {item.gradient ? (
                <div className="gradient-text">{item.value}</div>
              ) : (
                <div className="item-text">
                  {item.value}
                  {item.less ? <div className="item-text-gradient">LESS</div> : null}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="row row-items last">
          {row3.map((item, i) => (
            <div className={`${item.last ? 'item last' : 'item'} ${i % 2 !== 0 && 'cell'}`}>
              {item.header}
              {item.gradient ? (
                <div className="gradient-text">{item.value}</div>
              ) : (
                <div className="item-text">
                  {item.value}
                  {item.less ? <div className="item-text-gradient">LESS</div> : null}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <YourTier tier="king" className="tier-block" />
      <div className="container-header">Your Investment</div>
      <div className="box box-bg">
        <div className="row last">
          {invest.map((item) => (
            <div className={item.last ? 'item last' : 'item'}>
              {item.header}
              <div className="item-text">
                <div className="item-text-bold">{item.value}</div>
                {item.less ? <div className="item-text-gradient">LESS</div> : null}
              </div>
              <div className="item-count">{item.count}</div>
              <div className="button-border">
                <div className="button">
                  <div className="gradient-button-text">{item.buttonText}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ParticipantsTable />
      <div className="container-header">Important Links</div>
      <div className="box">
        <div className="box-links">
          {links.map((item) => (
            <div className="box-links-link">
              <div className="box-links-link-content">
                <div className="box-links-link-content-header">{item.header}</div>
                <div>{item.value}</div>
              </div>
              <div className="box-links-link-button">
                <img src={Subscribe} alt="Subscribe icon" />
              </div>
            </div>
          ))}
          <div className="box-links-list">
            <div className="box-links-list-header">Connect</div>
            <div className="box-links-list-links">
              {linksIcons.map((link) => (
                <div className="box-links-list-links-item">
                  <img src={link} alt={`${link} icon`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container-header">Audit</div>
      <div className="box box-bg">
        <div className="box-text">Not audited yet.</div>
      </div>
    </div>
  );
};

export default Pool;
