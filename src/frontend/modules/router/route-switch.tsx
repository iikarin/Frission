import * as React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { Splash } from '../splash/components/splash';
import { AuthRouter } from './auth-router';
import { Register } from '../auth/components/register';
import { Login } from '../auth/components/login';

export const RouteSwitch: React.FunctionComponent<{}> = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/user">
          <AuthRouter />
        </Route>
        <Route path="/auth/login">
          <Login />
        </Route>
        <Route path="/auth/register">
          <Register />
        </Route>
        <Route path="/" exact>
          <Splash />
        </Route>
        <Route path="/">
          404
        </Route>
      </Switch>
    </BrowserRouter>
  )
}