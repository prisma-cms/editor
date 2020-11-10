import React from 'react';
import { render } from '@testing-library/react'
 
const contentStr = `
  <div>
    Test content
    <ul>
      <li>Row 1</li>
      <li>Row 2</li>
    </ul>
  <div>  
`;


describe('Editor', () => {

  it('Render Editor with mocked generateRandomKey', () => {

    /**
     * Mock generateRandomKey();
     * But for production this not allowed, so if you use React.hydrate and SSR,
     * you'l get error for wrong data-offset-key
     */
    jest.mock('draft-js-android-fix/lib/generateRandomKey', () => {

      let count = 0;

      return () => {

        console.log("test generateRandomKey mock default");

        count++;

        return count;
      };
    });

    const Component = require('../../App').default;

    const editorKey = "test-editor";

    const tree = render(<Component
      editorKey={editorKey}
      value={contentStr}
    />)

    expect(tree.container).toMatchSnapshot()

    const node = tree.container.children[0]

    /**
     * Check editorKey
     */
    expect(node.querySelector("[data-editor]").attributes.getNamedItem("data-editor").value).toBe(editorKey);

    /**
     * Check content
     */
    // expect(node.querySelector("[data-text=true]")?.innerHTML).toBe(contentStr);
  });

})
