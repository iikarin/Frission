import * as React from 'react';
import { Switch, useRouteMatch, Route, Link } from 'react-router-dom';
import { NotAllowed } from './not-allowed';
import { Layout, Menu, Typography } from 'antd';
import "./scss/auth-router.scss";
import { AppstoreTwoTone, CalendarTwoTone, LikeTwoTone, SettingTwoTone, SearchOutlined } from "@ant-design/icons";
import { Dashboard } from '../dashboard/components/dashboard';
import { Schedule } from '../schedule/components/schedule';
import { Posts } from '../posts/components/posts';
import { Settings } from '../settings/components/settings';
import { Search } from '../search/components/search';
import { ProfileContainer } from '../profile/components/profile-container';

export const AuthRouter: React.FunctionComponent<{}> = (): JSX.Element => {
  const authRoute = useRouteMatch();
  const [sidebarCollapsed, changeSidebarCollapsed] = React.useState<boolean>();

  const isAuthorized = localStorage.getItem("auth-token-skool");
  if (!isAuthorized) {
    return (
      <NotAllowed />
    );
  }

  return (
    <Layout className="auth-routes-envelope">
      <Layout.Sider width={240} className="sidebar" collapsible collapsed={sidebarCollapsed} onCollapse={value => changeSidebarCollapsed(value)}>
        <Menu
          mode="inline"
        >
          <Typography.Title level={2} className="logo">
            Frission
          </Typography.Title>
          <Menu.Item icon={<AppstoreTwoTone twoToneColor="#ff006e" />}>
            <Link to="/user/dashboard">
              Dashboard
            </Link>
          </Menu.Item>
          <Menu.Item icon={<CalendarTwoTone twoToneColor="#ff006e" />}>
            <Link to="/user/schedule">
              Schedule
            </Link>
          </Menu.Item>
          <Menu.SubMenu
            title={(
              <>
                <LikeTwoTone twoToneColor="#ff006e" />
                Posts
              </>
            )}
          >
            <Menu.Item>
              <Link to="/user/posts/all">
                All
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item icon={<SearchOutlined style={{ color: "#ff006e" }} />}>
            <Link to="/user/search">
              Search
            </Link>
          </Menu.Item>
          <Menu.Item icon={<SettingTwoTone twoToneColor="#ff006e" />}>
            <Link to="/user/settings">
              Setting
            </Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Layout.Content>
        <Switch>
          <Route path={`${authRoute.path}/dashboard`}>
            <Dashboard />
          </Route>
          <Route path={`${authRoute.path}/schedule`}>
            <Schedule />
          </Route>
          <Route path={`${authRoute.path}/posts/all`}>
            <Posts scope="all" />
          </Route>
          <Route path={`${authRoute.path}/posts/connections`}>
            <Posts scope="connections" />
          </Route>
          <Route path={`${authRoute.path}/profile/:id`}>
            <ProfileContainer />
          </Route>
          <Route path={`${authRoute.path}/search`}>
            <Search />
          </Route>
          <Route path={`${authRoute.path}/settings`}>
            <Settings />
          </Route>
        </Switch>
        </Layout.Content>
        <Layout.Footer style={{ background: "#000" }}>
          <Typography.Title level={2} style={{ color: '#ededed' }}>Copyright Gourab Inc. 2020</Typography.Title>
        </Layout.Footer>
      </Layout>
    </Layout>
  )
}