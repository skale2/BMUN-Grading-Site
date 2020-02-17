import React from "react";
import { withRouter, Link } from "react-router-dom";
import ScrollableAnchor from "react-scrollable-anchor";
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
  Select,
  message
} from "antd";
import {
  SPEAKERS_LIST,
  MODERATED,
  UNMODERATED,
  FORMAL,
  COMMENT,
  SPEECH_TYPES,
  CRISIS,
  SORTS
} from "../constants";

import backend from "../backend";

const { Option } = Select;

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
      displayedComments: [],
      filterCommentsBy: undefined,
      sortCommentsBy: this.props.sortCommentsBy,
      deletingComment: undefined
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    backend.status(this.props.delegation).then(this.setDelegationInfo);
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

    this.setState(
      {
        loading: false,
        score: score,
        timesSpoken: timesSpoken,
        spoken: spoken,
        tags: tags,
        comments: responses
      },
      this.filter
    );
  };

  deleteComment = row => {
    backend
      .deleteComment(row)
      .then(() => backend.status(this.props.delegation))
      .then(this.setDelegationInfo)
      .then(() => this.setState({ deletingComment: undefined }))
      .then(() => message.success(`Comment deleted`));
  };

  filter = () => {
    let displayedComments = this.state.comments.slice();

    if (this.state.filterCommentsBy !== undefined)
      displayedComments = displayedComments.filter(
        comment => comment.type === this.state.filterCommentsBy
      );

    this.setState(
      {
        displayedComments: displayedComments
      },
      this.sort
    );
  };

  sort = () => {
    let by = this.state.sortCommentsBy;
    let displayedComments = this.state.displayedComments.slice();

    switch (by) {
      case SORTS.latest_first:
        displayedComments.sort((com1, com2) => com2.date - com1.date);
        break;
      case SORTS.earliest_first:
        displayedComments.sort((com1, com2) => com1.date - com2.date);
        break;
      case SORTS.highest_score:
        displayedComments.sort((com1, com2) => com2.score - com1.score);
        break;
      case SORTS.lowest_score:
        displayedComments.sort((com1, com2) => com1.score - com2.score);
        break;
      default:
    }

    this.setState({
      displayedComments: displayedComments
    });
  };

  commentRender = (comment, i) => (
    <ScrollableAnchor id={comment.date.getTime()} key={i}>
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
          <div
            style={{ color: comment.text.length > 0 ? "#363636" : "#a5a5a5" }}
          >
            {comment.text.length > 0 ? comment.text : "No comment"}
          </div>
          {comment.tags.length > 0 ? (
            <div style={{ marginTop: "2em" }}>
              {comment.tags.map((tag, j) => (
                <Tag style={{ margin: "5px 5px 5px 0px" }} key={j}>
                  {" "}
                  {tag}{" "}
                </Tag>
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
    </ScrollableAnchor>
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
          type="flex"
          align="middle"
          justify="space-between"
          span={12}
          style={{ fontSize: "25px", fontWeight: 600, marginTop: "4em" }}
        >
          <Col>Comments</Col>
          <Col>
            <Row type="flex" gutter={10}>
              <Col>
                <Select
                  style={{ width: "10em" }}
                  placeholder="Type"
                  onChange={type =>
                    this.setState({ filterCommentsBy: type }, this.filter)
                  }
                  allowClear
                >
                  {SPEECH_TYPES.map((type, i) => (
                    <Option key={i} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col>
                <Select
                  defaultValue={this.props.sortCommentsBy}
                  style={{ width: "10em" }}
                  placeholder="Sort"
                  onChange={by => {
                    this.setState({ sortCommentsBy: by }, this.sort);
                    this.props.changeSortCommentsBy(by);
                  }}
                >
                  <Option value={SORTS.latest_first}>
                    {SORTS.latest_first}
                  </Option>
                  <Option value={SORTS.earliest_first}>
                    {SORTS.earliest_first}
                  </Option>
                  <Option value={SORTS.highest_score}>
                    {SORTS.highest_score}
                  </Option>
                  <Option value={SORTS.lowest_score}>
                    {SORTS.lowest_score}
                  </Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row style={{ marginTop: "2em" }}>
          {this.state.displayedComments.length === 0 ? (
            <Empty description="No comments yet! Did you try a different set of filters?" />
          ) : (
            <div>
              <Col span={12}>
                {this.state.displayedComments
                  .filter((_, i) => i % 2 === 0)
                  .map((comment, i) => this.commentRender(comment, i))}
              </Col>
              <Col span={12}>
                {this.state.displayedComments
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
