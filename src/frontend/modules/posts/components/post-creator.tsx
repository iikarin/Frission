import * as React from 'react';
import { Typography, Input, Button, Row, Col, notification } from 'antd';
import "../scss/post-creator.scss";
import { observer } from 'mobx-react';
import { observable } from 'mobx';

@observer
export class PostCreator extends React.Component<{ scope: "all" | "connections"; refresh: () => any; }> {
  @observable private postContent: string = "";

  private async createPost(): Promise<void> {
    if (this.postContent.trim().length === 0) {
      notification.error({
        message: "Content cannot be empty or consist entirely of spaces"
      });
      return;
    }
    const response = await fetch(`/api/posts/create`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("auth-token-skool") || "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: new Date(),
        content: this.postContent,
        scope: this.props.scope
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
      message: "Post successfully published"
    });
    this.props.refresh();
  }

  public render() {
    return (
      <Row>
        <Col span={8}>
          <section className="post-creator">
            <Input.TextArea
              placeholder="Share something..."
              autoSize={{
                minRows: 4
              }}
              value={this.postContent}
              onChange={ev => this.postContent = ev.target.value}
            />
            <section className="actions">
              <Typography.Text className="scope-decl">
                Scope: {this.props.scope}
              </Typography.Text>
              <Button type="primary" onClick={() => this.createPost()}>
                Post
              </Button>
            </section>
          </section>
        </Col>
        <Col span={8} />
        <Col span={8} />
      </Row>
    )
  }
}