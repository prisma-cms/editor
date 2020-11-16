import React from 'react'
import Head from 'next/head'
import App from 'src'

const MainPage: React.FC = (props) => {
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
        value={'Some content'}
        readOnly={false}
      />
    </>
  )
}

export default MainPage
