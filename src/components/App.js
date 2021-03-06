import React from "react";
import { Button, Result, Spin } from "antd";
import { Link } from "react-router-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Base from "./Base";
import GradeList from "./GradeList";
import GradeDetail from "./GradeDetail";
import DelegationList from "./DelegationList";
import DelegationDetail from "./DelegationDetail";
import Export from "./Export";
import Welcome from "./Welcome";
import { SORTS } from "../constants";
import backend from "../backend";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backendIsReady: false,
      backendIsSignedIn: false,
      sortDelegationsBy: SORTS.a_z,
      sortCommentsBy: SORTS.latest_first
    };

    backend.isReadyCallBacks.push(() =>
      this.setState({
        backendIsReady: true
      })
    );

    backend.isSignedInCallBacks.push(() =>
      /* Set both, because backend must also be ready if we've signed in. */
      this.setState({
        backendIsReady: true,
        backendIsSignedIn: true
      })
    );
  }

  render() {
    if (!this.state.backendIsReady)
      return (
        <div style={{ width: "1em", margin: "25% auto 0%" }}>
          <Spin size="large" />
        </div>
      );

    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route path="/welcome" render={() => <Welcome />} />
            <Route
              path="/:committee/grade/:delegation"
              render={({
                match: {
                  params: { committee, delegation }
                },
                location: { pathname }
              }) => {
                if (!this.state.backendIsSignedIn)
                  return (
                    <Redirect
                      to={{ pathname: "/welcome", state: { from: pathname } }}
                    />
                  );

                if (!Object.keys(backend.committees).includes(committee))
                  return <Redirect to="/not_found" />;

                backend.setCommittee(committee);

                return (
                  <Base page="grade" committee={committee}>
                    <GradeDetail
                      committee={committee}
                      delegation={delegation}
                    />
                  </Base>
                );
              }}
            />
            <Route
              path="/:committee/grade"
              render={({
                match: {
                  params: { committee }
                },
                location: { pathname }
              }) => {
                if (!this.state.backendIsSignedIn) {
                  return (
                    <Redirect
                      to={{ pathname: "/welcome", state: { from: pathname } }}
                    />
                  );
                }

                if (!Object.keys(backend.committees).includes(committee))
                  return <Redirect to="/not_found" />;

                backend.setCommittee(committee);

                return (
                  <Base page="grade" committee={committee}>
                    <GradeList
                      committee={committee}
                      sortDelegationsBy={this.state.sortDelegationsBy}
                      changeSortDelegationsBy={by =>
                        this.setState({ sortDelegationsBy: by })
                      }
                    />
                  </Base>
                );
              }}
            />
            <Route
              path="/:committee/delegations/:delegation"
              render={({
                match: {
                  params: { committee, delegation }
                },
                location: { pathname }
              }) => {
                if (!this.state.backendIsSignedIn)
                  return (
                    <Redirect
                      to={{ pathname: "/welcome", state: { from: pathname } }}
                    />
                  );

                if (!Object.keys(backend.committees).includes(committee))
                  return <Redirect to="/not_found" />;

                backend.setCommittee(committee);

                return (
                  <Base page="delegations" committee={committee}>
                    <DelegationDetail
                      committee={committee}
                      delegation={delegation}
                      sortCommentsBy={this.state.sortCommentsBy}
                      changeSortCommentsBy={by =>
                        this.setState({ sortCommentsBy: by })
                      }
                    />
                  </Base>
                );
              }}
            />
            <Route
              path="/:committee/delegations"
              render={({
                match: {
                  params: { committee }
                },
                location: { pathname }
              }) => {
                if (!this.state.backendIsSignedIn)
                  return (
                    <Redirect
                      to={{ pathname: "/welcome", state: { from: pathname } }}
                    />
                  );

                if (!Object.keys(backend.committees).includes(committee))
                  return <Redirect to="/not_found" />;

                backend.setCommittee(committee);

                return (
                  <Base page="delegations" committee={committee}>
                    <DelegationList
                      committee={committee}
                      sortDelegationsBy={this.state.sortDelegationsBy}
                      changeSortDelegationsBy={by =>
                        this.setState({ sortDelegationsBy: by })
                      }
                    />
                  </Base>
                );
              }}
            />
            <Route
              path="/:committee/export"
              render={({
                match: {
                  params: { committee }
                },
                location: { pathname }
              }) => {
                if (!this.state.backendIsSignedIn)
                  return (
                    <Redirect
                      to={{ pathname: "/welcome", state: { from: pathname } }}
                    />
                  );

                if (!Object.keys(backend.committees).includes(committee))
                  return <Redirect to="/not_found" />;

                backend.setCommittee(committee);

                return (
                  <Base page="export" committee={committee}>
                    <Export committee={committee} />
                  </Base>
                );
              }}
            />
            <Route exact path="/" render={() => <Redirect to="/welcome" />} />
            <Route
              path="/"
              render={() => (
                <Result
                  status="404"
                  title="404"
                  subTitle="🔫 you shouldn't be here 🔫"
                  extra={
                    <Link to="/">
                      <Button type="primary">
                        yo imma leave right mfing now
                      </Button>
                    </Link>
                  }
                />
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
