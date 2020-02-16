import React from "react";
import { Spring, animated, config } from "react-spring/renderprops";
import { withRouter } from "react-router-dom";
import { Empty, Spin } from "antd";

import { DELEGATIONS, UNMODERATED, SORTS } from "../constants";

import SearchBar from "./SearchBar";
import SequenceButton from "./SequenceButton";
import backend from "../backend";

class GradeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      delegations: DELEGATIONS[this.props.committee].slice(),
      timesSpoken: {},
      highlighted: null
    };

    for (var i = 0; i < DELEGATIONS[this.props.committee].length; i++) {
      this[DELEGATIONS[this.props.committee][i]] = React.createRef();
    }
  }

  componentDidMount() {
    backend.comments(this.props.committee).then(result => {
      let timesSpoken = {};

      for (const delegationName of DELEGATIONS[this.props.committee]) {
        timesSpoken[delegationName] = 0;
      }

      for (const row of result) {
        if (row.type !== UNMODERATED) {
          timesSpoken[row.delegation]++;
        }
      }

      this.setState(
        {
          timesSpoken: timesSpoken,
          loading: false
        },
        () =>
          this.setState({
            delegations: this.state.delegations.sort(
              this.sort(this.props.sortDelegationsBy)
            )
          })
      );
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
        `/${this.props.committee}/grade/${this.state.highlighted}`
      );
    }
  };

  sort = by => {
    this.props.changeSortDelegationsBy(by);

    switch (by) {
      case SORTS.a_z:
        return (del1, del2) => del1.localeCompare(del2);
      case SORTS.z_a:
        return (del1, del2) => -del1.localeCompare(del2);
      case SORTS.spoken_most:
        return (del1, del2) =>
          this.state.timesSpoken[del2] - this.state.timesSpoken[del1];
      case SORTS.spoken_least:
        return (del1, del2) =>
          this.state.timesSpoken[del1] - this.state.timesSpoken[del2];
      default:
        return (del1, del2) => -1;
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
          placeHolder="Type in a delegation to grade"
          defaultSort={this.props.sortDelegationsBy}
          sorts={[SORTS.a_z, SORTS.z_a, SORTS.spoken_most, SORTS.spoken_least]}
          getSort={this.sort}
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
                    key={i}
                  >
                    <SequenceButton
                      href={`/${this.props.committee}/grade/${name}`}
                      highlighted={i === 0 && this.state.highlighted != null}
                      timesSpoken={this.state.timesSpoken[name]}
                      ref={this[name]}
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

export default withRouter(GradeList);
