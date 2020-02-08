import React from "react";
import { Button, Result, Affix } from "antd";
import { Link } from "react-router-dom";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Base from "./Base";
import GradeList from "./GradeList";
import GradeDetail from "./GradeDetail";
import DelegationList from "./DelegationList";
import DelegationDetail from "./DelegationDetail";

import { Spin } from "antd";
import Welcome from "./Welcome";

import backend from "../backend";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { backendIsReady: false };
		backend.isReadyCallbacks.push(this.backendReady)
  }

  backendReady = () => {
    this.setState({ backendIsReady: true });
  };

  render() {
    if (!this.state.backendIsReady) {
      return (
        <div style={{ width: "1em", margin: "12em auto 0em" }}>
          <Spin size="large" />
        </div>
      );
    }

    return (
			<div>
				<BrowserRouter>
					<Switch>
						<Route
							path="/welcome"
							render={() =>
								!backend.isSignedIn ? <Welcome /> : <Redirect to="/grade" />
							}
						/>
						<Route
							path="/grade/:delegation"
							render={({
								match: {
									params: { delegation }
								},
								location: { pathname }
							}) =>
								!backend.isSignedIn ? (
									<Redirect
										to={{ pathname: "/welcome", state: { from: pathname } }}
									/>
								) : (
									<Base page="grade">
										<GradeDetail delegation={delegation} />
									</Base>
								)
							}
						/>
						<Route
							path="/grade"
							render={({ location: { pathname } }) => {
								return !backend.isSignedIn ? (
									<Redirect
										to={{ pathname: "/welcome", state: { from: pathname } }}
									/>
								) : (
									<Base page="grade">
										<GradeList />
									</Base>
								);
							}}
						/>
						<Route
							path="/delegations/:delegation"
							render={({
								match: {
									params: { delegation }
								},
								location: { pathname }
							}) =>
								!backend.isSignedIn ? (
									<Redirect
										to={{ pathname: "/welcome", state: { from: pathname } }}
									/>
								) : (
									<Base page="delegations">
										<DelegationDetail delegation={delegation} />
									</Base>
								)
							}
						/>
						<Route
							path="/delegations"
							render={({ location: { pathname } }) =>
								!backend.isSignedIn ? (
									<Redirect
										to={{ pathname: "/welcome", state: { from: pathname } }}
									/>
								) : (
									<Base page="delegations">
										<DelegationList />
									</Base>
								)
							}
						/>
						<Route
							exact
							path="/"
							render={() =>
								!backend.isSignedIn ? <Welcome /> : <Redirect to="/grade" />
							}
						/>
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
