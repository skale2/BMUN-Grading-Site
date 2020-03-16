import React from "react";
import { Spring, config } from "react-spring/renderprops";
import { withRouter } from "react-router-dom";
import { Row, Button } from "antd";
import backend from "../backend";
import CommitteeSelect from "./CommitteeSelect";
import logo from "../logo.png";

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: backend.isSignedIn ? 1 : 0,
      backendIsReady: backend.isReady
    };

    backend.isReadyCallBacks.push(() =>
      this.setState({ backendIsReady: true })
    );

    backend.isSignedInCallBacks.push(() => this.setState({ step: 1 }));
  }

  signIn = () => {
    backend.signIn().then(() => {
      if (this.props.location.state !== undefined) {
        this.props.history.push(this.props.location.state.from);
      } else {
        this.setState({ step: 1 });
      }
    });
  };

  gotoCommittee = committee => {
    this.props.history.push(
      `/${backend.committeeByFullName(committee)}/grade/`
    );
  };

  render() {
    return (
      <Spring
        config={config.stiff}
        from={{ time: 0 }}
        to={{ time: 1 * this.state.step }}
      >
        {props => (
          <div
            style={{
              paddingTop: `${12 - 8 * props.time}%`,
              fontSize: "70px",
              fontWeight: 600
            }}
          >
            <Row type="flex" justify="center">
              <span role="img" aria-label="UN">
                <img
                  src={logo}
                  alt="BMUN logo"
                  height={250 - 50 * props.time}
                  style={{ opacity: 0.5 }}
                />
              </span>
            </Row>
            {props.time < 0.6 ? (
              <div
                style={{
                  marginTop: "1em",
                  opacity: (1 - props.time) * (1 - this.state.step)
                }}
              >
                <Row type="flex" justify="center">
                  <Button
                    icon="google"
                    type="primary"
                    size={"large"}
                    disabled={!this.state.backendIsReady}
                    onClick={this.signIn}
                  >
                    Sign in with BMUN
                  </Button>
                </Row>
              </div>
            ) : null}
            {props.time > 0.5 ? (
              <div style={{ opacity: props.time }}>
                <Row type="flex" justify="center">
                  <CommitteeSelect
                    style={{ marginTop: "2em" }}
                    gotoCommittee={this.gotoCommittee}
                  />
                </Row>
              </div>
            ) : null}
          </div>
        )}
      </Spring>
    );
  }
}

export default withRouter(Welcome);
