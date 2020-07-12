import * as React from 'react';
import "../scss/settings.scss";
import { Row, Col, Card, Input, Form, Button, notification } from 'antd';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

@observer
export class Settings extends React.Component<{}> {
  @observable private email: string = "";

  @action private async getUserEmail(): Promise<void> {
    const response = await fetch("/api/misc/user/me", {
      headers: {
        Authorization: localStorage.getItem("auth-token-skool") || ""
      }
    });
    const responseJSON = await response.json();
    if (responseJSON.failed) {
      notification.error({
        message: responseJSON.reason
      });
      return;
    }
    this.email = responseJSON.email === null ? "" : responseJSON.email;
  } 

  public componentDidMount() {
    this.getUserEmail();
  }

  private async updateEmail(): Promise<void> {
    if (this.email.trim().length === 0) {
      notification.error({
        message: "New email cannot be empty"
      });
      return;
    }
    const response = await fetch("/api/misc/update-email", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("auth-token-skool") || "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.email
      })
    });
    const responseJSON = await response.json();
    if (responseJSON.failed) {
      notification.error({
        message: responseJSON.reason
      });

      return;
    }
    notification.success({
      message: "Email successfully updated"
    });
  }

  private logoutUser(): void {
    localStorage.removeItem("auth-token-skool");
    window.location.pathname = "/";
  }

  public render() {
    return (
      <main className="settings-container">
        <Row>
          <Col span={6} />
          <Col span={12}>
            <Card title="Profile Settings" id="profile-settings">
              <Row>
                <Col span={16}>
                  Email
                </Col>
                <Col span={8}>
                  <Form onFinish={() => this.updateEmail()}>
                    <Form.Item>
                      <Input placeholder="Email" value={this.email} onChange={ev => this.email = ev.target.value} />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  Logout of site
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Button type="primary" onClick={() => this.logoutUser()}>
                    Logout
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </main>
    );
  }
}