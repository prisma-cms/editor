import React, { Component } from 'react';
import PropTypes from "prop-types";


import {
  Editor,
  EditorState,
} from 'draft-js';


class PrismaEditor extends Component {

  static propTypes = {
    readOnly: PropTypes.bool.isRequired,
    spellCheck: PropTypes.bool.isRequired,
  }


  static defaultProps = {
    readOnly: true,
    spellCheck: true,
  }


  constructor(props) {

    super(props);

    this.state = {
      editorState: EditorState.createEmpty()
    };


  }

  onChange = (editorState) => {

    return this.setState({
      editorState
    });

  }

  render() {

    const {
      editorState,
    } = this.state;

    return (
      <Editor
        editorState={editorState}
        onChange={this.onChange}
      />
    );
  }
}

export default PrismaEditor;