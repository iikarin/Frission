import * as React from 'react';
import "../scss/search.scss";
import { Typography, Form, Input, Checkbox, notification, Alert, Spin } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { TransportUser } from '../../../../types/transport-user';
import { User } from './user';

@observer
export class Search extends React.Component<{}> {
  @observable private searchText: string = "";
  @observable private sameSchool: boolean = false;
  @observable private result: Array<TransportUser> = [];
  @observable private searching: boolean = false;
  private timeout: NodeJS.Timeout = setTimeout(() => { }, 0);

  private async search(input: string): Promise<void> {
    this.searchText = input;
    if (this.searchText === "") {
      this.result = [];
      return;
    }
    this.searching = true;

    this.timeout = setTimeout(async () => {
      const response = await fetch(`/api/search/${encodeURIComponent(this.searchText)}?sameSchool=${this.sameSchool}`, {
        headers: {
          Authorization: localStorage.getItem("auth-token-skool") || ""
        }
      });
      const responseJSON = await response.json();
      this.searching = false;
  
      if (responseJSON.failed) {
        notification.error({
          message: responseJSON.reason
        });
        return;
      }
      this.result = responseJSON.users;
    }, 200);
  }

  public render() {
    return (
      <main className="search-container">
        <Typography.Title level={2}>
          Search for folks
        </Typography.Title>
        <Form
          wrapperCol={{ span: 8 }}
          onFinish={() => { }}
        >
          <Form.Item>
            <Input size="large" placeholder="Search with name" value={this.searchText} onChange={ev => this.search(ev.target.value)} />
          </Form.Item>
          <Form.Item>
            <Checkbox checked={this.sameSchool} onChange={ev => {
              this.search(this.searchText);
              this.sameSchool = ev.target.checked;
            }}>Same school</Checkbox>
          </Form.Item>
        </Form>
        {this.searching && (
          <>
            <Spin size="large" />
            <Typography.Text style={{ marginLeft: "1rem" }}>Searching...</Typography.Text>
          </>
        )}
        <section className="user-results">
          {!this.searching && this.result.length === 0 && (
            <Alert type="info" message="No results found" />
          )}
          {this.result.map(result => <User {...result} />)}
        </section>
      </main>
    )
  }
}