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


  // static childContextTypes = {
  //   onEditStart: PropTypes.func,
  //   onEditEnd: PropTypes.func,
  // }


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


  // getChildContext() {

  //   return {
  //     onEditStart: this.onEditStart.bind(this),
  //     onEditEnd: this.onEditEnd.bind(this),
  //   };
  // }


  initState(value) {

    let editorState;
    let rawContent;

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



    var anchorKey = selectionState.getAnchorKey();



    var start = selectionState.getStartOffset();
    var end = selectionState.getEndOffset();



    var currentContent = editorState.getCurrentContent();
    var currentContentBlock = currentContent.getBlockForKey(anchorKey);

    var selectedText = currentContentBlock.getText().slice(start, end);



    const currentBlockKey = editorState.getSelection().getStartKey()
    const currentBlockIndex = editorState.getCurrentContent().getBlockMap()
      .keySeq().findIndex(k => k === currentBlockKey)



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




    if (
      ((value !== undefined && rawContent !== undefined) && value !== rawContent && value !== prevValue)
      || readOnly !== prevReadOnly
    ) {

      const {
        editorState,
      } = this.initState(value);

      this.onChange(editorState);

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



    const currentContent = editorState.getCurrentContent();



    const rawContent = convertToRaw(currentContent);



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



  //   const currentContent = editorState.getCurrentContent();



  //   const rawContent = convertToRaw(currentContent);





  //   const currentBlockKey = editorState.getSelection().getStartKey()
  //   const currentBlockIndex = editorState.getCurrentContent().getBlockMap()
  //     .keySeq().findIndex(k => k === currentBlockKey)





  //   let selectionState = editorState.getSelection();



  //   var anchorKey = selectionState.getAnchorKey();



  //   var start = selectionState.getStartOffset();
  //   var end = selectionState.getEndOffset();



  //   var currentContentBlock = currentContent.getBlockForKey(anchorKey);

  //   var selectedText = currentContentBlock.getText().slice(start, end);






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



    if (defaultBlockRenderMap) {
      blockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);
    }



    if (this.props.blockRenderMap) {
      blockRenderMap = blockRenderMap.merge(this.props.blockRenderMap);
    }



    return blockRenderMap;
  };


  blockRenderer = (block, a, b, c) => {




    // return {
    //   sdfdsf33333333: "fgfdgfd",
    //   props: {
    //     sdfdsf222222222: "fgfdgfd",
    //   },
    //   customConfig: {
    //     sdfdsf55555555555: "fgfdgfd",
    //   },
    // };

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



        decorations.map(key => {

          if (!key) {
            return;
          }




        })


        const selectionStartBlockKey = selection.getStartKey();
        const selectionEndBlockKey = selection.getEndKey();
        const selectionStartPosition = selection.getStartOffset();
        const selectionEndPosition = selection.getEndOffset();




        const customClass = blockStyleFn(block);



        let output = "";

        [...text].map(char => {
          // output.push(char);
          output += char;
        })



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

              // event.preventDefault();
              // event.stopPropagation();
              // return 'handled';
              this.onEditStart();
            }}
            // onMouseLeave={event => {
            onBlur={event => {

              // event.preventDefault();
              // event.stopPropagation();
              // return 'handled';
              this.onEditEnd();
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





    const selectionState = editorState.getSelection();

    // const textSelected = selectionState && (selectionState.getEndOffset() - selectionState.getStartOffset() !== 0);


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
                // disabled={!textSelected}
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

          //   // event.preventDefault();
          //   // event.stopPropagation();
          // }}
          {...other}
        />

        <div>
          getStartOffset: {selectionState.getStartOffset()}
        </div>
        <div>
          getEndOffset: {selectionState.getEndOffset()}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PrismaEditor);