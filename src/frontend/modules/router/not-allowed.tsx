import * as React from 'react';
import { Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import "./scss/not-allowed.scss";

export const NotAllowed: React.FunctionComponent<{}> = (): JSX.Element => (
  <section className="not-allowed-page">
    <Typography.Title>
      It seems you aren't logged in yet.
    </Typography.Title>
    <section className="actions">
      <Link to="/auth/login">
        <Button type="primary">
          Login
        </Button>
      </Link>
      <Typography.Paragraph>
        Or if you don't have an account yet
      </Typography.Paragraph>
      <Link to="/auth/register">
        <Button type="default">
          Register
        </Button>
      </Link>
    </section>
  </section>
)