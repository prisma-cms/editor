

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RichUtils } from 'draft-js-android-fix';

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


  getSelectionEntity(editorState) {

    let entity;

    const selection = editorState.getSelection();

    let start = selection.getStartOffset();
    let end = selection.getEndOffset();

    if (start === end && start === 0) {
      end = 1;
    } else if (start === end) {
      start -= 1;
    }

    const block = this.getSelectedBlock(editorState);




    for (let i = start; i < end; i += 1) {



      const currentEntity = block.getEntityAt(i);



      if (!currentEntity) {
        entity = undefined;
        break;
      }

      if (i === start) {
        entity = currentEntity;
      }
      else if (entity !== currentEntity) {
        entity = undefined;
        break;
      }
    }
    return entity;
  }


  getEntityRange(editorState, entityKey) {

    const block = this.getSelectedBlock(editorState);

    let entityRange;

    block.findEntityRanges(
      value => value.get('entity') === entityKey,
      (start, end) => {
        entityRange = {
          start,
          end,
          text: block.get('text').slice(start, end),
        };
      },
    );

    return entityRange;
  }

  getSelectedBlocksList(editorState) {
    return this.getSelectedBlocksMap(editorState).toList();
  }

  /**
   * Function returns the first selected block.
   */
  getSelectedBlock(editorState) {
    if (editorState) {
      return this.getSelectedBlocksList(editorState).get(0);
    }
    return undefined;
  }


  getSelectedBlocksMap(editorState) {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const startKey = selectionState.getStartKey();
    const endKey = selectionState.getEndKey();
    const blockMap = contentState.getBlockMap();
    return blockMap
      .toSeq()
      .skipUntil((_, k) => k === startKey)
      .takeUntil((_, k) => k === endKey)
      .concat([[endKey, blockMap.get(endKey)]]);
  }


  renderIcon() {

    const {
      icon: Icon,
    } = this.props;

    return <Icon />

  }


  isDisabled() {

    const {
      disabled,
    } = this.props;
    return disabled || false;
  }

  isTextSelected() {

    const {
      editorState,
    } = this.props;

    const selectionState = editorState.getSelection();

    const textSelected = selectionState && (selectionState.getEndOffset() - selectionState.getStartOffset() !== 0);

    return textSelected;
  }


  getSelectionText(editorState) {
    let selectedText = "";
    const currentSelection = editorState.getSelection();
    let start = currentSelection.getAnchorOffset();
    let end = currentSelection.getFocusOffset();
    const selectedBlocks = this.getSelectedBlocksList(editorState);
    if (selectedBlocks.size > 0) {
      if (currentSelection.getIsBackward()) {
        const temp = start;
        start = end;
        end = temp;
      }
      for (let i = 0; i < selectedBlocks.size; i += 1) {
        const blockStart = i === 0 ? start : 0;
        const blockEnd =
          i === selectedBlocks.size - 1
            ? end
            : selectedBlocks.get(i).getText().length;
        selectedText += selectedBlocks
          .get(i)
          .getText()
          .slice(blockStart, blockEnd);
      }
    }
    return selectedText;
  }


  render() {

    const {
      editorState,
      onChange,
      blockType,
      icon,
      disabled,
      ...other
    } = this.props;


    return <IconButton
      onClick={() => this.toggleBlockType()}
      disabled={this.isDisabled()}
      {...other}
    >
      {this.renderIcon()}
    </IconButton>
  }
}
