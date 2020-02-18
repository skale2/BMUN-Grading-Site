import React from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Typography,
  Divider,
  Switch,
  message
} from "antd";
import { COMMITTEES } from "../constants";
import backend from "../backend";

const { Title } = Typography;

class Export extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createPath: {
        sheetName: `Committee Grading (${COMMITTEES[props.committee]})`,
        loading: false
      },
      updatePath: {
        spreadsheetId: "",
        location: "",
        includeHeader: false,
        loading: false
      }
    };
  }

  exportNew = name => {
    this.setState({
      createPath: {
        ...this.state.createPath,
        loading: true
      }
    });
    backend.exportNew(name, true).then(spreadsheet => {
      this.setState({
        createPath: {
          ...this.state.createPath,
          loading: false
        }
      });
      message.success(
        <span>
          Exported successfully{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={spreadsheet.spreadsheetUrl}
          >
            here
          </a>
          !
        </span>
      );
    });
  };

  exportUpdate = (spreadsheetId, location, includeHeader) => {
    this.setState({
      createPath: {
        ...this.state.createPath,
        loading: true
      }
    });
    backend.exportUpdate(spreadsheetId, location, includeHeader).then(spreadsheet => {
      this.setState({
        createPath: {
          ...this.state.createPath,
          loading: false
        }
      });
      message.success(
        <span>
          Exported successfully{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={spreadsheet.spreadsheetUrl}
          >
            here
          </a>
          !
        </span>
      );
    });
  };

  render() {
    return (
      <Row>
        <Row>
          <Title
            style={{ color: "rgb(89, 89, 89", margin: "1em 0em 1.5em" }}
            level={3}
          >
            Create a new spreadsheet
          </Title>
        </Row>

        <Row style={{ width: "70%", margin: "0em auto 5em" }}>
          <div
            style={{ fontSize: 18, fontWeight: 500, margin: "0em 0em 0.5em" }}
          >
            Title
          </div>
          <div style={{ fontSize: 16, fontWeight: 400, marginBottom: "2em" }}>
            The name of the new spreadsheet.
          </div>
          <Input
            size="large"
            value={this.state.createPath.sheetName}
            style={{ marginBottom: "3em" }}
            onChange={e => {
              console.log(e);
              this.setState({ createPath: { sheetName: e.target.value } });
            }}
          />
          <Button
            icon={this.state.createPath.loading ? "loading" : undefined}
            style={{
              float: "right"
            }}
            size="large"
            type="primary"
            disabled={this.state.createPath.loading}
            onClick={() => this.exportNew(this.state.createPath.sheetName)}
          >
            Export
          </Button>
        </Row>
        <Divider />
        <Row style={{ margin: "5em 0em 1.5em" }}>
          <Title style={{ color: "rgb(89, 89, 89" }} level={3}>
            Update an existing spreadsheet
          </Title>
        </Row>
        <Row style={{ width: "70%", margin: "0 auto" }} justify="center">
          <Col>
            <div
              style={{ fontSize: 18, fontWeight: 500, marginBottom: "0.5em" }}
            >
              Spreadsheet ID
            </div>
            <div
              style={{ fontSize: 16, fontWeight: 400, marginBottom: "1.5em" }}
            >
              The{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://developers.google.com/sheets/api/guides/concepts#spreadsheet_id"
              >
                spreadsheet ID
              </a>{" "}
              of the spreadsheet to update. Must be a spreadsheet you have edit
              access to.
            </div>
            <Input
              size="large"
              value={this.state.updatePath.spreadsheetId}
              placeholder="110u29tNeFE_u-Q-D53MvPd_m-sYO-1LzT2Ly_B1MRL4"
              onChange={e =>
                this.setState({
                  updatePath: {
                    ...this.state.updatePath,
                    spreadsheetId: e.target.value
                  }
                })
              }
              style={{
                marginBottom: "2em"
              }}
            />
            <div
              style={{ fontSize: 18, fontWeight: 500, marginBottom: "0.5em" }}
            >
              Update location
            </div>
            <div
              style={{ fontSize: 16, fontWeight: 400, marginBottom: "1.5em" }}
            >
              The location to start updating from, in{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://developers.google.com/sheets/api/guides/concepts#a1_notation"
              >
                A1 notation.
              </a>{" "}
            </div>
            <Input
              size="large"
              value={this.state.updatePath.location}
              placeholder="Sheet1!B1"
              style={{ marginBottom: "2em" }}
              onChange={e =>
                this.setState({
                  updatePath: {
                    ...this.state.updatePath,
                    sheetName: e.target.value
                  }
                })
              }
            />
            <Row type="flex" gutter={20}>
              <Col
                style={{ fontSize: 18, fontWeight: 500, marginBottom: "0.5em" }}
              >
                Include header row
              </Col>
              <Col>
                <Switch
                  value={this.state.updatePath.includeHeader}
                  onChange={checked =>
                    this.setState({
                      updatePath: {
                        ...this.state.updatePath,
                        includeHeader: checked
                      }
                    })
                  }
                />
              </Col>
            </Row>
            <div style={{ fontSize: 16, fontWeight: 400, marginBottom: "4em" }}>
              Whether to include an extra header row with column names.
            </div>
            <Button
              style={{
                float: "right"
              }}
              disabled={
                this.state.updatePath.location.length === 0 ||
                this.state.updatePath.spreadsheetId.length === 0
              }
              size="large"
              type="primary"
            >
              Export
            </Button>
          </Col>
        </Row>
      </Row>
    );
  }
}

export default Export;
