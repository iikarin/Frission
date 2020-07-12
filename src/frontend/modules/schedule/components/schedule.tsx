import '../scss/schedule.scss';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, notification, Row, Col, DatePicker, Alert } from 'antd';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Schedule as ScheduleEntity } from "../../../../backend/entity/schedule";
import * as moment from "moment";

@observer
export class Schedule extends React.Component<{}> {
  @observable private newEventTitle: string = "";
  @observable private newEventDesc: string = "";
  @observable private newEventDate: moment.Moment = moment(new Date());
  @observable private showForm: boolean = true;
  @observable private upcomingEvents: Array<ScheduleEntity> = [];
  @observable private showingAllEvents: boolean = false;

  @action private async getSchedules(upcoming: boolean = true): Promise<void> {
    let uri = "";
    if (upcoming) {
      uri = `/api/schedule/get?currentDate=${encodeURIComponent((new Date()).toString())}`;
      this.showingAllEvents = false;
    } else {
      uri = `/api/schedule/get`;
      this.showingAllEvents = true;
    }
    const resposne = await fetch(uri, {
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
  }

  public componentDidMount() {
    this.getSchedules();
  }

  @action private async submitForm(): Promise<void> {
    if (this.newEventTitle.trim().length === 0) {
      notification.error({
        message: "Event title cannot be empty or entirely spaces"
      });
      return;
    }
    const response = await fetch('/api/schedule/create', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("auth-token-skool") || ""
      },
      body: JSON.stringify({
        title: this.newEventTitle,
        description: this.newEventDesc,
        date: this.newEventDate.toString()
      })
    });
    const responseJSON = await response.json();
    if (responseJSON.failed) {
      notification.error({
        message: responseJSON.reason
      });
      return;
    }
    const { savedSchedule } = responseJSON as { savedSchedule: ScheduleEntity };
    if (moment(savedSchedule.date).isAfter(new Date()) || !this.showingAllEvents) {
      this.upcomingEvents.push(savedSchedule);
    }
    this.newEventTitle = ""; this.newEventDesc = ""; this.newEventDate = moment();
  }

  public render() {
    return (
      <section className="schedule-container">
        <Typography.Title>
          Schedular
        </Typography.Title>
        <Form className="add-event-form" onFinish={() => this.submitForm()} style={{ display: this.showForm ? "block" : "none" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item>
                <Input placeholder="Title" value={this.newEventTitle} onChange={ev => this.newEventTitle = ev.target.value} /> 
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <DatePicker value={this.newEventDate} onChange={date => { if(date) this.newEventDate = date }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Input.TextArea
              value={this.newEventDesc}
              onChange={ev => this.newEventDesc = ev.target.value}
              autoSize={{ minRows: 3 }}
              placeholder="Event description (not required) Supports MarkDown."
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Create
          </Button>
          <Button type="default" onClick={() => this.showForm = false} style={{ marginLeft: "1rem" }}>
            Hide Form
          </Button>
        </Form>
        {!this.showForm && (
          <Button type="primary" size="large" onClick={() => this.showForm = true}>Show Form</Button>
        )}
        <br />
        <Typography.Title level={2}>
          {this.showingAllEvents ? "All" : "Upcoming"} events
        </Typography.Title>
        <Button type="default" onClick={() => this.getSchedules(this.showingAllEvents)}>
          {this.showingAllEvents ? "Show upcoming events" : "Show all events"}
        </Button>
        <section className="events">
          {this.upcomingEvents.length === 0 && (
            <Alert type="info" message="Looks like you don't have any events just yet" style={{ marginTop: "1rem" }} />
          )}
          {this.upcomingEvents.sort((a, b) => moment(a.date).diff(b.date)).map(event => (
            <section className="event" key={event.id}>
              <time className="date-repr">
                <section className="month">{moment(event.date).format("MMM")}</section>
                <section className="date">{moment(event.date).format("DD")}</section>
              </time>
              <section className="event-body">
                <Typography.Title level={4}>{event.title}</Typography.Title>
                <Typography.Paragraph>
                  {event.description}
                </Typography.Paragraph>
              </section>
            </section>
          ))}
        </section>
      </section>
    );
  }
}