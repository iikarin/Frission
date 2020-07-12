import * as React from 'react';
import { render } from 'react-dom';
import { RouteSwitch } from './modules/router/route-switch';
import "antd/dist/antd.less";
import "./modules/util/root-style.scss";

render((
  <RouteSwitch />
), document.querySelector("[data-app-mount]"));
