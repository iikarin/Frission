import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { notification } from 'antd';
import * as jwt from "jsonwebtoken";
import { Link } from 'react-router-dom';

@observer
export class PostUser extends React.Component<{ id: number; }> {
  @observable private name?: React.ReactNode;

  @action private async fetchName(): Promise<void> {
    const resposne = await fetch(`/api/misc/user/${this.props.id}`, {
      headers: {
        Authorization: localStorage.getItem("auth-token-skool") || ""
      },
    });
    const responseJSON = await resposne.json();
    if (responseJSON.failed) {
      notification.error({
        message: responseJSON.reason
      });
      this.name = "Unknown";
      return;
    }
    const currentUser = jwt.decode(localStorage.getItem("auth-token-skool") || "");
    if (!currentUser || typeof currentUser === "string") {
      this.name = responseJSON.name;
      return;
    }
    if (currentUser.id === responseJSON.id) {
      this.name = "You";
      return;
    }
    this.name = <Link to={`/user/profile/${responseJSON.id}`}>{responseJSON.name}</Link>;
  } 

  public componentDidMount() {
    this.fetchName();
  }

  public componentDidUpdate(prevProps: { id: number; }) {
    if (this.props.id !== prevProps.id) {
      this.fetchName();
    }
  }

  public render() {
    return (
      <>
        {!this.name ? (
          "Loading..."
        ) : (
          this.name
        )}
      </>
    )
  }
}