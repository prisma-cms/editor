import React, { Component, Fragment } from 'react';
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
  KeyBindingUtil,
} from 'draft-js';

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
import { withStyles, IconButton } from 'material-ui';
import { Grid } from 'material-ui';

import BoldIcon from "material-ui-icons/FormatBold";
import ItalicIcon from "material-ui-icons/FormatItalic";
import UnderlinedIcon from "material-ui-icons/FormatUnderlined";
import ListBulletedIcon from "material-ui-icons/FormatListBulleted";
import ListNumberedIcon from "material-ui-icons/FormatListNumbered";

// import ListControl from "./controls/List";
import ToggleBlockTypeControl from "./controls/ToggleBlockType";
import LinkControl, {
  decorator as linkDecorator,
} from "./controls/Link";

const {
  hasCommandModifier
} = KeyBindingUtil;

const {
  toggleInlineStyle,
  onTab,
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
        }
      }
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


export class PrismaEditor extends Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    readOnly: PropTypes.bool.isRequired,
    spellCheck: PropTypes.bool.isRequired,
    decorators: PropTypes.array,
    defaultBlockRenderMap: PropTypes.bool.isRequired,

    plugins: PropTypes.array.isRequired,
  }


  static defaultProps = {
    readOnly: true,
    spellCheck: true,
    decorators: [],
    defaultBlockRenderMap: true,
    plugins: [],
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

    // console.log("initState value", typeof value, value);

    if (value) {

      if (typeof value === "object") {
        const contentState = convertFromRaw(value);
        editorState = EditorState.createWithContent(contentState, compositeDecorator);
      }
      else if (typeof value === "string") {
        const blocks = convertFromHTML(value);
        // console.log("initState string contentState", blocks);

        const contentState = ContentState.createFromBlockArray(blocks);
        editorState = EditorState.createWithContent(contentState, compositeDecorator);

        // console.log("initState string editorState", editorState);

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
    else {
      // editorState = EditorState.moveSelectionToEnd(editorState);
    }

    // this.compositeDecorator = compositeDecorator;

    let selectionState = editorState.getSelection();

    // console.log("selectionState", selectionState);

    var anchorKey = selectionState.getAnchorKey();

    // console.log("selectionState anchorKey", anchorKey);

    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();

    // console.log("selectionState start end", start, end);

    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);

    var selectedText = currentContentBlock.getText().slice(start, end);

    // console.log("selectionState selectedText", selectedText);

    const currentBlockKey = editorState.getSelection().getStartKey()
    const currentBlockIndex = editorState.getCurrentContent().getBlockMap()
      .keySeq().findIndex(k => k === currentBlockKey)

    // console.log("selectionState currentBlockIndex", currentBlockIndex);

    return {
      editorState,
      rawContent,
    }
  }


  getCompositeDecorator = () => {
    const decorators = [
      ...this.props.decorators,
      linkDecorator({
      }),
    ];

    // console.log("decorators", decorators);
    return new CompositeDecorator(decorators);
    // return new CompositeDecorator([]);
  }


  componentDidUpdate(prevProps, prevState) {

    const {
      value: prevValue,
    } = prevProps;

    const {
      value,
    } = this.props;

    const {
      rawContent,
    } = this.state;

    // console.log("componentDidUpdate", value === prevValue);
    // console.log("componentDidUpdate rawContent", value === rawContent);

    if ((value !== undefined && rawContent !== undefined) && value !== rawContent) {

      if (value !== prevValue) {
        const {
          editorState,
        } = this.initState(value);

        this.onChange(editorState);
      }

    }
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

    // console.log("PrismaEditor onChange editorState", editorState);

    const currentContent = editorState.getCurrentContent();

    // console.log("PrismaEditor onChange editorState.getCurrentContent()", currentContent);

    const rawContent = convertToRaw(currentContent);

    // console.log("PrismaEditor onChange editorState convertToRaw", rawContent);

    this.setState({
      editorState,
    }, () => {

      const {
        onChange,
      } = this.props;

      Object.assign(this.state, {
        rawContent,
      });

      onChange && onChange(rawContent, editorState);

    });

  };

  // onChange = (editorState) => {

  //   console.log("PrismaEditor onChange editorState", editorState);

  //   const currentContent = editorState.getCurrentContent();

  //   console.log("PrismaEditor onChange editorState.getCurrentContent()", currentContent);

  //   const rawContent = convertToRaw(currentContent);

  //   console.log("PrismaEditor onChange editorState convertToRaw", rawContent);



  //   const currentBlockKey = editorState.getSelection().getStartKey()
  //   const currentBlockIndex = editorState.getCurrentContent().getBlockMap()
  //     .keySeq().findIndex(k => k === currentBlockKey)

  //   console.log("PrismaEditor onChange currentBlockIndex", currentBlockIndex);



  //   let selectionState = editorState.getSelection();

  //   console.log("PrismaEditor onChange", selectionState);

  //   var anchorKey = selectionState.getAnchorKey();

  //   console.log("PrismaEditor onChange anchorKey", anchorKey);

  //   var start = selectionState.getStartOffset();
  //   var end = selectionState.getEndOffset();

  //   console.log("PrismaEditor onChange start end", start, end);

  //   var currentContentBlock = currentContent.getBlockForKey(anchorKey);

  //   var selectedText = currentContentBlock.getText().slice(start, end);

  //   console.log("PrismaEditor onChange selectedText", selectedText);


  //   console.log("PrismaEditor onChange currentBlockIndex", currentBlockIndex);

  //   const {
  //     onChange,
  //   } = this.props;

  //   onChange && onChange(rawContent, editorState);

  // };



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




  keyBinding(event) {

    console.log("keyBinding", event.keyCode);
    // console.log("keyBinding hasCommandModifier", hasCommandModifier(event));

    // if (event.keyCode === 83 && hasCommandModifier(event)) {
    //   return 'myeditor-save';
    // }

    // if (event.keyCode === 67 && hasCommandModifier(event)) {
    //   return 'copy';
    // }

    return getDefaultKeyBinding(event);
  }


  // blockRenderer = (block) => {
  getBlockRenderMap() {

    const {
      plugins,
      defaultBlockRenderMap,
    } = this.props;

    let blockRenderMap = plugins
      .filter((plug) => plug.blockRenderMap !== undefined)
      .reduce((maps, plug) => maps.merge(plug.blockRenderMap), Map({}));

    console.log("blockRenderMap", blockRenderMap);
    if (defaultBlockRenderMap) {
      blockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);
    }

    console.log("blockRenderMap", blockRenderMap);

    if (this.props.blockRenderMap) {
      blockRenderMap = blockRenderMap.merge(this.props.blockRenderMap);
    }

    console.log("blockRenderMap", blockRenderMap);

    return blockRenderMap;
  };


  blockRenderer = (block, a, b, c) => {

    // console.log("blockRenderer block type", block.getType());
    // console.log("blockRenderer block type", block, a, b, c);

      return {
        sdfdsf33333333: "fgfdgfd",
        props: {
          sdfdsf222222222: "fgfdgfd",
        },
        customConfig: {
          sdfdsf55555555555: "fgfdgfd",
        },
      };

    return null;

    // if (block.getType() === 'atomic') {

    //   if (this.props.fullView !== true && this.state.inEditMode !== true) {

    //     return {
    //       component: Expander,
    //       props: {
    //         expand: setFullView,
    //       },
    //     };
    //   }

    //   return {
    //     component: TextBlock,
    //     editable: false,
    //     props: {
    //       allow_edit: this.state.inEditMode,
    //       _insertText: this._insertText,
    //       fullView: this.props.fullView === true || this.state.inEditMode === true,
    //       onStartEdit: (blockKey) => {
    //         // alert('onStartEdit');
    //         var { liveTeXEdits } = this.state;
    //         this.setState({ liveTeXEdits: liveTeXEdits.set(blockKey, true) });
    //       },
    //       onFinishEdit: (blockKey, newContentState) => {
    //         // alert('onFinishEdit');
    //         var { liveTeXEdits } = this.state;

    //         let editorState = EditorState.createWithContent(newContentState);

    //         EditorState.set(editorState, { decorator: decorator });

    //         this.setState({
    //           liveTeXEdits: liveTeXEdits.remove(blockKey),
    //           editorState: editorState,
    //         });
    //       },
    //       onRemove: (blockKey) => this._removeTeX(blockKey),
    //     },
    //   };
    // }

    // else if (block.getType() === 'image') {

    //   if (this.props.fullView !== true && this.state.inEditMode !== true) {

    //     return {
    //       component: Expander,
    //       props: {
    //         expand: setFullView,
    //       },
    //     };
    //   }

    //   return {
    //     component: ImageBlock,
    //     editable: false,
    //     props: {
    //     },
    //   };
    // }



    // return null;

    return {
      component: props => {
        console.log("block props", props);

        // return props;

        const {
          block,
          blockRenderMap,
          blockRendererFn,
          blockStyleFn,
          contentState,
          decorator,
          editorKey,
          editorState,
          customStyleFn,
          customStyleMap,
          direction,
          forceSelection,
          selection,
          tree,
        } = props;


        const blockKey = block.getKey();

        let text = block.getText();

        const decorations = decorator.getDecorations(block, contentState);

        console.log("block props decorator.getDecorations", decorations);

        decorations.map(key => {

          if (!key) {
            return;
          }

          console.log("block props decorator.getDecorations component key", key);
          console.log("block props decorator.getDecorations component", decorator.getComponentForKey(key));

        })


        const selectionStartBlockKey = selection.getStartKey();
        const selectionEndBlockKey = selection.getEndKey();
        const selectionStartPosition = selection.getStartOffset();
        const selectionEndPosition = selection.getEndOffset();


        console.log("block props selection", selectionStartBlockKey, selectionEndBlockKey, selectionStartPosition, selectionEndPosition);

        const customClass = blockStyleFn(block);

        console.log("block props customClass", customClass);

        let output = "";

        [...text].map(char => {
          // output.push(char);
          output += char;
        })

        console.log("block props decorator.getDecorations output", output);

        // return <div
        //   key={blockKey}
        // >
        //   {text}
        // </div>

        return <div
          key={blockKey}
          className={customClass}
        >
          {output}
          <input
            type="text"
            // onMouseEnter={event => {
            // onClick={event => {
            onMouseDown={event => {
              console.log("Input onMouseEnter", event);
              // event.preventDefault();
              // event.stopPropagation();
              // return 'handled';
              this.startCustomBlockEdit();
            }}
            // onMouseLeave={event => {
            onBlur={event => {
              console.log("Input onMouseLeave", event);
              // event.preventDefault();
              // event.stopPropagation();
              // return 'handled';
              this.endCustomBlockEdit();
            }}
          />
        </div>

        // return <table
        //   border="1"
        // >
        //   <tbody>

        //     <tr>
        //       <td>
        //         wefwe
        //     </td>
        //       <td>
        //         dsfsdg
        //     </td>
        //       <td>
        //         dsfsdgdefewf
        //     </td>
        //     </tr> 

        //   </tbody>
        // </table>

      },
      props: {
        sdfds1111111111111: 234234,
      },
    };
  }


  startCustomBlockEdit() {
    const {
      inEditBlocksCount = 0,
    } = this.state;
    this.setState({
      inEditBlocksCount: inEditBlocksCount + 1,
    });
  }

  endCustomBlockEdit() {
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

    console.log("handleKeyCommand", command);

    if (command === 'myeditor-save') {
      // Perform a request to save your contents, set
      // a new `editorState`, etc.
      return 'handled';
    }

    switch (command) {

      case "bold":
        return this.toggleInlineStyle("BOLD");
        break;

      case "italic":
        return this.toggleInlineStyle("ITALIC");
        break;

      case "underline":
        return this.toggleInlineStyle("UNDERLINE");
        break;

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
      // defaultBlockRenderMap,
      ...other
    } = this.props;

    const {
      editorState,
      inEditBlocksCount,
    } = this.state;



    // const controlProps = {
    //   editorState,
    //   onChange: this.onChange,
    // };

    console.log("inEditBlocksCount", inEditBlocksCount);

    return (
      <div
        className={[classes.root, !readOnly ? "PrismaEditor--editable" : ""].join(" ")}
      >

        {!readOnly
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

              {/* <Grid
                item
              >
                <IconButton
                  // onClick={() => this.toggleInlineStyle("UNDERLINE")}
                  className={classes.iconButton}
                >
                  <ListBulletedIcon />
                </IconButton>
              </Grid> */}

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
                />
              </Grid>

              {/* <Grid
                item
              >
                <ListControl
                  // onClick={() => this.toggleInlineStyle("UNDERLINE")}
                  editorState={editorState}
                  onChange={this.onChange}
                  className={classes.iconButton}
                />

              </Grid> */}

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
          // onFocus={event => {
          //   console.log("Editor onFocus", event);
          //   // event.preventDefault();
          //   // event.stopPropagation();
          // }}
          {...other}
        />
      </div>
    );
  }
}

export default withStyles(styles)(PrismaEditor);