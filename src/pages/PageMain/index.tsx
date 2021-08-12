import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Button from '../../components/Button';
import { modalActions } from '../../redux/actions';
// import logo1 from '../../assets/img/sections/alumni-logos/logo-1.svg';
import PoweredBy from '../About/PoweredBy/index';

import PoolsinVoting from './PoolsinVoting/index';
// import FeaturedAlumni from './FeaturedAlumni';
import FeaturedProject from './FeaturedProjects';
import Features from './Features';
import Tiers from './Tiers';
import TopBlock from './TopBlock';

import s from './PageMain.module.scss';

// const partnersLogos = [logo1, logo1, logo1, logo1, logo1, logo1, logo1, logo1];

const PageMain: React.FC = () => {
  const history = useHistory();

  const dispatch = useDispatch();
  const toggleModal = React.useCallback((params) => dispatch(modalActions.toggleModal(params)), [
    dispatch,
  ]);
  const { address: userAddress } = useSelector(({ user }: any) => user);

  const showMessageIfNoMetamask = async () => {
    try {
      if (userAddress) return;
      toggleModal({
        open: true,
        text: (
          <div className={s.messageContainer}>
            <p>Please, connect metamask to be able to create pool</p>
          </div>
        ),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoToCreatePool = () => {
    try {
      history.push('/create-pool');
      showMessageIfNoMetamask();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className={s.page}>
      <TopBlock />
      <PoweredBy className={s.darkBg} />
      <FeaturedProject />
      <PoolsinVoting />
      <Features />
      <Tiers />
      {/*<FeaturedAlumni logos={partnersLogos} title="Our Partners" />*/}

      <div className={s.container}>
        <div className={s.info}>
          <div className={s.info_inner}>
            <div className={s.info_left}>
              We aim to provide a seamless experience for fund raising and exposure on any major
              protocol
            </div>
            <div className={s.info_right}>
              <div className={s.info_right__text}>
                Funding? Exposure? <br /> LessPad has it all, click below!
              </div>
              <Button onClick={handleGoToCreatePool}>Start application</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PageMain;
