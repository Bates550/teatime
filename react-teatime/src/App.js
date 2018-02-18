import React, { Component } from 'react';
import './App.css';
import Header from './Header';
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
        <div
          className="body"
          style={{
            height: '100vh',
            width: '100%',
          }}
        />
        <Footer />
      </div>
    );
  }
}

export default App;
