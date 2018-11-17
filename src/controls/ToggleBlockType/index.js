

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RichUtils } from 'draft-js';

import IconButton from 'material-ui/IconButton';

export default class ToggleBlockType extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    blockType: PropTypes.string.isRequired,
    icon: PropTypes.func.isRequired,
  };


  toggleBlockType = () => {
    const {
      onChange,
      editorState,
      blockType,
    } = this.props;

    const newState = RichUtils.toggleBlockType(
      editorState,
      blockType,
    );

    if (newState) {
      onChange(newState);
    }
  };


  render() {

    const {
      editorState,
      onChange,
      blockType,
      icon: Icon,
      ...other
    } = this.props;

    return <IconButton
      onClick={() => this.toggleBlockType()}
      {...other}
    >
      <Icon />
    </IconButton>
  }
}
