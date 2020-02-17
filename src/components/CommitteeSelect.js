import React from "react";
import { withRouter } from "react-router-dom";
import { Empty } from "antd";
import SearchBar from "./SearchBar";
import SequenceButton from "./SequenceButton";
import { COMMITTEES, COMMITTEES_REVERSE } from "../constants";

class CommitteeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      committees: Object.values(COMMITTEES),
      highlighted: null
    };

    for (var i = 0; i < Object.values(COMMITTEES).length; i++) {
      this[Object.keys(COMMITTEES)[i]] = React.createRef();
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
      this.props.gotoCommittee(this.state.highlighted);
    }
  };

  render() {
    return (
      <div onKeyPress={this.handleKeyPress}>
        <SearchBar
          style={{ width: 600 }}
          values={Object.values(COMMITTEES)}
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
                href={`/${COMMITTEES_REVERSE[name]}/grade`}
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
