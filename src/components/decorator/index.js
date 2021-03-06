import { Component } from 'react'
import PropTypes from 'prop-types'

import {
  // RichUtils,
  EditorState,
  ContentState,
  // Modifier,
} from 'draft-js-android-fix'

class PrismaDecorator extends Component {
  static propTypes = {
    entityKey: PropTypes.string.isRequired,
    children: PropTypes.array,
    contentState: PropTypes.object,
    onEditStart: PropTypes.func.isRequired,
    onEditEnd: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    getEditorState: PropTypes.func.isRequired,
    isReadOnly: PropTypes.func.isRequired,
  }

  static contextTypes = {}

  state = {
    editing: false,
    showEditor: false,
  }

  startEdit = () => {
    // event.preventDefault();
    // event.stopPropagation();

    const { editing } = this.state

    const { onEditStart } = this.props

    if (!editing) {
      this.setState({
        editing: true,
      })

      onEditStart()
    }

    return
  }

  endEdit = () => {
    // event.preventDefault();
    // event.stopPropagation();

    const { editing } = this.state

    const { onEditEnd } = this.props

    if (editing) {
      this.setState({
        editing: false,
      })

      onEditEnd()
    }

    return
  }

  showEditor = () => {
    // event.preventDefault();
    // event.stopPropagation();

    this.setState({
      showEditor: true,
    })
  }

  hideEditor = () => {
    this.setState({
      showEditor: false,
    })
  }

  updateData = (data) => {
    const { entityKey, contentState, getEditorState, onChange } = this.props

    const blocksArray = contentState.getBlocksAsArray()

    let newContentState = ContentState.createFromBlockArray(blocksArray)
    newContentState = newContentState.mergeEntityData(entityKey, data)

    const editorState = getEditorState()

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'change-block-data'
    )

    onChange(newEditorState)

    this.forceUpdate()
  }

  // componentWillReceiveProps(nextProps, nextState) {

  // }

  getCurrentEntity() {
    const { entityKey, contentState } = this.props

    return contentState.getEntity(entityKey)
  }

  getEntityRange(editorState, entityKey) {
    const block = this.getSelectedBlock(editorState)
    let entityRange
    block.findEntityRanges(
      (value) => value.get('entity') === entityKey,
      (start, end) => {
        entityRange = {
          start,
          end,
          text: block.get('text').slice(start, end),
        }
      }
    )
    return entityRange
  }

  /**
   * Function returns the first selected block.
   */
  getSelectedBlock(editorState) {
    if (editorState) {
      return this.getSelectedBlocksList(editorState).get(0)
    }
    return undefined
  }

  getSelectedBlocksList(editorState) {
    return this.getSelectedBlocksMap(editorState).toList()
  }

  getSelectedBlocksMap(editorState) {
    const selectionState = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const startKey = selectionState.getStartKey()
    const endKey = selectionState.getEndKey()
    const blockMap = contentState.getBlockMap()
    return blockMap
      .toSeq()
      .skipUntil((_, k) => k === startKey)
      .takeUntil((_, k) => k === endKey)
      .concat([[endKey, blockMap.get(endKey)]])
  }
}

export default PrismaDecorator
