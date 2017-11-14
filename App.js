import React from 'react';
import TheApp from './src/app';
//expo wants to use this file for mobile apps, 
//so just import the main app
//from the web app to use here
export default function App() {
  return <TheApp />
}