import React from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  Statistic,
  Divider,
  Card,
  Tag,
  Empty,
  Spin,
  Popconfirm,
  message
} from "antd";
import { Link } from "react-router-dom";
import {
  SPEAKERS_LIST,
  MODERATED,
  UNMODERATED,
  FORMAL,
  COMMENT,
  CRISIS
} from "../constants";

import backend from "../backend";

class DelegationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      score: 0,
      timesSpoken: 0,
      spoken: {
        [SPEAKERS_LIST]: 0,
        [MODERATED]: 0,
        [UNMODERATED]: 0,
        [FORMAL]: 0,
        [COMMENT]: 0,
        [CRISIS]: 0
      },
      tags: {},
      comments: [],
      deletingComment: undefined
    };
  }

  componentDidMount() {
    backend
      .status(this.props.committee, this.props.delegation)
      .then(this.setDelegationInfo);
  }

  setDelegationInfo = responses => {
    let score = 0;
    let timesSpoken = 0;
    let spoken = {
      [SPEAKERS_LIST]: 0,
      [MODERATED]: 0,
      [UNMODERATED]: 0,
      [FORMAL]: 0,
      [COMMENT]: 0,
      [CRISIS]: 0
    };
    let tags = {};

    responses.forEach(response => {
      score += response.score;
      if (response.type !== UNMODERATED) {
        timesSpoken++;
      }
      spoken[response.type] += 1;

      for (const tag in response.tags) {
        if (!(tag in tags)) {
          tags[tag] = 0;
        } else {
          tags[tag]++;
        }
      }
    });

    if (score === 0) {
      score = "--";
    } else {
      score /= responses.length;
      score = Math.round((score + Number.EPSILON) * 10) / 10;
    }

    this.setState({
      loading: false,
      score: score,
      timesSpoken: timesSpoken,
      spoken: spoken,
      tags: tags,
      comments: responses
    });
  };

  deleteComment = row => {
    backend
      .deleteComment(this.props.committee, row)
      .then(() => backend.status(this.props.delegation))
      .then(this.setDelegationInfo);
    this.setState({ deletingComment: undefined });
    message.success(`Comment deleted`);
  };

  commentRender = (comment, i) => (
    <div style={{ padding: "1em 1em 1em 1em" }} key={i}>
      <Card
        title={
          <Row type="flex" align="middle" justify="space-between">
            <Col span={8}>
              <Statistic
                title={comment.type}
                value={comment.score}
                suffix="/10"
              />
            </Col>
            <Col span={5}>
              <Row type="flex" align="middle" justify="space-between">
                <Col style={{ fontSize: "20px", fontWeight: "600" }}>
                  <Link
                    to={{
                      pathname: `/${this.props.committee}/grade/${this.props.delegation}`,
                      state: { edit: comment }
                    }}
                  >
                    <Button icon="edit" shape="circle" />
                  </Link>
                </Col>
                <Col style={{ fontSize: "20px", fontWeight: "600" }}>
                  <Popconfirm
                    title="Are you sure you want to delete this comment?"
                    onConfirm={() => this.deleteComment(comment.row)}
                    onCancel={() => null}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon="delete" shape="circle" type="danger" />
                  </Popconfirm>
                </Col>
              </Row>
            </Col>
          </Row>
        }
      >
        <div style={{ color: comment.text.length > 0 ? "#363636" : "#a5a5a5" }}>
          {comment.text.length > 0 ? comment.text : "No comment"}
        </div>
        {comment.tags.length > 0 ? (
          <div style={{ marginTop: "2em" }}>
            {comment.tags.map((tag, j) => (
              <Tag style={{ margin: "5px 5px 5px 0px" }} key={j}> {tag} </Tag>
            ))}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            color: "#a5a5a5",
            fontStyle: "italic",
            marginTop: "1em"
          }}
        >
          {comment.date.toLocaleDateString("en-US")}
        </div>
      </Card>
    </div>
  );

  render() {
    if (this.state.loading)
      return (
        <div style={{ width: "1em", margin: "auto" }}>
          <Spin size="large" />
        </div>
      );

    return (
      <div>
        <Row type="flex" justify="space-between">
          <Col style={{ fontSize: "40px", fontWeight: "700" }}>
            {this.props.delegation}
          </Col>
          <Col style={{ marginTop: "10px" }}>
            <Link
              to={`/${this.props.committee}/grade/${this.props.delegation}`}
            >
              <Button size="large" type="primary">
                Grade
              </Button>
            </Link>
          </Col>
        </Row>
        <Divider />
        <Row
          type="flex"
          align="bottom"
          style={{ width: "30em", margin: "3em auto 3em 0" }}
        >
          <Col span={12} style={{ fontSize: "30px", fontWeight: 600 }}>
            Score
          </Col>
          <Col
            span={1.9 * this.state.score.toString().length}
            style={{ float: "right", fontSize: "50px", marginBottom: "-12px" }}
          >
            {this.state.score}
          </Col>
          <Col span={4} style={{ float: "left", fontSize: "25px" }}>
            /10
          </Col>
        </Row>
        <Row
          type="flex"
          align="bottom"
          style={{ width: "30em", marginTop: "5em" }}
        >
          <Col span={12} style={{ fontSize: "25px", fontWeight: 600 }}>
            Times Spoken
          </Col>
          <Col
            span={8}
            style={{ float: "right", fontSize: "40px", marginBottom: "-7px" }}
          >
            {this.state.timesSpoken}
          </Col>
        </Row>
        <Row type="flex" justify="space-around" style={{ marginTop: "3em" }}>
          <Col>
            <Statistic
              title="Speaker's List"
              value={this.state.spoken[SPEAKERS_LIST]}
              suffix="times"
            />
          </Col>
          <Col>
            <Statistic
              title="Moderated"
              value={this.state.spoken[MODERATED]}
              suffix="times"
            />
          </Col>
          <Col>
            <Statistic
              title="Unmoderated"
              value={this.state.spoken[UNMODERATED]}
              suffix="times"
            />
          </Col>
          <Col>
            <Statistic
              title="Formal"
              value={this.state.spoken[FORMAL]}
              suffix="times"
            />
          </Col>
          <Col>
            <Statistic
              title="Comment"
              value={this.state.spoken[COMMENT]}
              suffix="times"
            />
          </Col>
          <Col>
            <Statistic
              title="Crisis"
              value={this.state.spoken[CRISIS]}
              suffix="times"
            />
          </Col>
        </Row>
        <Row
          span={12}
          style={{ fontSize: "25px", fontWeight: 600, marginTop: "4em" }}
        >
          Comments
        </Row>
        <Row style={{ marginTop: "2em" }}>
          {this.state.comments.length === 0 ? (
            <Empty description="No comments yet!" />
          ) : (
            <div>
              <Col span={12}>
                {this.state.comments
                  .filter((_, i) => i % 2 === 0)
                  .map((comment, i) => this.commentRender(comment, i))}
              </Col>
              <Col span={12}>
                {this.state.comments
                  .filter((_, i) => i % 2 === 1)
                  .map((comment, i) => this.commentRender(comment, i))}
              </Col>
            </div>
          )}
        </Row>
      </div>
    );
  }
}

export default withRouter(DelegationDetail);
