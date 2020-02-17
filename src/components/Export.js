import React from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Typography,
  Divider,
  Switch,
  Form,
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
        includeHeader: true,
        loading: false
      },
      updatePath: {
        spreadsheetId: "",
        location: "Sheet1!A1",
        includeHeader: false,
        loading: false,
        errors: {
          spreadsheetId: undefined,
          location: undefined
        }
      }
    };
  }

  openInNewTab = url => {
    window.open(url, "_blank").blur();
    window.focus();
  };

  exportNew = (name, includeHeader) => {
    this.setState({
      createPath: {
        ...this.state.createPath,
        loading: true
      }
    });
    backend.exportNew(name, includeHeader).then(spreadsheet => {
      this.setState({
        createPath: {
          sheetName: "",
          includeHeader: true,
          loading: false
        }
      });

      message.success("Exported successfully!");
      this.openInNewTab(spreadsheet.spreadsheetUrl);
    });
  };

  exportUpdate = (spreadsheetId, location, includeHeader) => {
    this.setState({
      updatePath: {
        ...this.state.updatePath,
        loading: true
      }
    });
    backend
      .exportUpdate(spreadsheetId, location, includeHeader)
      .then(result => {
        this.setState({
          updatePath: {
            errors: {
              spreadsheetId: undefined,
              location: undefined
            },
            location: "",
            spreadsheetId: "",
            includeHeader: false,
            loading: false
          }
        });

        message.success("Exported successfully!");
        this.openInNewTab(
          `https://docs.google.com/spreadsheets/d/${result.result.spreadsheetId}/edit`
        );
      })
      .catch(error => {
        error = error.result.error;

        if (error.code === 404) {
          this.setState({
            updatePath: {
              ...this.state.updatePath,
              loading: false,
              errors: {
                spreadsheetId: "Couldn't find a spreadsheet with this ID"
              }
            }
          });
        } else if (error.code === 403) {
          this.setState({
            updatePath: {
              ...this.state.updatePath,
              loading: false,
              errors: {
                spreadsheetId:
                  "You don't have permission to edit this spreadsheet"
              }
            }
          });
        } else if (error.code === 400) {
          if (error.message === "Location not in single-cell A1 notation") {
            this.setState({
              updatePath: {
                ...this.state.updatePath,
                loading: false,
                errors: {
                  location: error.message
                }
              }
            });
          } else if (/Unable to parse range:/.test(error.message)) {
            this.setState({
              updatePath: {
                ...this.state.updatePath,
                loading: false,
                errors: {
                  location: "Cannot find location in spreadsheet"
                }
              }
            });
          }
        } else {
          this.setState({
            updatePath: {
              ...this.state.updatePath,
              loading: false,
              errors: {
                spreadsheetId: error.message
              }
            }
          });
        }
      });
  };

  render() {
    return (
      <Row>
        <Form>
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
            <Form.Item
              style={{
                marginBottom: "3em"
              }}
            >
              <Input
                size="large"
                placeholder={`Committee Grading (${
                  COMMITTEES[this.props.committee]
                })`}
                value={this.state.createPath.sheetName}
                style={{ fontWeight: 500 }}
                onChange={e => {
                  this.setState({
                    createPath: {
                      ...this.state.createPath,
                      sheetName: e.target.value
                    }
                  });
                }}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: "4em" }}>
              <Row type="flex" gutter={20}>
                <Col
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    marginBottom: "0.5em"
                  }}
                >
                  Include header row
                </Col>
                <Col>
                  <Switch
                    checked={this.state.createPath.includeHeader}
                    onChange={checked =>
                      this.setState({
                        createPath: {
                          ...this.state.createPath,
                          includeHeader: checked
                        }
                      })
                    }
                  />
                </Col>
              </Row>
              <div style={{ fontSize: 16, fontWeight: 400 }}>
                Whether to include an extra header row with column names.
              </div>
            </Form.Item>
            <Button
              icon={this.state.createPath.loading ? "loading" : undefined}
              style={{
                float: "right"
              }}
              size="large"
              type="primary"
              disabled={
                this.state.createPath.sheetName.length === 0 ||
                this.state.createPath.loading
              }
              onClick={() =>
                this.exportNew(
                  this.state.createPath.sheetName,
                  this.state.createPath.includeHeader
                )
              }
            >
              Export
            </Button>
          </Row>
        </Form>
        <Divider />
        <Row style={{ margin: "5em 0em 1.5em" }}>
          <Title style={{ color: "rgb(89, 89, 89" }} level={3}>
            Update an existing spreadsheet
          </Title>
        </Row>
        <Form>
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
                of the spreadsheet to update. Must be a spreadsheet you have
                edit access to.
              </div>
              <Form.Item
                validateStatus={
                  this.state.updatePath.errors.spreadsheetId !== undefined
                    ? "error"
                    : ""
                }
                help={this.state.updatePath.errors.spreadsheetId}
                style={{
                  marginBottom: "2em"
                }}
              >
                <Input
                  size="large"
                  value={this.state.updatePath.spreadsheetId}
                  placeholder="110u29tNeFE_u-Q-D53MvPd_m-sYO-1LzT2Ly_B1MRL4"
                  style={{ fontWeight: 500 }}
                  onChange={e =>
                    this.setState({
                      updatePath: {
                        ...this.state.updatePath,
                        spreadsheetId: e.target.value
                      }
                    })
                  }
                />
              </Form.Item>

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
              <Form.Item
                validateStatus={
                  this.state.updatePath.errors.location !== undefined
                    ? "error"
                    : ""
                }
                help={this.state.updatePath.errors.location}
                style={{
                  marginBottom: "2em"
                }}
              >
                <Input
                  size="large"
                  value={this.state.updatePath.location}
                  placeholder="Sheet1!A1"
                  style={{ fontWeight: 500 }}
                  onChange={e =>
                    this.setState({
                      updatePath: {
                        ...this.state.updatePath,
                        location: e.target.value
                      }
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                style={{
                  marginBottom: "4em"
                }}
              >
                <Row type="flex" gutter={20}>
                  <Col
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      marginBottom: "0.5em"
                    }}
                  >
                    Include header row
                  </Col>
                  <Col>
                    <Switch
                      checked={this.state.updatePath.includeHeader}
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
                <div style={{ fontSize: 16, fontWeight: 400 }}>
                  Whether to include an extra header row with column names.
                </div>
              </Form.Item>
              <Button
                icon={this.state.updatePath.loading ? "loading" : undefined}
                style={{
                  float: "right"
                }}
                disabled={
                  this.state.updatePath.loading ||
                  this.state.updatePath.location.length === 0 ||
                  this.state.updatePath.spreadsheetId.length === 0
                }
                onClick={() =>
                  this.exportUpdate(
                    this.state.updatePath.spreadsheetId,
                    this.state.updatePath.location,
                    this.state.updatePath.includeHeader
                  )
                }
                size="large"
                type="primary"
              >
                Export
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>
    );
  }
}

export default Export;
