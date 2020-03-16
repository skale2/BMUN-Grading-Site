import React from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Button, Icon } from "antd";

class SequenceButton extends React.Component {
  render() {
    return (
      <Button
        onClick={() => this.props.history.push(this.props.href)}
        style={{
          width: "100%",
          height: "4.5em",
          margin: "10px auto",
          padding: "0em 2em",
          fontSize: "large",
          transition: "all 0.3s ease",
          boxShadow: this.props.highlighted
            ? "0px 0px 20px 3px rgba(24,144,255,0.40)"
            : null
        }}
      >
        <Row type="flex" justify="space-between" align="space-between">
          <Col style={{ fontWeight: "600" }}>{this.props.children}</Col>
          <Col>
            <Row type="flex" gutter={20} justify="end">
              {this.props.highlighted ? (
                <Col>
                  <Icon type="enter" style={{ marginRight: "5px" }} />
                  <div style={{ fontSize: "12px", fontWeight: 700 }}>ENTER</div>
                </Col>
              ) : null}
              {this.props.timesSpoken !== undefined ? (
                <Col style={{ paddingTop: 2 }}>
                  <div style={{ fontSize: "16px", fontWeight: 400 }}>
                    {this.props.timesSpoken}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700 }}>
                    speeches
                  </div>
                </Col>
              ) : null}
            </Row>
          </Col>
        </Row>
      </Button>
    );
  }
}
export default withRouter(SequenceButton);
