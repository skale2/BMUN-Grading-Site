import React from 'react'
import { withRouter } from "react-router-dom";
import { Row, Col, Button,  } from 'antd';
import backend from '../backend';

class Welcome extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			clientLoaded: false
		};
		backend.backendLoadedListeners.push(this.onBackendLoaded);
	}

	onBackendLoaded = () => {
		this.setState({ clientLoaded: true });
	}

	signIn = () => {
		backend.signIn().then(
			() => {
				if (this.props.location.state.from !== undefined)
					this.props.history.push(this.props.location.state.from);
				else 
					this.props.history.push("/welcome")
			}
		);
	}

	render () {
    return (
			<div style={{paddingTop: "15%"}}>
				<div style={{
					fontSize: "70px",
					fontWeight: 600,
				}}>
					<Row type="flex" justify="space-around">
						<Col span={10}/>
						<Col span={3}>	Hello	</Col> 
						<Col span={1}> 
							<span style={{color: "black"}} role="img" aria-label="UN">🇺🇳</span>
						</Col>
						<Col span={10}/>
					</Row>
					<Row type="flex" justify="space-around">
						<div>
							<Button
								icon={!this.state.clientLoaded ? "loading" : "google"}
								type="primary" 
								size={'large'}
								disabled={!this.state.clientLoaded}
								onClick={this.signIn}
							>
								Sign in with BMUN
							</Button>
						</div>
					</Row>
				</div>
			</div>
		);
	}
}

export default withRouter(Welcome);