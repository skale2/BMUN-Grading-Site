import React from "react";
import { Button, Typography, notification } from "antd";

const { Title } = Typography;

const NOTIF_KEY = "timer";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  toggleTimer = () => {
		this.setState({ open: !this.state.open });

    if (!this.state.open)
      notification.open({
        key: NOTIF_KEY,
        duration: 0,
        placement: "bottomLeft",
				message: (
					<div>
						<Title level={2}>10:15</Title>
					</div>
				)
      });
    else
      notification.close({ key: NOTIF_KEY });
  };

  render() {
    return (
      <Button
        type="primary"
        shape="circle"
        icon="clock-circle"
        onClick={this.toggleTimer}
				onClose={this.toggleTimer}
      />
    );
  }
}

export default Timer;
