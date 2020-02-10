import React from "react";
import { Spring, animated, config } from "react-spring/renderprops";
import { withRouter } from "react-router-dom";
import { Empty, Spin } from "antd";

import { DELEGATIONS, UNMODERATED } from "../constants";

import SearchBar from "./SearchBar";
import SequenceButton from "./SequenceButton";
import backend from "../backend";

class DelegationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      delegations: DELEGATIONS[this.props.committee].slice(),
      timesSpoken: {},
      highlighted: null
    };

    for (const delegation of DELEGATIONS[this.props.committee]) {
      this[delegation] = React.createRef();
    }
  }

  componentDidMount() {
    backend.comments(this.props.committee).then(result => {
      let timesSpoken = {};

      for (const delegation of DELEGATIONS[this.props.committee]) {
        timesSpoken[delegation] = 0;
      }

      for (const row of result) {
        if (row.type !== UNMODERATED) {
          timesSpoken[row.delegation]++;
        }
      }

      this.setState({
        loading: false,
        timesSpoken: timesSpoken
      });
    });
  }

  dispatchUpdate = (delegations, emptyQuery) => {
    this.setState({
      delegations: delegations,
      highlighted: !emptyQuery && delegations.length > 0 ? delegations[0] : null
    });
  };

  handleKeyPress = e => {
    if (e.key === "Enter" && this.state.highlighted) {
      this.props.history.push(
        `/${this.props.committee}/delegations/${this.state.highlighted}`
      );
    }
  };

  render() {
    if (this.state.loading)
      return (
        <div style={{ width: "1em", margin: "auto" }}>
          <Spin size="large" />
        </div>
      );

    return (
      <div onKeyPress={this.handleKeyPress}>
        <SearchBar
          values={DELEGATIONS[this.props.committee]}
          dispatchUpdate={this.dispatchUpdate}
          placeHolder="Type in a delegation to get more details"
        />
        <div
          style={{
            margin: "0 auto",
            width: "80%"
          }}
        >
          {!this.state.delegations.length ? (
            <Empty description="what delegation is that" />
          ) : (
            <Spring
              native
              config={config.stiff}
              from={{ time: 0 }}
              to={{ time: 1 }}
            >
              {props =>
                this.state.delegations.map((name, i) => (
                  <animated.div
                    style={{
                      transform: props.time.interpolate(
                        time => `translateY(${(50 + 25 * i) * (1 - time)}px)`
                      ),
                      opacity: props.time
                    }}
                  >
                    <SequenceButton
                      href={`/${this.props.committee}/delegations/${name}`}
                      showTimesSpoken={true}
                      highlighted={i === 0 && this.state.highlighted != null}
                      timesSpoken={this.state.timesSpoken[name]}
                      ref={this[name]}
                      key={i}
                    >
                      {name}
                    </SequenceButton>
                  </animated.div>
                ))
              }
            </Spring>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(DelegationList);
