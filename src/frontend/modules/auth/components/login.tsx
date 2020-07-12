import * as React from 'react';
import { Typography, Form, Input, notification, Button } from 'antd';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Redirect } from 'react-router-dom';
import "../scss/login.scss";

@observer
export class Login extends React.Component<{}> {
  @observable private username: string = "";
  @observable private redirectToDashboard: boolean = false;
  @observable private password: string = "";

  private async submitForm(): Promise<void> {
    const response = await fetch('/api/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    });
    const responseJSON = await response.json();
    if (responseJSON.failed) {
      notification.error({
        message: responseJSON.reason
      });
      return;
    }
    localStorage.setItem("auth-token-skool", responseJSON.jwt);
    this.redirectToDashboard = true;
  }

  public render() {
    if (this.redirectToDashboard) return <Redirect to="/user/dashboard" />;
    return (
      <section className="login-page">
        <Typography.Title>
          Login to your account
        </Typography.Title>
        <Form wrapperCol={{ span: 6 }} onFinish={() => this.submitForm()}>
          <Form.Item>
            <Input placeholder="Username" value={this.username} onChange={ev => this.username = ev.target.value} />
          </Form.Item>
          <Form.Item>
            <Input.Password placeholder="Password" type="password" value={this.password} onChange={ev => this.password = ev.target.value} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form>
      </section>
    )
  }
}