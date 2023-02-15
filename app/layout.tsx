import '../styles/global.css'

import { Header } from '../components/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />

      <body>
        <Header />
        <div className='px-content py-10 pb-24'>{children}</div>
      </body>
    </html>
  )
}
