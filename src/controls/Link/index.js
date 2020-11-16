
import PropTypes from 'prop-types';

import {
  // RichUtils,
  EditorState,
  Modifier,
} from 'draft-js-android-fix';

import LinkIcon from "material-ui-icons/Link";

import ToggleBlockType from "../ToggleBlockType";

import decorator from "./decorator";
export { decorator };


export default class LinkControl extends ToggleBlockType {

  static propTypes = {
    // eslint-disable-next-line react/forbid-foreign-prop-types
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


  // addLink = (linkTitle, linkUrl, linkUrlOption) => {
  addLink = () => {

    let linkTitle,
      linkUrl,
      linkTarget
      ;

    const {
      editorState,
      onChange,
    } = this.props;

    const currentEntity = this.getCurrentEntity();



    const selectionText = this.getSelectionText(editorState);

    if (!selectionText) {
      return;
    }
    else {
      linkTitle = selectionText;
    }



    // return;

    // const { currentEntity } = this.state;

    const selection = editorState.getSelection();

    if (currentEntity) {
      // const entityRange = getEntityRange(editorState, currentEntity);
      // selection = selection.merge({
      //   anchorOffset: entityRange.start,
      //   focusOffset: entityRange.end,
      // });
    }
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('LINK', 'MUTABLE', {
        url: linkUrl,
        target: linkTarget,
      })
      .getLastCreatedEntityKey();




    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      `${linkTitle}`,
      editorState.getCurrentInlineStyle(),
      entityKey,
    );





    // return;

    /**
     * В версии 0.11-alpha здесь ломается. 
     * https://draftjs.org/docs/v0-10-api-migration.html#content
     */
    const newEditorState = EditorState.push(editorState, contentState, 'insert-characters');



    // return;

    // insert a blank space after link
    // selection = newEditorState.getSelection()
    // selection = newEditorState.getSelection().merge({
    //   anchorOffset: selection.get('anchorOffset') + linkTitle.length,
    //   focusOffset: selection.get('anchorOffset') + linkTitle.length,
    // });
    // newEditorState = EditorState.acceptSelection(newEditorState, selection);

    // contentState = Modifier.insertText(
    //   newEditorState.getCurrentContent(),
    //   selection,
    //   ' ',
    //   newEditorState.getCurrentInlineStyle(),
    //   undefined,
    // );

    onChange(EditorState.push(newEditorState, contentState, 'insert-characters'));
    // this.doCollapse();
  };


  toggleBlockType = () => {

    // const {
    //   onChange,
    //   editorState,
    //   blockType,
    // } = this.props;

    // this.addLink("test link", "https://modxclub.ru")

    // const newState = RichUtils.toggleBlockType(
    //   editorState,
    //   blockType,
    // );

    // if (newState) {
    //   onChange(newState);
    // }

    const action = this.getCurrentAction();

    if (action) {
      return action();
    }
  };


  getCurrentAction() {

    let action;

    const isSelected = this.isTextSelected();

    if (isSelected) {
      action = this.addLink;
    }

    return action;
  }


  isDisabled() {

    const {
      disabled,
      // editorState,
    } = this.props;


    const action = this.getCurrentAction();



    return disabled || !action;
  }

  // componentWillReceiveProps(nextProps, nextState) {

  // }

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
