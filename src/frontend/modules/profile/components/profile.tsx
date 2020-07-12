import * as React from "react";
import { Typography, notification, Spin, Alert } from "antd";
import { observable, action } from "mobx";
import { TransportUser } from "../../../../types/transport-user";
import { Post as PostEntity } from "../../../../backend/entity/post";
import { Post } from "../../posts/components/post";
import "../scss/profile.scss";
import { observer } from "mobx-react";

@observer
export class Profile extends React.Component<{ id: string; }> {
  @observable private loading: boolean = true;
  @observable private user?: TransportUser;
  @observable private posts: Array<PostEntity> = [];

  @action private async getProfile(): Promise<void> {
    const response = await fetch(`/api/misc/profile/${this.props.id}`, {
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
    this.loading = false;
    this.user = responseJSON.user;
    this.posts = responseJSON.posts;
  }

  public componentDidMount() {
    this.getProfile();
  }

  public render() {
    if (!this.user || this.loading) {
      return (
        <section className="loading-container">
          <Spin size="large" />
        </section>
      )
    }
    return (
      <main className="profile-container">
        <section className="header">
          <section className="text">
            <Typography.Title level={2} style={{ color: "#ffffff" }}>
              {this.user.name}
            </Typography.Title>
            <Typography.Title level={3} style={{ color: "#ffffff" }}>
              {this.user.username}
            </Typography.Title>
            <Typography.Paragraph style={{ color: "#ffffff" }}>
              Contact: {this.user.email ? this.user.email : "Email not set"}
            </Typography.Paragraph>
          </section>
        </section>
        <Typography.Title level={2} style={{ marginLeft: ".5rem" }}>
          Posts
        </Typography.Title>
        <section className="posts">
          {this.posts.length === 0 && (
            <Alert message="No posts from this user" type="info" />
          )}
          {this.posts.map(post => <Post post={post} />)}
        </section>
      </main>
    )
  }
}