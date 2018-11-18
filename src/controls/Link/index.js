

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  // RichUtils,
  EditorState,
  Modifier,
} from 'draft-js';

import LinkIcon from "material-ui-icons/Link";

import ToggleBlockType from "../ToggleBlockType";

import decorator from "./decorator";
export {decorator};


export default class LinkBlockType extends ToggleBlockType {

  static propTypes = {
    ...ToggleBlockType.propTypes,
    blockType: PropTypes.string,
  }

  static defaultProps = {
    icon: LinkIcon,
  }



  getCurrentEntity() {
    const { editorState } = this.props;

    return this.getSelectionEntity(editorState);

    // if (editorState) {
    //   this.setState({
    //     currentEntity: getSelectionEntity(editorState),
    //   });
    // }
    // modalHandler.registerCallBack(this.expandCollapse);
  }

  addLink = (linkTitle, linkTarget, linkTargetOption) => {
    const {
      editorState,
      onChange,
    } = this.props;

    const currentEntity = this.getCurrentEntity();

    console.log("currentEntity", currentEntity);

    // return;

    // const { currentEntity } = this.state;

    let selection = editorState.getSelection();

    if (currentEntity) {
      // const entityRange = getEntityRange(editorState, currentEntity);
      // selection = selection.merge({
      //   anchorOffset: entityRange.start,
      //   focusOffset: entityRange.end,
      // });
    }
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('LINK', 'MUTABLE', { url: linkTarget, targetOption: linkTargetOption })
      .getLastCreatedEntityKey();

    console.log("entityKey", entityKey);


    let contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      `${linkTitle}`,
      editorState.getCurrentInlineStyle(),
      entityKey,
    );

    console.log("entityKey contentState", contentState);

    // console.log("entityKey contentState.getCurrentContent", contentState.getCurrentContent());
    
    // return;
    
    /**
     * В версии 0.11-alpha здесь ломается. 
     * https://draftjs.org/docs/v0-10-api-migration.html#content
     */
    let newEditorState = EditorState.push(editorState, contentState, 'insert-characters');

    console.log("entityKey newEditorState", newEditorState);
    console.log("entityKey newEditorState compare", newEditorState === editorState);
    // return;

    // insert a blank space after link
    selection = newEditorState.getSelection().merge({
      anchorOffset: selection.get('anchorOffset') + linkTitle.length,
      focusOffset: selection.get('anchorOffset') + linkTitle.length,
    });
    newEditorState = EditorState.acceptSelection(newEditorState, selection);
    contentState = Modifier.insertText(
      newEditorState.getCurrentContent(),
      selection,
      ' ',
      newEditorState.getCurrentInlineStyle(),
      undefined,
    );
    onChange(EditorState.push(newEditorState, contentState, 'insert-characters'));
    // this.doCollapse();
  };

  toggleBlockType = () => {

    const {
      onChange,
      editorState,
      blockType,
    } = this.props;

    this.addLink("test link", "https://modxclub.ru")

    // const newState = RichUtils.toggleBlockType(
    //   editorState,
    //   blockType,
    // );

    // if (newState) {
    //   onChange(newState);
    // }
  };


  // render() {

  //   const {
  //     editorState,
  //     onChange,
  //     blockType,
  //     icon: Icon,
  //     ...other
  //   } = this.props;

  //   return <IconButton
  //     onClick={() => this.toggleBlockType()}
  //     {...other}
  //   >
  //     <Icon />
  //   </IconButton>
  // }
}
