import React from "react";
import { withRouter } from "react-router-dom";
import { Empty, Spin } from "antd";

import { DELEGATIONS, UNMODERATED } from "../constants";

import SearchBar from "./SearchBar";
import DelegationButton from "./DelegationButton";
import backend from "../backend";

class GradeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      delegations: DELEGATIONS.slice(),
      timesSpoken: {},
      highlighted: null
    };

    for (var i = 0; i < DELEGATIONS.length; i++) {
      this[DELEGATIONS[i]] = React.createRef();
    }
  }

  componentDidMount() {
    backend.comments().then(result => {
      let timesSpoken = {};

      for (const delegationName of DELEGATIONS) {
        timesSpoken[delegationName] = 0;
      }

      for (const row of result) {
        if (row.type !== UNMODERATED) {
          timesSpoken[row.delegation]++;
        }
      }

      this.setState({
        timesSpoken: timesSpoken,
        loading: false
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
      this.props.history.push(`/grade/${this.state.highlighted}`);
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
          values={DELEGATIONS}
          dispatchUpdate={this.dispatchUpdate}
          dispatchEnter={this.dispatchEnter}
          placeHolder="Type in a delegation to grade"
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
            this.state.delegations.map((name, i) => (
              <DelegationButton
                highlighted={i === 0 && this.state.highlighted != null}
                timesSpoken={this.state.timesSpoken[name]}
                type="grade"
                ref={this[name]}
                key={i}
              >
                {name}
              </DelegationButton>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(GradeList);
