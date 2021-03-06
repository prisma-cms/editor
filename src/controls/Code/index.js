/**
 * Copyright (c) 2013-present, Facebook, Inc. All rights reserved.
 *
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react'

import Chip from 'material-ui/Chip'

import prism from 'prismjs'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-smarty'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-graphql'
import withStyles from 'material-ui/styles/withStyles'

const CodeOutputBlockPropTypes = {}

const CodeOutputBlockDefaultProps = {
  lang: 'php',
}

const styles = (theme) => {
  if (!theme) {
    return {}
  }

  return {
    chip: {
      margin: theme.spacing.unit,
      height: 25,
      cursor: 'pointer',

      '&.active': {
        backgroundColor: theme.palette.secondary[500],

        '& .label': {
          color: theme.palette.secondary.contrastDefaultColor,
        },
      },
    },
    svgIcon: {},
    row: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
  }
}

class CodeOutputBlock extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lang: props.lang,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.lang !== this.state.lang) {
      this.setState({
        lang: nextProps.lang,
      })
    }

    return true
  }

  componentDidMount() {
    if (!this.props.content) {
      this.props.onClick()
    }
  }

  render() {
    let output

    // var language;
    let lang = this.state.lang

    if (typeof prism.languages[lang] == 'undefined') {
      console.error("Unsupported language '" + lang + "'")
      lang = this.defaultLang
    }

    if (this.props.content) {
      output = prism.highlight(this.props.content, prism.languages[lang])
    }

    return (
      <div
        className="text-content"
        dangerouslySetInnerHTML={{ __html: output }}
        onClick={this.props.onClick}
      />
    )
  }
}

CodeOutputBlock.propTypes = CodeOutputBlockPropTypes
CodeOutputBlock.defaultProps = CodeOutputBlockDefaultProps

const propTypes = {}

const defaultProps = {
  lang: 'php',
  // fullView: true,
}

export class TextBlock extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      lang: this._getLang() || props.lang,
      allow_edit: props.blockProps.allow_edit,
    }

    this._onClick = () => {
      // alert(!this.state.allow_edit);
      // alert(this.state.editMode);

      if (!this.state.allow_edit) {
        return
      }

      if (this.state.editMode) {
        return
      }

      this.setState(
        {
          editMode: true,
          textValue: this._getValue(),
        },
        () => {
          this._startEdit()
        }
      )
    }

    this._onValueChange = (evt) => {
      const value = evt.target.value
      this.setState({
        textValue: value,
      })
    }

    /*
     *   Сохранение.
     *   Если контента нет, то удаляем этот блок
     * */
    this._save = () => {
      const value = this.state.textValue

      if (value !== '') {
        const entityKey = this.props.block.getEntityAt(0)
        const newContentState = this.props.contentState.mergeEntityData(
          entityKey,
          {
            content: this.state.textValue,
            lang: this.state.lang,
          }
        )
        this.setState(
          {
            invalidTeX: false,
            editMode: false,
            textValue: null,
          },
          this._finishEdit.bind(this, newContentState)
        )
      } else {
        this._remove()
      }
    }

    this._remove = () => {
      this.props.blockProps.onRemove(this.props.block.getKey())
    }
    this._startEdit = () => {
      this.props.blockProps.onStartEdit(this.props.block.getKey())
    }
    this._finishEdit = (newContentState) => {
      this.props.blockProps.onFinishEdit(
        this.props.block.getKey(),
        newContentState
      )
    }
  }

  _getData() {
    const data = this.props.contentState
      .getEntity(this.props.block.getEntityAt(0))
      .getData()

    return data
  }

  _getValue() {
    const content = this._getData()['content']

    // if(
    //   this.state.editMode &&
    //   content == 'Кликните чтобы начать редактирование'
    // ){
    //   content = '';
    // }

    return content
  }

  _getLang() {
    const lang = this._getData()['lang']

    // if(
    //   this.state.editMode &&
    //   content == 'Кликните чтобы начать редактирование'
    // ){
    //   content = '';
    // }

    return lang
  }

  // _onTab(event) {
  //   this._onChange(RichUtils.onTab(event, this.state.editorState, 6));
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.blockProps.allow_edit !== this.state.allow_edit) {
      this.setState({
        allow_edit: nextProps.blockProps.allow_edit,
      })
    }

    return true
  }

  onLangClick = (event) => {
    const valueAttribute = event.currentTarget.attributes.getNamedItem('value')

    if (valueAttribute) {
      this.setState({
        lang: valueAttribute.value,
      })
    } else {
      console.error('Cannot get valueAttribute')
    }
  }

  render() {
    const { classes } = this.props

    const { allow_edit } = this.state

    let texContent = null
    if (this.state.editMode) {
      // if (this.state.invalidTeX) {
      //   texContent = '';
      // } else {
      //   texContent = this.state.textValue;
      // }

      texContent = this.state.textValue

      // if(texContent == 'Кликните чтобы начать редактирование'){
      //   texContent = '';
      // }
    } else {
      if (
        /**
         * Deprecated.
         * Раньше использовалось, чтобы вывести только текст, не выводя код.
         * Но это не юзабельно в чтении.
         */
        this.props.blockProps.fullView === false
      ) {
        return null
      }

      texContent = this._getValue()
    }

    let className = 'Editor-text'
    if (this.state.editMode) {
      className += ' Editor-activeText'
    }

    if (allow_edit) {
      className += ' edit'
    }

    let editPanel = null
    // if (this.state.allow_edit && this.state.editMode) {
    if (this.state.editMode) {
      const buttonClass = 'Editor-saveButton'
      // if (this.state.invalidTeX) {
      //   buttonClass += ' Editor-invalidButton';
      // }

      // let height = "40px";

      const langs = [
        {
          value: 'javascript',
          label: 'Javascript',
        },
        {
          value: 'jsx',
          label: 'JSX',
        },
        {
          value: 'graphql',
          label: 'Graphql',
        },
        {
          value: 'php',
          label: 'PHP',
        },
        {
          value: 'sql',
          label: 'SQL',
        },
        {
          value: 'css',
          label: 'CSS',
        },
        {
          value: 'html',
          label: 'HTML',
        },
        {
          value: 'smarty',
          label: 'Smarty',
        },
      ]

      const chips = []

      langs.map((item) => {
        const className = [classes.chip]

        if (item.value === this.state.lang) {
          className.push('active')
        }

        chips.push(
          <Chip
            key={item.value}
            label={item.label}
            value={item.value}
            className={className.join(' ')}
            labelClassName="label"
            onClick={this.onLangClick}
          />
        )

        return null
      })

      editPanel = (
        <div className="Editor-panel">
          <div className={classes.row}>{chips}</div>

          <textarea
            className="Editor-textValue"
            onChange={this._onValueChange}
            // ref="textarea"
            value={this.state.textValue}
          />
          <div className="Editor-buttons">
            <button
              className={buttonClass}
              disabled={this.state.invalidTeX}
              onClick={this._save}
            >
              {'Сохранить'}
            </button>
            <button className="Editor-removeButton" onClick={this._remove}>
              Удалить
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className={className}>
        <CodeOutputBlock
          content={texContent}
          lang={this.state.lang}
          onClick={this._onClick}
        />
        {editPanel}
      </div>
    )
  }
}

TextBlock.propTypes = propTypes
TextBlock.defaultProps = defaultProps

export default withStyles(styles)((props) => <TextBlock {...props} />)
