import React from 'react'
import Head from 'next/head'
import App, { PrismaCmsEditorRawContent } from 'src'

const MainPage: React.FC = (props) => {

  const rawContent: PrismaCmsEditorRawContent = { "blocks": [{ "key": "e6g02", "text": "Test content", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }], "entityMap": {} };


  return (
    <>
      <Head>
        <title>Component boilerplate</title>
        <meta
          name="description"
          content="Component boilerplate for prisma-cms"
        />
      </Head>
      <App
        {...props}
        editorKey="test-editor"
        value={rawContent}
        readOnly={false}
      />
    </>
  )
}

export default MainPage
