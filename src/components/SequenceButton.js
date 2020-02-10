import React from "react";
import { Row, Col, Icon, Button } from "antd";
import { Link } from "react-router-dom";

class SequenceButton extends React.Component {
  render() {
    return (
      <Row>
        <Link to={this.props.href}>
          <Button
            style={{
              width: "100%",
              height: "4.5em",
              margin: "0.4em auto",
              padding: "0em 2em",
              fontSize: "large",
              transition: "all 0.3s ease",
              boxShadow: this.props.highlighted
                ? "0px 0px 20px 3px rgba(24,144,255,0.40)"
                : null
            }}
          >
            <div
              style={{
                float: "left",
                top: "33%",
                position: "absolute",
                fontWeight: "600"
              }}
            >
              {this.props.children}
            </div>
            <div style={{ float: "right" }}>
              <Row type="flex" gutter={20}>
                {this.props.highlighted ? (
                  <Col>
                    <Icon type="enter" style={{ marginRight: "5px" }} />
                    <div style={{ fontSize: "12px", fontWeight: 700 }}>
                      ENTER
                    </div>
                  </Col>
                ) : null}
                {this.props.showTimesSpoken ? (
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
            </div>
          </Button>
        </Link>
      </Row>
    );
  }
}
export default SequenceButton;
