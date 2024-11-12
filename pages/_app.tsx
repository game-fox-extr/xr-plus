// pages/_app.js
import React from 'react';
// import '../styles/index.scss'; // Import global CSS here

function MyApp({ Component, pageProps } : any) {
  return <Component {...pageProps} />;
}

export default MyApp;
