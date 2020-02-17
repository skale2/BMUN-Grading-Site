import React from "react";

import { Layout, Menu, Icon, Row, Col, Tooltip } from "antd";
import { Link } from "react-router-dom";

import { COMMITTEES } from "../constants";

const { Content } = Layout;

const Base = props => {
  return (
    <Layout style={{ margin: "2% 7%", background: "white" }}>
      <Row
        type="flex"
        style={{ fontWeight: 700, width: "70%", margin: "1% auto 0%" }}
      >
        <Link to="/welcome">
          <Tooltip placement="bottom" title="← Select another committee">
            {COMMITTEES[props.committee].toUpperCase()}
          </Tooltip>
        </Link>
      </Row>
      <Row
        type="flex"
        justify="space-between"
        style={{ width: "70%", margin: "0% auto" }}
      >
        <Col
          span={12}
          style={{
            fontSize: "35px",
            fontWeight: 600
          }}
        >
          {props.page.charAt(0).toUpperCase() + props.page.slice(1)}
        </Col>
        <Col>
          <Menu mode="horizontal" selectedKeys={[props.page]}>
            <Menu.Item key="grade">
              <Link to={`/${props.committee}/grade`}>
                <Icon type="edit" />
                Grade
              </Link>
            </Menu.Item>
            <Menu.Item key="delegations">
              <Link to={`/${props.committee}/delegations`}>
                <Icon type="user" />
                Delegations
              </Link>
            </Menu.Item>
            <Menu.Item key="export">
              <Link to={`/${props.committee}/export`}>
                <Icon type="export" />
                Export
              </Link>
            </Menu.Item>
          </Menu>
        </Col>
      </Row>
      <Content
        style={{ background: "white", width: "70%", margin: "3em auto" }}
      >
        {props.children}
      </Content>
    </Layout>
  );
};

export default Base;
