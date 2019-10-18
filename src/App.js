import React, { PureComponent } from 'react';
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
  getDefaultKeyBinding,
  DefaultDraftBlockRenderMap,
  // KeyBindingUtil,
} from 'draft-js-android-fix';

// import {
//   changeDepth,
//   handleNewLine,
//   blockRenderMap,
//   getCustomStyleMap,
//   extractInlineStyle,
//   getSelectedBlocksType,
// } from 'draftjs-utils';

import { Map } from 'immutable';

// import getLinkDecorator from './decorators/Link';
import withStyles from 'material-ui/styles/withStyles';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';

import BoldIcon from "material-ui-icons/FormatBold";
import ItalicIcon from "material-ui-icons/FormatItalic";
import UnderlinedIcon from "material-ui-icons/FormatUnderlined";
import ListBulletedIcon from "material-ui-icons/FormatListBulleted";
import ListNumberedIcon from "material-ui-icons/FormatListNumbered";
import CodeIcon from 'material-ui-icons/Code';

// import ListControl from "./controls/List";
import ToggleBlockTypeControl from "./controls/ToggleBlockType";
import LinkControl, {
  decorator as linkDecorator,
} from "./controls/Link";

import TextBlock from './controls/Code/';

import { insertTextBlock } from './modifiers/insertTextBlock';
// import { removeTextBlock } from './modifiers/removeTextBlock';


import ImageBlock from './blocks/image';

// const {
//   hasCommandModifier
// } = KeyBindingUtil;

const {
  toggleInlineStyle,
  // onTab,
} = RichUtils;

export const styles = {
  root: {
    "&.PrismaEditor--editable": {
      "& .DraftEditor-root": {
        "& > .DraftEditor-editorContainer": {
          "& > .public-DraftEditor-content": {
            "& > div[data-contents=true]": {
              border: "1px solid #ddd",
              padding: 3,
            }
          }
        },
      },
    },
    "& .DraftEditor-root": {
      "& > .DraftEditor-editorContainer": {
        "& > .public-DraftEditor-content": {
          "& figure": {
            margin: "15px auto",
          },
        }
      },
    },
  },
  menu: {
    padding: 2,
    border: "1px solid #eee",
    marginBottom: 5,
  },
  iconButton: {
    height: "2rem",
    width: "2rem",

    "& svg": {

      height: "1.2rem",
      fontSize: "1.2rem",
    },
  },
}


export class PrismaEditor extends PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    readOnly: PropTypes.bool.isRequired,
    spellCheck: PropTypes.bool.isRequired,
    decorators: PropTypes.array,
    defaultBlockRenderMap: PropTypes.bool.isRequired,

    plugins: PropTypes.array.isRequired,
    show_toolbar: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    readOnly: true,
    spellCheck: true,
    decorators: [],
    defaultBlockRenderMap: true,
    plugins: [],
    show_toolbar: true,
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
    let rawContent = value;

    const compositeDecorator = this.getCompositeDecorator();


    if (value) {

      if (typeof value === "object") {
        const contentState = convertFromRaw(value);
        editorState = EditorState.createWithContent(contentState, compositeDecorator);
      }
      else if (typeof value === "string") {
        const blocks = convertFromHTML(value);

        const contentState = ContentState.createFromBlockArray(blocks);
        editorState = EditorState.createWithContent(contentState, compositeDecorator);

      }
    }


    if (!editorState) {
      editorState = EditorState.createEmpty(compositeDecorator);
    }

    // let selectionState = editorState.getSelection();



    // var anchorKey = selectionState.getAnchorKey();



    // var start = selectionState.getStartOffset();
    // var end = selectionState.getEndOffset();



    // var currentContent = editorState.getCurrentContent();
    // var currentContentBlock = currentContent.getBlockForKey(anchorKey);

    // var selectedText = currentContentBlock.getText().slice(start, end);



    // const currentBlockKey = editorState.getSelection().getStartKey()
    // const currentBlockIndex = editorState.getCurrentContent().getBlockMap()
    //   .keySeq().findIndex(k => k === currentBlockKey)



    return {
      editorState,
      rawContent,
    }
  }


  getCompositeDecorator = () => {

    const decorators = [
      ...this.props.decorators,
      linkDecorator({
        props: {
          onEditStart: this.onEditStart,
          onEditEnd: this.onEditEnd,
          onChange: this.onChange,
          getEditorState: this.getEditorState,
          isReadOnly: this.isReadOnly,
        },
      }),
    ];


    return new CompositeDecorator(decorators);
    // return new CompositeDecorator([]);
  }


  getEditorState = () => {
    return this.state.editorState;
  }

  isReadOnly = () => {
    return this.props.readOnly;
  }


  componentDidUpdate(prevProps, prevState) {

    const {
      value: prevValue,
      readOnly: prevReadOnly,
    } = prevProps;

    const {
      value,
      readOnly,
    } = this.props;

    const {
      rawContent,
    } = this.state;




    /**
     * Приходится отслеживать несколько условий для обновления стейта, чтобы перерендеривался.
     * Надо будет переработать логику
     */
    if (readOnly !== prevReadOnly && readOnly) {

    }
    else if (
      // ((value !== undefined && rawContent !== undefined) && value !== rawContent && value !== prevValue)
      ((value !== undefined) && value !== rawContent && value !== prevValue)
      // ((value !== undefined) && value !== prevValue)
      // || readOnly !== prevReadOnly
    ) {

      /**
       * Важно! Сейчас рассчитано только на сброс кеша или 
       * любое другое изменение входящего значения. 
       * В onChange обязательно надо присваивать rawContent.
       * Это надо будет переделать. Правильней всего в любом случае отправлять во вне editorState,
       * а там пусть решает изменился contentState или нет (не путать с editorState, см. onChange).
       */

      // console.log("componentDidUpdate value", value);
      // console.log("componentDidUpdate prevValue", prevValue);

      const {
        editorState,
      } = this.initState(value);

      this.setState({
        editorState,
      }, () => {
        this.onChange(editorState);
      });


      // const {
      //   editorState,
      // } = this.initState(value);

      // this.onChange(editorState);

    }
  }



  onChange = (editorState) => {

    const {
      editorState: prevState,
    } = this.state;


    this.setState({
      editorState,
    }, () => {

      const {
        onChange,
      } = this.props;

      /**
       * Only if content modified
       */

      const currentContent = editorState.getCurrentContent();

      if (onChange && currentContent !== prevState.getCurrentContent()) {

        const rawContent = convertToRaw(currentContent);

        Object.assign(this.state, {
          rawContent,
        });

        onChange && onChange(rawContent, editorState);

      }

    });

    // // console.log("Editor onChange prev state", { ...this.state.editorState }, this.state.editorState);

    // // console.log("Editor onChange new state", { ...editorState }, editorState);

    // const currentSelection = editorState.getSelection();
    // const prevSelection = prevState.getSelection();

    // const currentContent = editorState.getCurrentContent();
    // const prevContent = prevState.getCurrentContent();


    // console.log("currentContent===prevContent", currentContent === prevContent);

    // // console.log("Editor onChange new state prevSelection.getHasFocus()", this.state.editorState.getSelection().getHasFocus());

    // // console.log("Editor onChange new state currentSelection.getHasFocus()", currentSelection.getHasFocus());


    // // if (currentSelection.getHasFocus()) {
    // //   return;
    // // }

    // const currentSelectionString = currentSelection ? currentSelection.toString() : "";
    // const prevSelectionString = prevSelection ? prevSelection.toString() : "";

    // console.log("onChange currentSelectionPosition getStartKey", currentSelection.getStartKey());
    // console.log("onChange currentSelectionPosition getStartOffset", currentSelection.getStartOffset());
    // console.log("onChange currentSelectionPosition getFocusOffset", currentSelection.getFocusOffset());

    // console.log("onChange currentSelection", currentSelection, currentSelection.serialize());
    // console.log(currentSelectionString);

    // console.log("onChange prevSelection", prevSelection, prevSelection.serialize());
    // console.log(prevSelectionString);


    // console.log("onChange currentSelection === prevSelection", currentSelectionString === prevSelectionString);


    // const focused = currentSelection.getHasFocus();
    // const prevFocused = prevSelection.getHasFocus();


    // console.log("Editor focused", focused, prevFocused);


    // this.setState({
    //   editorState,
    // }, () => {





    //   if (focused && prevFocused) {
    //     // if (focused) {

    //     const {
    //       onChange,
    //     } = this.props;


    //     if (onChange) {


    //       // return;

    //       const currentContent = editorState.getCurrentContent();


    //       const rawContent = convertToRaw(currentContent);



    //       Object.assign(this.state, {
    //         rawContent,
    //       });

    //       onChange && onChange(rawContent, editorState);


    //     }

    //   }


    // });

  };



  // onChange = (editorState) => {


  //   const currentContent = editorState.getCurrentContent();


  //   const rawContent = convertToRaw(currentContent);


  //   this.setState({
  //     editorState,
  //   }, () => {

  //     const {
  //       onChange,
  //     } = this.props;

  //     Object.assign(this.state, {
  //       rawContent,
  //     });

  //     onChange && onChange(rawContent, editorState);

  //   });

  // };


  keyBinding(event) {


    return getDefaultKeyBinding(event);
  }


  getBlockRenderMap() {

    const {
      plugins,
      defaultBlockRenderMap,
    } = this.props;

    let blockRenderMap = plugins
      .filter((plug) => plug.blockRenderMap !== undefined)
      .reduce((maps, plug) => maps.merge(plug.blockRenderMap), Map({}));



    if (defaultBlockRenderMap) {
      blockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);
    }



    if (this.props.blockRenderMap) {
      blockRenderMap = blockRenderMap.merge(this.props.blockRenderMap);
    }



    return blockRenderMap;
  };


  blockRenderer = (block) => {


    if (block.getType() === 'atomic') {

      return {
        component: TextBlock,
        editable: false,
        props: {
          allow_edit: !this.isReadOnly(),
          onStartEdit: this.onEditStart,
          onFinishEdit: (blockKey, newContentState) => {

            const {
              editorState,
            } = this.state;

            let newEditorState = EditorState.push(editorState, newContentState, 'change-block-type');

            this.onChange(newEditorState);

            this.onEditEnd();

          },
          _insertText: this._insertText,
          onRemove: (blockKey) => this._removeTeX(blockKey),
        },
      };

    }

    else if (block.getType() === 'image') {

      return {
        component: ImageBlock,
        editable: false,
        props: {
        },
      };
    }



    return null;

  }


  _insertText = () => {
    this.setState({
      liveTeXEdits: Map(),
      editorState: insertTextBlock(this.state.editorState),
    });
  };

  _removeTeX = (blockKey) => {



    const {
      editorState,
    } = this.state;

    const contentState = editorState.getCurrentContent()
    const newBlockMap = contentState.blockMap.delete(blockKey)  // this is the important one that actually deletes a block
    const newContentState = contentState.set('blockMap', newBlockMap)
    const newEditorState = EditorState.push(editorState, newContentState, 'remove-block')

    this.onChange(newEditorState);

    this.onEditEnd();


    return;
  };


  insertCodeBlock = () => {
    this._insertText();
  }


  onEditStart = () => {
    const {
      inEditBlocksCount = 0,
    } = this.state;
    this.setState({
      inEditBlocksCount: inEditBlocksCount + 1,
    });
  }

  onEditEnd = () => {
    const {
      inEditBlocksCount = 0,
    } = this.state;
    this.setState({
      inEditBlocksCount: inEditBlocksCount > 0 ? inEditBlocksCount - 1 : inEditBlocksCount,
    });
  }


  toggleInlineStyle(style) {
    this.onChange(toggleInlineStyle(this.state.editorState, style));
  }

  handleKeyCommand = (command) => {



    if (command === 'myeditor-save') {
      // Perform a request to save your contents, set
      // a new `editorState`, etc.
      return 'handled';
    }

    switch (command) {

      case "bold":
        return this.toggleInlineStyle("BOLD");

      case "italic":
        return this.toggleInlineStyle("ITALIC");

      case "underline":
        return this.toggleInlineStyle("UNDERLINE");

      default:;

    }

    return 'not-handled';
  }


  render() {

    const {
      classes,
      decorators,
      plugins,
      onChange,
      value,
      readOnly,
      blockRenderMap,
      defaultBlockRenderMap,
      show_toolbar,
      ...other
    } = this.props;

    const {
      editorState,
      inEditBlocksCount,
    } = this.state;


    // const selectionState = editorState.getSelection();


    return (
      <div
        className={[classes.root, !readOnly ? "PrismaEditor--editable" : ""].join(" ")}
      >

        {!readOnly && show_toolbar
          ?
          <div
            className={classes.menu}
          >
            <Grid
              container
            >

              <Grid
                item
              >
                <IconButton
                  onClick={() => this.toggleInlineStyle("BOLD")}
                  className={classes.iconButton}
                >
                  <BoldIcon />
                </IconButton>
              </Grid>

              <Grid
                item
              >
                <IconButton
                  onClick={() => this.toggleInlineStyle("ITALIC")}
                  className={classes.iconButton}
                >
                  <ItalicIcon />
                </IconButton>
              </Grid>

              <Grid
                item
              >
                <IconButton
                  onClick={() => this.toggleInlineStyle("UNDERLINE")}
                  className={classes.iconButton}
                >
                  <UnderlinedIcon />
                </IconButton>
              </Grid>

              <Grid
                item
              >
                <ToggleBlockTypeControl
                  editorState={editorState}
                  onChange={this.onChange}
                  blockType="unordered-list-item"
                  className={classes.iconButton}
                  icon={ListBulletedIcon}
                />
              </Grid>

              <Grid
                item
              >
                <ToggleBlockTypeControl
                  editorState={editorState}
                  onChange={this.onChange}
                  blockType="ordered-list-item"
                  className={classes.iconButton}
                  icon={ListNumberedIcon}
                />
              </Grid>

              <Grid
                item
              >
                <LinkControl
                  className={classes.iconButton}
                  editorState={editorState}
                  onChange={this.onChange}
                // disabled={!textSelected}
                />
              </Grid>

              <Grid
                item
              >
                <IconButton
                  className={classes.iconButton}
                  onClick={this.insertCodeBlock}
                >
                  <CodeIcon />
                </IconButton>
              </Grid>

            </Grid>
          </div>
          :
          null
        }

        <Editor
          editorState={editorState}
          readOnly={readOnly || inEditBlocksCount > 0}
          onChange={this.onChange}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={this.keyBinding}
          blockRenderMap={this.getBlockRenderMap()}
          blockRendererFn={this.blockRenderer}
          {...other}
        />


      </div>
    );
  }
}

export default withStyles(styles)(props => <PrismaEditor
  {...props}
/>);
