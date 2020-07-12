import * as React from 'react';
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Form, Input, Typography, Select, Button, notification } from 'antd';
import "../scss/register.scss";
import { Redirect } from 'react-router-dom';

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

@observer
export class Register extends React.Component<{}> {
  @observable private name: string = "";
  @observable private username: string = "";
  @observable private schoolName: string = "";
  @observable private password: string = "";
  @observable private grade: number = 11;
  @observable private redirectToDashboard: boolean = false;

  private async submitForm() {
    if (this.name.trim().length === 0) {
      notification.error({
        message: "Name cannot be empty or entirely spaces"
      });
      return;
    }
    if (this.name.length > 255) {
      notification.error({
        message: "Name cannot be more than 255 characters"
      });
      return;
    }
    if (this.username.trim().length === 0) {
      notification.error({
        message: "Username cannot be empty or entirely spaces"
      });
      return;
    }
    // TODO: Check username available or not
    if (this.schoolName.trim().length === 0) {
      notification.error({
        message: "School name cannot be empty or entirely spaces"
      });
      return;
    }
    if (this.password.length === 0) {
      notification.error({
        message: "Password cannot be empty"
      });
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: this.name,
        username: this.username,
        school: this.schoolName,
        grade: this.grade,
        password: this.password,
      }),
      headers: {
        "Content-Type": "application/json"
      }
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
      <section className="register-page">
        <Typography.Title>
          Register for an account
        </Typography.Title>
        <Form wrapperCol={{ span: 6 }} onFinish={() => this.submitForm()}>
          <Form.Item rules={[{
            required: true,
            message: "This is a required field"
          }]}>
            <Input placeholder="Name" value={this.name} onChange={ev => this.name = ev.target.value} />
          </Form.Item>
          <Form.Item rules={[{
            required: true,
            message: "This is a required field"
          }]}>
            <Input placeholder="Username" value={this.username} onChange={ev => this.username = ev.target.value} />
          </Form.Item>
          <Typography.Text className="tip">
            Quick note: Use the most general name possible, it will help
            visibility and would help your peers find you easier.
          </Typography.Text>
          <Form.Item rules={[{
            required: true,
            message: "This is a required field"
          }]}>
            <Input placeholder="School" value={this.schoolName} onChange={ev => this.schoolName = ev.target.value} />
          </Form.Item>
          <Form.Item rules={[{
            required: true,
            message: "This is a required field"
          }]}>
            <Select placeholder="Grade" value={this.grade} onChange={value => this.grade = value}>
              {GRADES.map(grade => (
                <Select.Option value={grade} key={grade}>
                  {grade}th Grade
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item rules={[{
            required: true,
            message: "This is a required field"
          }]}>
            <Input.Password placeholder="Password" value={this.password} onChange={ev => this.password = ev.target.value} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Register</Button>
          </Form.Item>
        </Form>
      </section>
    )
  }
}