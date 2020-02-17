import React from "react";
import { Input, Select, Affix, Row, Col } from "antd";

const Search = Input.Search;
const Option = Select.Option;

/**
 * A search bar component that takes in a list of possible queries
 * and handles actively searching through user input for a list of
 * matching results.
 *
 * values:         String[] -> table of all possible user queries
 *
 * dispatchUpdate: function(String[], bool) -> hook for user
 *                 keystrokes; is given a list of possible results
 *                 based on the current user query
 *
 * placeHolder:    String -> placeholder text in the search bar
 */
class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    let { values, dispatchUpdate, placeHolder } = props;

    this.trie = new QueryTrie(values);
    this.dispatchUpdate = dispatchUpdate;
    this.placeHolder = placeHolder;

    this.searchRef = React.createRef();

    this.state = {
      selected: false,
      query: "",
      node: this.trie.head,
      darken: 0,
      offPath: 0,
      sorts: props.sorts
    };
  }

  componentDidMount = () => {
    this.searchRef.focus();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  handleScroll = () => {
    let scrollTop = window.scrollY;
    this.setState({ darken: Math.min(0.8, scrollTop / 300) });
  };

  updateResults = event => {
    let node = this.state.node;
    let query = event.target.value.trim();
    let offPath = this.state.offPath;

    // If the user deleted some characters from their query
    if (query.length < this.state.query.length) {
      for (
        let i = 0;
        i < this.state.query.length - query.length && node != null;
        i++
      ) {
        if (offPath > 0) offPath--;
        else node = node.parent;
      }
    }

    // If the user added more characters to their query
    else {
      let i = this.state.query.length;

      // If the current query is still valid
      if (!offPath) {
        let ch;
        let newNode;
        for (; i < query.length; i++) {
          ch = query.charAt(i).toLowerCase();
          newNode = node.children[ch];

          if (newNode == null) break;
          node = newNode;
        }
      }

      // If the user added more characters that takes us
      // off the trie
      offPath = offPath + query.length - i;
    }

    // Update where we are now and update our listener.
    this.setState(
      {
        node: node,
        query: query,
        offPath: offPath
      },
      () =>
        this.dispatchUpdate(
          !this.state.offPath ? this.state.node.queries : [],
          query.length === 0
        )
    );
  };

  sort = value => {
    if (this.props.sorts === undefined) return;

    let queries = this.state.node.queries.sort(this.props.getSort(value));

    this.dispatchUpdate(
      !this.state.offPath ? queries : [],
      this.state.query.length === 0
    );
  };

  render() {
    return (
      <Affix offsetTop={25}>
        <Row
          type="flex"
          gutter={[20, 0]}
          align="middle"
          style={{ marginBottom: 20 }}
        >
          <Col span={this.props.sorts !== undefined ? 19 : 24}>
            <Search
              placeholder={this.placeHolder}
              onChange={this.updateResults}
              style={{
                size: "large",
                height: 60,
                borderRadius: "5px",
                boxShadow:
                  "0px 0px 100px 20px rgba(170, 170, 170, " +
                  this.state.darken +
                  ")",
                ...this.props.style
              }}
              ref={search => {
                this.searchRef = search;
              }}
            />
          </Col>
          {this.props.sorts !== undefined ? (
            <Col span={5}>
              <Select
                size="large"
                style={{
                  width: 150,
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: "5px",
                  boxShadow:
                    "0px 0px 100px 20px rgba(170, 170, 170, " +
                    this.state.darken +
                    ")"
                }}
                defaultValue={this.props.defaultSort}
                onChange={this.sort}
              >
                {this.props.sorts.map((sort, i) => (
                  <Option key={i} value={sort}>
                    {sort}
                  </Option>
                ))}
              </Select>
            </Col>
          ) : null}
        </Row>
      </Affix>
    );
  }
}

class QueryTrie {
  constructor(values) {
    this.head = this.newNode(null, null);
    for (let val of values) {
      this.addQuery(val);
    }
  }

  addQuery(val) {
    let ch;
    let node = this.head;

    for (let i = 0; i < val.length; i++) {
      ch = val.charAt(i).toLowerCase();
      if (!node.children[ch]) {
        node.children[ch] = this.newNode(ch, node);
      }
      node = node.children[ch];
    }

    while (node) {
      node.queries.push(val);
      node = node.parent;
    }
  }

  newNode(ch, parent) {
    return {
      char: ch,
      word: null,
      children: {},
      parent: parent,
      queries: []
    };
  }
}

export default SearchBar;
