import './globals.css'

export const metadata = {
  title: 'Investment Tax Calculator',
  description: 'Compare investment returns across different tax regimes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
