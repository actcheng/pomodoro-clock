import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentDidMount () {
      const script = document.createElement("script");
      script.src = "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";
      script.async = true;
      document.body.appendChild(script);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
