import React from "react";
import { withRouter } from "react-router-dom";
import { Empty } from "antd";
import SearchBar from "./SearchBar";
import SequenceButton from "./SequenceButton";

import backend from "../backend";

class CommitteeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      committees: Object.values(backend.committees).map(
        committee => committee.name
      ),
      highlighted: null
    };

    for (var i = 0; i < Object.values(backend.committees).length; i++) {
      this[Object.keys(backend.committees)[i]] = React.createRef();
    }
  }

  dispatchUpdate = (committees, emptyQuery) => {
    this.setState({
      committees: committees,
      highlighted: !emptyQuery && committees.length > 0 ? committees[0] : null
    });
  };

  handleKeyPress = e => {
    if (e.key === "Enter" && this.state.highlighted) {
      console.log(this.state.highlighted);
      this.props.history.push(
        `/${backend.committeeByFullName(this.state.highlighted)}/grade`
      );
    }
  };

  render() {
    return (
      <div
        onKeyPress={this.handleKeyPress}
        style={{ ...this.props.style, fontSize: 20 }}
      >
        <SearchBar
          style={{ width: 600 }}
          values={Object.values(backend.committees).map(
            committee => committee.name
          )}
          dispatchUpdate={this.dispatchUpdate}
          placeHolder="What committee are you on?"
        />
        <div
          style={{
            margin: "0 auto",
            width: "80%"
          }}
        >
          {!this.state.committees.length ? (
            <Empty description="what committee is that" />
          ) : (
            this.state.committees.map((name, i) => (
              <SequenceButton
                href={`/${backend.committeeByFullName(name)}/grade`}
                highlighted={i === 0 && this.state.highlighted !== null}
                type="grade"
                ref={this[name]}
                key={i}
              >
                {name}
              </SequenceButton>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(CommitteeSelect);
