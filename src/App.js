import React, { Component } from 'react';
import Clima from './components/Clima';

class App extends Component {
  render() {
    return (
      <div style={{padding: "10px", display: "flex", height: "100%"}}>
        <Clima/>
      </div>
    );
  }
}

export default App;
