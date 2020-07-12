import * as React from 'react';
import "../scss/splash.scss";
import { Typography, Button } from "antd";
import { Link } from 'react-router-dom';

export interface SplashComponentProps {}

export class Splash extends React.Component<SplashComponentProps> {
  public render() {
    return (
      <main className="splash-page">
        <section className="splash-illustration-container">
          <div className="splash-illustration" />
        </section>
        <section className="splash-text">
          <Typography.Title level={2}>Frission - Connect with your schoolmates</Typography.Title>
          <Typography.Paragraph className="splash-paragraph">
            We all know how frustrating it can be, to not be able to interact with your friends in the way you used to
            in school, and understandably so. Let's fix that!
          </Typography.Paragraph>
          <Typography.Paragraph className="splash-paragraph">
            Create an account with us and connect with your friends, make new friends, interact with them just as usually
            you would in your school!
          </Typography.Paragraph>
          <section className="link-buttons">
            <Link to="/auth/register">
              <Button type="primary">
                Create an account
              </Button>
            </Link>
            <span className="log-in-message">
              Already have an account?
            </span>
            <Link to="/auth/login">
              <Button type="default">
                Log right in!
              </Button>
            </Link>
          </section>
        </section>
      </main>
    )
  }
}