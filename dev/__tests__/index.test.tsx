import React from 'react'
import styled from 'styled-components'
import Component, { PrismaCmsEditorProps } from 'src'

import { render } from 'dev/tests/utils'

const border = '1px solid green'

const ComponentStyled = styled(Component)`
  color: ${({ theme }) => theme.colors.primary};

  border: ${border};
`

const editorProps: PrismaCmsEditorProps = {
  editorKey: 'test-editor',
  value: 'Test content',
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

  it('Render styled', () => {
    const tree = render(<ComponentStyled {...editorProps} />)
    const node = tree.container.children[0]
    // expect(tree.container).toMatchSnapshot()
    // expect(node).toMatchSnapshot()
    expect(node).toHaveStyleRule('border', border)
  })
})
