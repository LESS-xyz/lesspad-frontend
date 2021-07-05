import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Page404 from '../Page404';

import Pool from './Pool';

const Project: React.FC = () => {
  const { path }: any = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <Page404 />
      </Route>
      <Route path={`${path}/:address`}>
        <Pool />
      </Route>
    </Switch>
  );
};

export default Project;
