import React from "react";
import { Spring, animated, config } from "react-spring/renderprops";
import { withRouter } from "react-router-dom";
import { Empty, Spin } from "antd";

import { SORTS, SPEECH_TYPES } from "../constants";

import SearchBar from "./SearchBar";
import SequenceButton from "./SequenceButton";
import backend from "../backend";

class DelegationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      delegations: backend.committee.delegations.slice(),
      timesSpoken: {},
      highlighted: null
    };

    for (const delegation of backend.committee.delegations) {
      this[delegation] = React.createRef();
    }
  }

  componentDidMount() {
    backend.comments().then(result => {
      let timesSpoken = {};

      for (const delegation of backend.committee.delegations) {
        timesSpoken[delegation] = 0;
      }

      for (const row of result) {
        if (row.type !== SPEECH_TYPES.unmoderated) {
          timesSpoken[row.delegation]++;
        }
      }

      this.setState({
        timesSpoken: timesSpoken,
        loading: false,
        delegations: backend.committee.delegations.sort(
          this.sort(this.props.sortDelegationsBy)
        )
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
        `/${this.props.committee}/delegations/${this.state.highlighted}/`
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
          values={backend.committee.delegations}
          dispatchUpdate={this.dispatchUpdate}
          placeHolder="Type in a delegation to get more details"
          sorts={{
            default: this.props.sortDelegationsBy,
            values: [
              SORTS.a_z,
              SORTS.z_a,
              SORTS.spoken_most,
              SORTS.spoken_least
            ],
            getHandler: this.sort
          }}
        />
        <div
          style={{
            margin: "0 auto",
            width: "75%"
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
                this.state.delegations.map((name, i) =>
                  /* To only animate the buttons on screen. */
                  i < window.innerHeight / 100 ? (
                    <animated.div
                      key={i}
                      style={{
                        transform: props.time.interpolate(
                          time => `translateY(${(10 + 25 * i) * (1 - time)}px)`
                        ),
                        opacity: props.time
                      }}
                    >
                      <SequenceButton
                        href={`/${this.props.committee}/delegations/${name}/`}
                        highlighted={i === 0 && this.state.highlighted != null}
                        timesSpoken={this.state.timesSpoken[name]}
                      >
                        <div style={{ marginTop: "8px" }}>{name}</div>
                      </SequenceButton>
                    </animated.div>
                  ) : (
                    <SequenceButton
                      href={`/${this.props.committee}/delegations/${name}/`}
                      highlighted={i === 0 && this.state.highlighted != null}
                      timesSpoken={this.state.timesSpoken[name]}
                      key={i}
                    >
                      <div style={{ marginTop: "8px" }}>{name}</div>
                    </SequenceButton>
                  )
                )
              }
            </Spring>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(DelegationList);
