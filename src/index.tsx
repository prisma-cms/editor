import React, { PureComponent } from 'react';
// import PropTypes from "prop-types";

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
  DraftDecorator,
  ContentBlock,
  DraftEditorCommand,
  DraftHandleValue,
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

import LinkComponent from './LinkComponent';

import ImageBlock from './blocks/image';
import { PrismaCmsEditorProps, PrismaCmsEditorRawContent, PrismaCmsEditorState } from './interfaces';

export * from './interfaces';

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



export class PrismaEditor<P extends PrismaCmsEditorProps = PrismaCmsEditorProps, S extends PrismaCmsEditorState = PrismaCmsEditorState>
  extends PureComponent<P, S> {

  // static propTypes = {
  //   classes: PropTypes.object.isRequired,
  //   value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  //   readOnly: PropTypes.bool.isRequired,
  //   spellCheck: PropTypes.bool.isRequired,
  //   decorators: PropTypes.array,
  //   defaultBlockRenderMap: PropTypes.bool.isRequired,

  //   plugins: PropTypes.array.isRequired,
  //   show_toolbar: PropTypes.bool.isRequired,
  //   LinkComponent: PropTypes.func.isRequired,
  // }

  static defaultProps = {
    readOnly: true,
    spellCheck: true,
    decorators: [],
    defaultBlockRenderMap: true,
    plugins: [],
    show_toolbar: true,
    LinkComponent,
  }


  constructor(props: P) {

    super(props);

    const {
      value,
    } = props;

    const {
      editorState,
      rawContent,
    } = this.initState(value);

    this.state = {
      ...this.state,
      editorState,
      rawContent,
      allowRender: global.document !== undefined && value && typeof value === "object",
    };

  }


  componentDidMount() {
    super.componentDidMount && super.componentDidMount();

    if (!this.state.allowRender) {
      this.setState({
        allowRender: true,
      });
    }
  }


  initState(value: PrismaCmsEditorRawContent | string | undefined) {

    let editorState;
    const rawContent = value;

    const compositeDecorator = this.getCompositeDecorator();

    // console.log('initState value', value);

    if (value) {

      if (typeof value === "object") {
        const contentState = convertFromRaw(value);
        editorState = EditorState.createWithContent(contentState, compositeDecorator);
      }
      else if (typeof value === "string" && global.document !== undefined) {
        const blocks = convertFromHTML(value);

        // const contentState = ContentState.createFromBlockArray(blocks);
        const contentState = ContentState.createFromBlockArray(blocks.contentBlocks);
        editorState = EditorState.createWithContent(contentState, compositeDecorator);

      }
    }


    if (!editorState) {
      editorState = EditorState.createEmpty(compositeDecorator);
    }

    return {
      editorState,
      rawContent,
    }
  }


  getCompositeDecorator = () => {

    const decoratorsProps = this.props.decorators ?? [];

    const decorators: DraftDecorator[] = [
      ...decoratorsProps,
      linkDecorator({
        props: {
          onEditStart: this.onEditStart,
          onEditEnd: this.onEditEnd,
          onChange: this.onChange,
          getEditorState: this.getEditorState,
          isReadOnly: this.isReadOnly,
          Component: this.props.LinkComponent,
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


  componentDidUpdate(prevProps: P) {

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
    // eslint-disable-next-line no-empty
    if (readOnly !== prevReadOnly && readOnly) { }
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



  onChange = (editorState: EditorState) => {

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

  };


  keyBinding(event: React.KeyboardEvent) {


    return getDefaultKeyBinding(event);
  }


  getBlockRenderMap() {

    const {
      plugins = [],
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


  blockRenderer = (block: ContentBlock) => {


    if (block.getType() === 'atomic') {

      return {
        component: TextBlock,
        editable: false,
        props: {
          allow_edit: !this.isReadOnly(),
          onStartEdit: this.onEditStart,
          onFinishEdit: (_blockKey: string, newContentState: ContentState) => {

            const {
              editorState,
            } = this.state;

            const newEditorState = EditorState.push(editorState, newContentState, 'change-block-type');

            this.onChange(newEditorState);

            this.onEditEnd();

          },
          _insertText: this._insertText,
          onRemove: (blockKey: string) => this._removeTeX(blockKey),
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

  _removeTeX = (blockKey: string) => {



    const {
      editorState,
    } = this.state;

    const contentState = editorState.getCurrentContent()
    const newBlockMap = contentState.getBlockMap().delete(blockKey)  // this is the important one that actually deletes a block
    const newContentState = contentState.set('blockMap', newBlockMap) as ContentState;
    // const newEditorState = EditorState.push(editorState, newContentState, 'remove-block')
    const newEditorState = EditorState.push(editorState, newContentState, 'split-block')

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


  toggleInlineStyle(style: string): DraftHandleValue {
    this.onChange(toggleInlineStyle(this.state.editorState, style));

    return "handled";
  }

  handleKeyCommand = (command: DraftEditorCommand | string): DraftHandleValue => {



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

      default: ;

    }

    return 'not-handled';
  }


  render() {

    const {
      classes,
      readOnly,
      // decorators,
      // plugins,
      // onChange,
      value,
      // blockRenderMap,
      // defaultBlockRenderMap,
      className,
      show_toolbar,
      // ...other
    } = this.props;

    const {
      editorState,
      inEditBlocksCount,
      allowRender,
    } = this.state;


    // const selectionState = editorState.getSelection();

    // console.log("render value", value, typeof value);

    if (!allowRender || value === undefined) {
      return null;
    }


    return (
      <div
        className={[className, classes?.root, !readOnly ? "PrismaEditor--editable" : ""].join(" ")}
      >

        {!readOnly && show_toolbar
          ?
          <div
            className={classes?.menu}
          >
            <Grid
              container
            >

              <Grid
                item
              >
                <IconButton
                  // TODO remove arrow function
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => this.toggleInlineStyle("BOLD")}
                  className={classes?.iconButton}
                >
                  <BoldIcon />
                </IconButton>
              </Grid>

              <Grid
                item
              >
                <IconButton
                  // TODO remove arrow function
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => this.toggleInlineStyle("ITALIC")}
                  className={classes?.iconButton}
                >
                  <ItalicIcon />
                </IconButton>
              </Grid>

              <Grid
                item
              >
                <IconButton
                  // TODO remove arrow function
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => this.toggleInlineStyle("UNDERLINE")}
                  className={classes?.iconButton}
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
                  className={classes?.iconButton}
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
                  className={classes?.iconButton}
                  icon={ListNumberedIcon}
                />
              </Grid>

              <Grid
                item
              >
                <LinkControl
                  className={classes?.iconButton}
                  editorState={editorState}
                  onChange={this.onChange}
                // disabled={!textSelected}
                />
              </Grid>

              <Grid
                item
              >
                <IconButton
                  className={classes?.iconButton}
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
        // {...other}
        />


      </div>
    );
  }
}

export default withStyles(styles)((props: PrismaCmsEditorProps) => <PrismaEditor
  {...props}
/>);
