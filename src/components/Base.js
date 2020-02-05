import React from "react";

import { Layout, Menu, Icon, Row, Col, Affix } from "antd";
import { Link } from "react-router-dom";
const { Content } = Layout;

const Base = props => {
  return (
    <div>
      <Layout style={{ margin: "2% 7%", background: "white" }}>
        <Row
          type="flex"
          justify="space-between"
          style={{ width: "70%", margin: "3em auto 0em" }}
        >
          <Col
            span={8}
            style={{
              fontSize: "35px",
              fontWeight: 600
            }}
          >
            {props.page.charAt(0).toUpperCase() + props.page.slice(1)}
          </Col>
          <Col span={7}>
            <Menu mode="horizontal" selectedKeys={[props.page]}>
              <Menu.Item key="grade">
                <Link to="/grade">
                  <Icon type="edit" />
                  Grade
                </Link>
              </Menu.Item>
              <Menu.Item key="delegations">
                <Link to="/delegations">
                  <Icon type="user" />
                  Delegations
                </Link>
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
        <Content style={{ background: "white", width: "70%", margin: "3em auto" }}>
          {props.children}
        </Content>
      </Layout>
    </div>
  );
};

export default Base;
