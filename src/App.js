import React, { Component } from 'react';
import PropTypes from "prop-types";

import "./styles/less/styles.css";

import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  convertFromHTML,
  CompositeDecorator,
} from 'draft-js';

import {
  changeDepth,
  handleNewLine,
  blockRenderMap,
  getCustomStyleMap,
  extractInlineStyle,
  getSelectedBlocksType,
} from 'draftjs-utils';


import getLinkDecorator from './decorators/Link';


class PrismaEditor extends Component {

  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    readOnly: PropTypes.bool.isRequired,
    spellCheck: PropTypes.bool.isRequired,
    decorators: PropTypes.array,
  }


  static defaultProps = {
    readOnly: true,
    spellCheck: true,
    decorators: [],
  }


  constructor(props) {

    super(props);

    const {
      value,
    } = props;

    const {
      editorState,
      rawContent,
    } = this.initState(value);

    this.state = {
      editorState,
      rawContent,
    };

  }


  initState(value) {

    let editorState;
    let rawContent;

    const compositeDecorator = this.getCompositeDecorator();

    console.log("initState value", typeof value, value);

    if (value) {

      if (typeof value === "object") {
        const contentState = convertFromRaw(value);
        editorState = EditorState.createWithContent(contentState, compositeDecorator);
        editorState = EditorState.moveSelectionToEnd(editorState);
      }
      else if (typeof value === "string") {
        const blocks = convertFromHTML(value);
        console.log("initState string contentState", blocks);

        const contentState = ContentState.createFromBlockArray(blocks);
        editorState = EditorState.createWithContent(contentState, compositeDecorator);
        editorState = EditorState.moveSelectionToEnd(editorState);

        console.log("initState string editorState", editorState);

      }
    }

    // if (hasProperty(this.props, 'editorState')) {
    //   if (this.props.editorState) {
    //     editorState = EditorState.set(this.props.editorState, { decorator: compositeDecorator });
    //   }
    // }
    // else if (hasProperty(this.props, 'defaultEditorState')) {
    //   if (this.props.defaultEditorState) {
    //     editorState = EditorState.set(
    //       this.props.defaultEditorState,
    //       { decorator: compositeDecorator },
    //     );
    //   }
    // }
    // else if (hasProperty(this.props, 'contentState')) {
    //   if (this.props.contentState) {
    //     const contentState = convertFromRaw(this.props.contentState);
    //     editorState = EditorState.createWithContent(contentState, compositeDecorator);
    //     editorState = EditorState.moveSelectionToEnd(editorState);
    //   }
    // }
    // else if (hasProperty(this.props, 'defaultContentState')
    //   || hasProperty(this.props, 'initialContentState')) {
    //   let contentState = this.props.defaultContentState || this.props.initialContentState;
    //   if (contentState) {
    //     contentState = convertFromRaw(contentState);
    //     editorState = EditorState.createWithContent(contentState, compositeDecorator);
    //     editorState = EditorState.moveSelectionToEnd(editorState);
    //   }
    // }

    if (!editorState) {
      // editorState = EditorState.createEmpty(compositeDecorator);
      editorState = EditorState.createEmpty(compositeDecorator);
    }

    // this.compositeDecorator = compositeDecorator;

    return {
      editorState,
      rawContent,
    }
  }


  getCompositeDecorator = () => {
    const decorators = [
      ...this.props.decorators,
      getLinkDecorator({
      }),
    ];

    console.log("decorators", decorators);
    return new CompositeDecorator(decorators);
    // return new CompositeDecorator([]);
  }




  // onChange = (editorState) => {

  //   const {
  //     readOnly,
  //     onEditorStateChange,
  //   } = this.props;

  //   if (
  //     !readOnly
  //     &&
  //     !(getSelectedBlocksType(editorState) === 'atomic' && editorState.getSelection().isCollapsed)
  //   ) {

  //     if (onEditorStateChange) {
  //       onEditorStateChange(editorState, this.props.wrapperId);
  //     }

  //     if (!hasProperty(this.props, 'editorState')) {
  //       this.setState({ editorState }, this.afterChange(editorState));
  //     }
  //     else {
  //       this.afterChange(editorState);
  //     }

  //   }

  //   return;
  // };

  onChange = (editorState) => {

    console.log("PrismaEditor onChange editorState", editorState);

    const currentContent = editorState.getCurrentContent();

    console.log("PrismaEditor onChange editorState.getCurrentContent()", currentContent);

    const rawContent = convertToRaw(currentContent);

    console.log("PrismaEditor onChange editorState convertToRaw", rawContent);

    this.setState({
      editorState,
      rawContent,
    }, () => {

      const {
        onChange,
      } = this.props;

      onChange && onChange(rawContent, editorState);

    });

  };



  // afterChange = (editorState) => {
  //   setTimeout(() => {
  //     const { onChange, onContentStateChange } = this.props;
  //     if (onChange) {
  //       onChange(convertToRaw(editorState.getCurrentContent()));
  //     }
  //     if (onContentStateChange) {
  //       onContentStateChange(convertToRaw(editorState.getCurrentContent()));
  //     }
  //   });
  // };


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