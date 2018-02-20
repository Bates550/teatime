import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Header />
        <Body />
        <Footer />
      </div>
    );
  }
}

export default App;
