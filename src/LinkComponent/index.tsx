import React from 'react'
import Link, { LinkProps } from 'next/link'

const LinkComponent: React.FC<
  React.PropsWithChildren<LinkProps> & { to?: string }
> = (props) => {
  const { href, to, children, ...other } = props

  return (
    <Link href={href || to || ''} {...other}>
      {children}
    </Link>
  )
}

export default LinkComponent
