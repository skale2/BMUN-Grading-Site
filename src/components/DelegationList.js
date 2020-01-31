import React from 'react';
import { withRouter } from 'react-router-dom'
import { Empty } from 'antd';

import { DELEGATIONS } from '../constants';

import SearchBar from './SearchBar';
import DelegationButton from './DelegationButton';

class DelegationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      delegations: DELEGATIONS.slice(),
      highlighted: null,
    };
    
    for (var i = 0; i < DELEGATIONS.length; i++) {
      this[DELEGATIONS[i]] = React.createRef();
    }
  }

  dispatchUpdate = (delegations, emptyQuery) => {
    this.setState({
      delegations: delegations,
      highlighted: !emptyQuery && delegations.length > 0 ? delegations[0] : null
    });
 }

  handleKeyPress = e => {
    if (e.key === "Enter" && this.state.highlighted) {
      this.props.history.push(`/delegations/${this.state.highlighted}`);
    }
  }

  render () {
    return(
      <div onKeyPress={this.handleKeyPress}>
        <SearchBar 
          values={DELEGATIONS}
          dispatchUpdate={this.dispatchUpdate}
          dispatchEnter={this.dispatchEnter}
          placeHolder="Type in a delegation to get more details"
        />
        <div style={{
          margin: "0 auto",
          width: "80%"
        }}>
          {!this.state.delegations.length ? 
            <Empty description="what delegation is that"/> : 
            this.state.delegations.map((name, i) => 
              <DelegationButton 
                highlighted={i === 0 && this.state.highlighted != null} 
                type="delegations"
                ref={this[name]}
                key={i}
              >
                {name}
              </DelegationButton>
            )
          }
        </div>
      </div>
    );
  }
}

export default withRouter(DelegationList);