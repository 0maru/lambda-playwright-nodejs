import * as React from 'react'

import { ChakraProvider } from '@chakra-ui/react'

export default function RootLayout(
  {
    children,
  } : {
    children : React.ReactNode
  }
) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
