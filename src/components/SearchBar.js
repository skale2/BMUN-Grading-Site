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

    let values = [];
    let valueMap = {};

    for (let value of props.values) {
      let words = value.split(/\s+/);
      for (let word of words) {
        values.push(word);
        if (!valueMap.hasOwnProperty(word))
          valueMap[word] = [value];
        else
          valueMap[word].push(value)
      }
    }

    this.trie = new QueryTrie(values, valueMap);

    this.searchRef = React.createRef();

    this.state = {
      query: "",
      node: this.trie.head,
      darken: 0,
      offPath: 0,
      activeSort: props.sorts !== undefined ? props.sorts.default : () => -1
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

  getQueries = () => {
    return this.state.node.queries;
  };

  dispatchUpdate = queries => {
    this.props.dispatchUpdate(
      !this.state.offPath ? queries : [],
      this.state.query.length === 0,
    );
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
      () => this.dispatchUpdate(this.sort())
    );
  };

  sort = (sort, queries) => {
    if (queries === undefined) queries = this.getQueries();

    if (this.props.sorts === undefined) return queries;

    if (sort !== undefined && sort !== this.state.activeSort)
      this.setState({
        activeSort: sort
      });
    else sort = this.state.activeSort;

    return queries.sort(this.props.sorts.getHandler(sort));
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
          <Col span={24 - (this.props.sorts !== undefined ? 5 : 0)}>
            <Search
              placeholder={this.props.placeHolder}
              onChange={this.updateResults}
              size="large"
              style={{
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
                defaultValue={this.props.sorts.default}
                onChange={sort => this.dispatchUpdate(this.sort(sort))}
              >
                {this.props.sorts.values.map((sort, i) => (
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
  constructor(values, valueMap) {
    this.head = this.newNode(null, null);
    this.valueMap = valueMap;
    for (let val of values) this.addQuery(val);
  }

  addQuery(val) {
    let ch;
    let node = this.head;

    let setValues = this.valueMap[val];

    for (let i = 0; i < val.length; i++) {
      ch = val.charAt(i).toLowerCase();
      if (!node.children[ch]) node.children[ch] = this.newNode(ch, node);

      for (let setVal of setValues)
        if (!node.queries.includes(setVal))
          node.queries.push(setVal);

      node = node.children[ch];
    }
  }

  newNode(ch, parent) {
    return {
      char: ch,
      children: {},
      parent: parent,
      queries: []
    };
  }
}

export default SearchBar;
