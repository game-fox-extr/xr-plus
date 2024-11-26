export const metadata = {
  title: 'Multiplayer Game Fox',
  description: 'A multiplayer gaming experience',
}

export default function RootLayout({ children } : any) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/media/sflogo.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/media/sflogo.svg" />
        <link rel="icon" type="image/svgLogo" sizes="32x32" href="/media/sflogo.svg" />
        <link rel="icon" type="image/svgLogo" sizes="16x16" href="/media/sflogo.svg" />
        <link rel="manifest" href="/media/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>{children}</body>
    </html>
  )
}
