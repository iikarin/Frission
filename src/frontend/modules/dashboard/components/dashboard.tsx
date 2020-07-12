import * as React from 'react';
import { Typography, Statistic, Row, Col, notification, Card } from 'antd';
import "../scss/dashboard.scss";
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import * as moment from "moment";
import { Schedule } from '../../../../backend/entity/schedule';
import { Post } from '../../posts/components/post';
import { Post as PostEntity } from "../../../../backend/entity/post";

@observer
export class Dashboard extends React.Component<{}> {
  @observable private sameSchoolUsers: number = 0;
  @observable private upcomingEvents: Array<Schedule> = [];
  @observable private closestEvent?: Schedule;
  @observable private sameSchoolPosts: Array<PostEntity> = [];

  @action private async getSameSchoolUsers(): Promise<void> {
    const response = await fetch("/api/misc/same-school", {
      headers: {
        Authorization: localStorage.getItem("auth-token-skool") || ''
      }
    });
    const responseJSON = await response.json();
    if (responseJSON.failed) {
      notification.error({
        message: responseJSON.reason
      });
      return;
    }
    this.sameSchoolUsers = responseJSON.length;
  }

  @action private async getSameSchoolPosts(): Promise<void> {
    const response = await fetch("/api/misc/recents-from-same-school?max=2", {
      headers: {
        Authorization: localStorage.getItem("auth-token-skool") || ''
      }
    });
    const responseJSON = await response.json();
    if (responseJSON.failed) {
      notification.error({
        message: responseJSON.reason
      });
      return;
    }
    this.sameSchoolPosts = responseJSON.posts;
  }

  @action private async getUpcomingEvents(): Promise<void> {
    const resposne = await fetch(`/api/schedule/get?currentDate=${encodeURIComponent((new Date()).toString())}`, {
      headers: {
        Authorization: localStorage.getItem("auth-token-skool") || ""
      }
    });
    const responseJSON = await resposne.json();
    if (responseJSON.failed) {
      notification.error({
        message: responseJSON.reason
      });
      return;
    }
    this.upcomingEvents = responseJSON.schedule;
    if (responseJSON.count === 0) return;
    this.closestEvent = this.upcomingEvents.sort((a, b) => moment(a.date).diff(b.date))[0];
  }

  public componentDidMount() {
    this.getSameSchoolUsers();
    this.getUpcomingEvents();
    this.getSameSchoolPosts();
  }

  public render() {
    return (
      <section className="dashboard-container">
        <Typography.Title>
          Welcome to your dashboard!
        </Typography.Title>
        <section className="stats">
          <Row>
            <Typography.Title level={3}>Some quick numbers</Typography.Title>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic title="Folks from the same school" value={this.sameSchoolUsers} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Upcoming events" value={this.upcomingEvents.length} />
              </Card>
            </Col>
          </Row>
        </section>
        <br />
        <Typography.Title level={3}>
          Closest event
        </Typography.Title>
        <Row className="closest-event-container">
          <Col span={12}>
            {!this.closestEvent ? (
              "No upcoming events"
            ) : (
              <section className="event" key={this.closestEvent.id}>
                <time className="date-repr">
                  <section className="month">{moment(this.closestEvent.date).format("MMM")}</section>
                  <section className="date">{moment(this.closestEvent.date).format("DD")}</section>
                </time>
                <section className="event-body">
                  <Typography.Title level={4}>{this.closestEvent.title}</Typography.Title>
                  <Typography.Paragraph>
                    {this.closestEvent.description}
                  </Typography.Paragraph>
                </section>
              </section>
            )}
          </Col>
        </Row>
        <br />
        <Typography.Title level={3}>
          Recent posts of folks from your school
        </Typography.Title>
        <section className="recent-posts">
          {this.sameSchoolPosts.length === 0 && "No posts here yet. :("}
          {this.sameSchoolPosts.map(post => (
            <Post post={post} />
          ))}
        </section>
      </section>
    )
  }
}