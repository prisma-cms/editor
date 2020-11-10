import React from 'react';
import { render } from '@testing-library/react'

import linkStateData from "../../dev/Renderer/pages/MainPage/TestApp/mock/data/link";

// const contentStr = `
//   <div>
//     Test content
//     <ul>
//       <li>Row 1</li>
//       <li>Row 2</li>
//     </ul>
//   <div>  
// `;


describe('LinkComponent', () => {

  it('Render Editor with custom LinkComponent', () => {

    /**
     * Mock generateRandomKey();
     * But for production this not allowed, so if you use React.hydrate and SSR,
     * you'l get error for wrong data-offset-key
     */
    jest.mock('draft-js-android-fix/lib/generateRandomKey', () => {

      let count = 0;

      return () => {

        count++;

        return count;
      };
    });

    const Component = require('../../App').default;

    const editorKey = "test-editor";

    const tree = render(<Component
      editorKey={editorKey}
      value={linkStateData}
      LinkComponent={({
        to: href,
        style,
        children,
        ...other
      }) => {
        // console.log("LinkComponent props", other);
        return <a {...other} href={href} style={{ ...style, color: "green" }} className="custom-link">{children}</a>;
      }}
    />)

    expect(tree.container).toMatchSnapshot()

    const node = tree.container.children[0]

    /**
     * Check editorKey
     */
    expect(node.querySelector("[data-editor]").attributes.getNamedItem("data-editor").value).toBe(editorKey);
    
    const customLinks = node.querySelectorAll(".custom-link");
    const allLinks = node.querySelectorAll("a");
    
    /**
     * Check links exists
     */
    expect(customLinks.length).toBeGreaterThan(0);
    
    /**
     * Check all links are custom
     */

    expect(customLinks.length).toEqual(allLinks.length);

  });

})
