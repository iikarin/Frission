import { Post as PostEntity } from "../../../../backend/entity/post";
import * as React from 'react';
import { Card, Typography } from "antd";
import { HeartTwoTone } from "@ant-design/icons";
import { PostUser } from "./post-user";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";

export class Post extends React.Component<{ post: PostEntity }> {

  private computeHeartColor(): { color: string; } | {} {
    const currentUser = jwt.decode(localStorage.getItem("auth-token-skool") || "");
    if (!currentUser || typeof currentUser === "string") {
      return {};
    }
    if (this.props.post.hearts.includes(currentUser.id)) {
      return { color: "#ff006e" };
    } else {
      return { color: "#3a86ff" };
    }
  }

  private async toggleHeartPost(): Promise<void> {

  }

  public render() {
    return (
      <Card title={<PostUser id={this.props.post.author} />} actions={[
        <span>Posted On: {moment(this.props.post.createdOn).format("DD/MM/YY")}</span>
      ]}>
        <Typography.Paragraph>
          {this.props.post.content}
        </Typography.Paragraph>
      </Card>
    )
  }
}