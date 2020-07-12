import * as React from 'react';
import { Typography, Card, notification } from 'antd';
import { PostCreator } from './post-creator';
import "../scss/posts.scss";
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { HeartTwoTone } from "@ant-design/icons";
import * as moment from "moment";
import { Post } from './post';
import { Post as PostEntity } from "../../../../backend/entity/post";

export interface PostComponentProps {
  scope: "all"|"connections";
}

@observer
export class Posts extends React.Component<PostComponentProps> {
  @observable private posts: Array<PostEntity> = [];

  @action private async getPosts(): Promise<void> {
    const response = await fetch(`/api/posts/get/${this.props.scope}`, {
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
    this.posts = responseJSON.posts;
  }

  componentDidMount() {
    this.getPosts();
  }

  componentDidUpdate(prevProps: PostComponentProps) {
    if (this.props.scope !== prevProps.scope) {
      this.getPosts();
    }
  }

  public render() {
    return (
      <main className="posts-container">
        <Typography.Title level={1}>
          {this.props.scope === "all" ? "Posts" : "Post from connected folks"}
        </Typography.Title>
        <PostCreator refresh={() => this.getPosts()} scope={this.props.scope} />
        <section className="posts">
          {this.posts.length === 0 && (
            "No posts from this scope"
          )}
          {this.posts.sort((a, b) => moment(b.createdOn).diff(a.createdOn)).map(post => (
            <Post post={post} />
          ))}
        </section>
      </main>
    );
  }
}