import React from 'react'
import styled from 'styled-components'
import Component, { PrismaCmsEditorProps, PrismaCmsEditorRawContent } from 'src'

import { render } from 'dev/tests/utils'

const border = '1px solid green'

const ComponentStyled = styled(Component)`
  color: ${({ theme }) => theme.colors.primary};

  border: ${border};
`


const rawContent: PrismaCmsEditorRawContent = { "blocks": [{ "key": "e6g02", "text": "Test content", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }], "entityMap": {} };


const editorProps: PrismaCmsEditorProps = {
  editorKey: 'test-editor',
  // value: 'Test content',
  value: rawContent,
}

const editorPropsWithContent: PrismaCmsEditorProps = {
  editorKey: 'test-editor',
  value: rawContent,
}


describe('Component', () => {
  it('Render Editor with undefined value', () => {
    const editorKey = 'test-editor'

    const tree = render(<Component editorKey={editorKey} value={undefined} />)

    expect(tree.container).toMatchSnapshot()

    const node = tree.container.children[0]

    /**
     * Should not be rendered Editor
     */
    expect(node).toBeUndefined()
  })

  it('Render default', () => {
    render(<Component {...editorProps} />)
    // expect(tree.container).toMatchSnapshot()
  })

  it('Render with object value', () => {
    const tree = render(<Component {...editorPropsWithContent} />)
    expect(tree.container).toMatchSnapshot()
  })

  it('Render styled', () => {
    const tree = render(<ComponentStyled {...editorPropsWithContent} />)
    const node = tree.container.children[0]
    expect(tree.container).toMatchSnapshot()
    // expect(node).toMatchSnapshot()
    expect(node).toHaveStyleRule('border', border)
  })

})
