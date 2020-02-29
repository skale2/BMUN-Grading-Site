import React from "react";

import { Layout, Menu, Icon, Row, Col, Tooltip, Avatar } from "antd";
import { Link } from "react-router-dom";

import backend from "../backend";

const { Content } = Layout;

const Base = props => {
  return (
    <Layout style={{ maxWidth: 1200, margin: "2% auto", background: "white" }}>
      <Row
        type="flex"
        style={{ fontWeight: 700, width: "70%", margin: "1% auto 0%" }}
      >
        <Col>
          <Link to="/welcome/">
            <Tooltip placement="bottom" title="← Select another committee">
              {backend.committees[props.committee].name.toUpperCase()}
            </Tooltip>
          </Link>
        </Col>
        <Col>
          <div style={{ marginLeft: 10 }}>
            <Link
              to={`/${props.committee}/export/`}
              style={{ color: "rgba(0, 0, 0, 0.65)" }}
            >
              <Tooltip
                placement="bottom"
                title="Export committee to spreadsheet"
              >
                <Icon type="export" />
              </Tooltip>
            </Link>
          </div>
        </Col>
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
          <Link
            to={`/${props.committee}/${props.page}`}
            style={{ color: "rgba(0, 0, 0, 0.65)" }}
          >
            {props.page.charAt(0).toUpperCase() + props.page.slice(1)}
          </Link>
        </Col>
        <Col>
          <Row type="flex" align="middle" gutter={[30, 0]}>
            <Col>
              <Menu mode="horizontal" selectedKeys={[props.page]}>
                <Menu.Item key="grade">
                  <Link to={`/${props.committee}/grade/`}>
                    <Icon type="edit" />
                    Grade
                  </Link>
                </Menu.Item>
                <Menu.Item key="delegations">
                  <Link to={`/${props.committee}/delegations/`}>
                    <Icon type="team" />
                    Delegations
                  </Link>
                </Menu.Item>
              </Menu>
            </Col>
            <Col>
              <Tooltip
                placement="bottom"
                title={
                  backend.user.name === "Soham Kale"
                    ? "An absolute legend"
                    : backend.user.name
                }
              >
                <Avatar src={backend.user.avatarUrl} />
              </Tooltip>
            </Col>
          </Row>
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
