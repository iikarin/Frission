import * as React from "react";
import { TransportUser } from "../../../../types/transport-user";
import { Card, Typography, notification, Button } from "antd";
import * as jwt from "jsonwebtoken";
import { observable } from "mobx";
import { Link } from "react-router-dom";

export class User extends React.Component<TransportUser> {
  @observable private currentUserId?: number;

  componentDidUpdate() {
    const user = jwt.decode(localStorage.getItem("auth-token-skool") || "");
    if (!user || typeof user === "string") return;
    this.currentUserId = user.id;
  }

  private getActions(): Array<any> {
    // if (this.props.id === this.currentUserId) {
    //   return [];
    // }
    // return [
    //   <span onClick={() => this.connectUser()}>
    //     Connect
    //   </span>
    // ]
    return [];
  }

  private async disconnect(): Promise<void> {}

  private async connectUser(): Promise<void> {
    const response = await fetch(`/api/misc/connect/${this.props.id}`, {
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
    if (responseJSON.alreadyConnected) {
      notification.info({
        message: (
          <>
            Looks like you are already following them. Do you want to <Button type="link" onClick={() => this.disconnect()}>disconnect</Button> them?
          </>
        )
      })
    }
    notification.success({
      message: `You are now connected to ${this.props.username}`
    });
  }

  public render() {
    return (
      <Card title={(
        <Link to={`/user/profile/${this.props.id}`}>{this.props.name}</Link>
      )} actions={this.getActions()}>
        <Typography.Text strong>
          {this.props.email ? this.props.email : "No email set"}
        </Typography.Text>
        <br />
        <Typography.Text>
          Studies at {this.props.school}
        </Typography.Text>
        <br />
        <Typography.Text>
          a.k.a. {this.props.username}
        </Typography.Text>
      </Card>
    )
  }
}