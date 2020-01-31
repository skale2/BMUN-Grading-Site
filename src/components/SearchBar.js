import React from "react";
import { Input, Affix } from "antd";

const Search = Input.Search;

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
      offPath: 0
    };
  }

  componentDidMount = () => {
    this.searchRef.focus();
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  handleScroll = _ => {
    let scrollTop = window.scrollY;
    this.setState({ darken: Math.min(1, scrollTop / 300) });
  };

  updateResults = event => {
    let node = this.state.node;
    let value = event.target.value;
    let offPath = this.state.offPath;

    // If the user deleted some characters from their query
    if (value.length < this.state.query.length) {
      for (
        let i = 0;
        i < this.state.query.length - value.length && node != null;
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
        for (; i < value.length; i++) {
          ch = value.charAt(i).toLowerCase();
          newNode = node.children[ch];

          if (newNode == null) break;
          node = newNode;
        }
      }

      // If the user added more characters that takes us
      // off the trie
      offPath = offPath + value.length - i;
    }

    // Update where we are now
    this.setState({
      node: node,
      query: value,
      offPath: offPath
    });

    // Tell whoever is listening to update their list of possible queries
    this.dispatchUpdate(!offPath ? node.queries : [], value.length === 0);
  };

  render() {
    return (
      <Affix offsetTop={25}>
        <Search
          size="large"
          placeholder={this.placeHolder}
          onChange={this.updateResults}
          style={{
            height: "4em",
            marginBottom: "3em",
            borderRadius: "5px",
            boxShadow:
              "0px 0px 90px 30px rgba(170, 170, 170, " + this.state.darken + ")"
          }}
          ref={search => {
            this.searchRef = search;
          }}
        />
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
