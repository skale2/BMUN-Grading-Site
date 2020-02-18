import React from "react";
import { Spring, animated, config } from "react-spring/renderprops";
import { withRouter } from "react-router-dom";
import {
  Form,
  Button,
  Input,
  Col,
  Row,
  Affix,
  Divider,
  Tag,
  message
} from "antd";
import {
  SPEAKERS_LIST,
  MODERATED,
  UNMODERATED,
  FORMAL,
  COMMENT,
  CRISIS
} from "../constants";
import ScrollableAnchor from "react-scrollable-anchor";
import { goToAnchor, configureAnchors } from "react-scrollable-anchor";

import { TAGS, SPEECH_TYPES } from "../constants";
import backend from "../backend";

import { tagStyle } from "../style";

const { TextArea } = Input;

class GradeDetail extends React.Component {
  constructor(props) {
    super(props);

    if (props.location.state !== undefined) {
      let { row, type, score, tags, text } = props.location.state.edit;
      this.state = {
        editingRow: row,
        focus: 0,
        type: SPEECH_TYPES.indexOf(type),
        score: score,
        tags: new Set(tags),
        focusingOnComments: false,
        comments: text
      };
    } else {
      this.state = {
        editingRow: undefined,
        focus: 0,
        type: -1,
        score: -1,
        tags: new Set(),
        focusingOnComments: false,
        comments: ""
      };
    }

    this.commentsRef = React.createRef();
    this.tagsRef = React.createRef();

    configureAnchors({ offset: -250, scrollDuration: 200 });
  }

  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleSubmit = () => {
    if (this.state.editingRow !== undefined) {
      backend
        .edit(
          this.state.editingRow,
          this.props.delegation,
          this.state.type,
          this.state.score,
          this.state.tags,
          this.state.comments
        )
        .then(() => {
          message.success(`Edited ${this.props.delegation}!`);
          this.props.history.goBack();
        });
    } else {
      backend
        .grade(
          this.props.delegation,
          this.state.type,
          this.state.score,
          this.state.tags,
          this.state.comments
        )
        .then(() => {
          message.success(`Graded ${this.props.delegation}!`);
          this.props.history.goBack();
        });
    }
  };

  handleKeyPress = e => {
    if (
      e.key === "Enter" &&
      e.shiftKey &&
      this.state.type >= 0 &&
      this.state.score >= 0
    ) {
      this.handleSubmit();
    }

    if (this.state.focus === 0) {
      let key = parseInt(e.key);

      if (![1, 2, 3, 4, 5, 6].includes(key)) return;

      this.setState({
        type: key - 1,
        focus: 1
      });

      goToAnchor("score");
    } else if (this.state.focus === 1) {
      let key = parseInt(e.key);

      if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 0].includes(key)) return;

      if (key === 0) {
        key = 10;
      }

      this.setState({
        score: key,
        focus: 2
      });

      goToAnchor("tags");
      this.setState({ focusingOnComments: true }, () =>
        this.commentsRef.focus()
      );
    }
  };

  handleTypeClick = type => {
    this.setState({
      type: type,
      focus: 1
    });
    goToAnchor("score");
  };

  handleScoreClick = score => {
    this.setState({
      score: score,
      focus: 2
    });

    goToAnchor("tags");
    this.commentsRef.focus();
  };

  handleTagSelect = tag => {
    let tags = this.state.tags;
    if (tags.has(tag)) {
      tags.delete(tag);
    } else {
      tags.add(tag);
    }
    this.setState({ tags: tags });
  };

  handleAddComment = e => {
    if (this.state.focusingOnComments)
      this.setState({ focusingOnComments: false });
    else if (!(e.key === "Enter" && e.shiftKey))
      this.setState({ comments: e.target.value });
  };

  render() {
    return (
      <Spring native config={config.stiff} from={{ time: 0 }} to={{ time: 1 }}>
        {props => (
          <Form>
            <div style={{ fontSize: "40px", fontWeight: "700", float: "left" }}>
              {this.props.delegation}
            </div>
            <Divider />
            <animated.div
              style={{
                transform: props.time.interpolate(
                  time => `translateY(${50 * (1 - time)}px)`
                ),
                opacity: props.time
              }}
            >
              <ScrollableAnchor id={"type"}>
                <Form.Item style={{ margin: "7em 0em" }}>
                  <Row type="flex" align="middle">
                    <Col
                      span={4}
                      style={{
                        textAlign: "right",
                        fontSize: "25px",
                        fontWeight: 600
                      }}
                    >
                      Type
                    </Col>
                    <Col span={2} />
                    <Col span={18}>
                      <Row type="flex" justify="center">
                        {[
                          SPEAKERS_LIST,
                          MODERATED,
                          UNMODERATED,
                          FORMAL,
                          COMMENT,
                          CRISIS
                        ].map((val, i) => (
                          <Col key={i}>
                            <Button
                              size="large"
                              onClick={() => this.handleTypeClick(i)}
                              type={this.state.type === i ? "primary" : null}
                              style={{
                                margin: "0.5em",
                                width: "11em",
                                height: "3em",
                                display: "flex"
                              }}
                            >
                              <div>
                                <div
                                  style={{ float: "left", marginRight: "7px" }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      fontSize: "15px",
                                      marginBottom: "-3px"
                                    }}
                                  >
                                    {i + 1}
                                  </div>
                                  <div
                                    style={{ fontSize: "7px", fontWeight: 700 }}
                                  >
                                    PRESS
                                  </div>
                                </div>
                                <div style={{ marginTop: "3px" }}>{val}</div>
                              </div>
                            </Button>
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                </Form.Item>
              </ScrollableAnchor>
            </animated.div>
            <animated.div
              style={{
                transform: props.time.interpolate(
                  time => `translateY(${100 * (1 - time)}px)`
                ),
                opacity: props.time
              }}
            >
            <ScrollableAnchor id={"score"}>
              <Form.Item style={{ margin: "7em 0em" }}>
                <Row type="flex" align="middle">
                  <Col
                    span={4}
                    style={{
                      textAlign: "right",
                      fontSize: "25px",
                      fontWeight: 600
                    }}
                  >
                    Score
                  </Col>
                  <Col span={2} />
                  <Col span={18}>
                    <Row
                      type="flex"
                      justify="center"
                      style={{ margin: "0em 4em" }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val, i) => (
                        <Col key={i}>
                          <Button
                            size="large"
                            onClick={() => this.handleScoreClick(val)}
                            type={this.state.score === val ? "primary" : null}
                            style={{
                              margin: "0.5em",
                              width: "4em",
                              height: "3em"
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 600
                              }}
                            >
                              {val}
                            </div>
                            <div style={{ fontSize: "8px", fontWeight: 700 }}>
                              PRESS
                            </div>
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </Form.Item>
            </ScrollableAnchor>
            </animated.div>
            <animated.div
              style={{
                transform: props.time.interpolate(
                  time => `translateY(${150 * (1 - time)}px)`
                ),
                opacity: props.time
              }}
            >
            <ScrollableAnchor id={"tags"}>
              <Form.Item style={{ margin: "7em 0em" }}>
                <Row type="flex" align="middle">
                  <Col
                    span={4}
                    style={{
                      textAlign: "right",
                      fontSize: "25px",
                      fontWeight: 600
                    }}
                  >
                    Tags
                  </Col>
                  <Col span={2} />
                  <Col span={18}>
                    {TAGS.map((val, i) => (
                      <Tag.CheckableTag
                        key={i}
                        checked={this.state.tags.has(val)}
                        onChange={() => this.handleTagSelect(val)}
                        style={{
                          ...tagStyle,
                          cursor: "pointer",
                          border: this.state.tags.has(val)
                            ? null
                            : "1px solid rgb(217, 217, 217)"
                        }}
                      >
                        {val}
                      </Tag.CheckableTag>
                    ))}
                  </Col>
                </Row>
              </Form.Item>
            </ScrollableAnchor>
            </animated.div>
            <animated.div
              style={{
                transform: props.time.interpolate(
                  time => `translateY(${200 * (1 - time)}px)`
                ),
                opacity: props.time
              }}
            >
            <ScrollableAnchor id={"comments"}>
              <Form.Item style={{ margin: "7em 0em" }}>
                <Row type="flex" align="middle">
                  <Col
                    span={4}
                    style={{
                      textAlign: "right",
                      fontSize: "25px",
                      fontWeight: 600
                    }}
                  >
                    Comments
                  </Col>
                  <Col span={2} />
                  <Col span={18}>
                    <TextArea
                      allowClear
                      rows={8}
                      value={this.state.comments}
                      onChange={this.handleAddComment}
                      ref={comments => {
                        this.commentsRef = comments;
                      }}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </ScrollableAnchor>
            </animated.div>
            <Form.Item>
              <Affix offsetBottom={100}>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    float: "right",
                    fontSize: "20px"
                  }}
                  onClick={this.handleSubmit}
                  disabled={this.state.type < 0 || this.state.score < 0}
                >
                  <Row type="flex" align="middle" justify="space-between">
                    <Col span={5}>Submit</Col>
                    <Col span={7}>
                      <div style={{ fontSize: "10px", marginRight: "1em" }}>
                        <div style={{ marginLeft: "2px" }}>SHIFT</div>
                        <div>ENTER</div>
                      </div>
                    </Col>
                  </Row>
                </Button>
              </Affix>
            </Form.Item>
          </Form>
        )}
      </Spring>
    );
  }
}

export default withRouter(GradeDetail);
