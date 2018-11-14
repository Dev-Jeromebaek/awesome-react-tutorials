import React, { Component } from 'react';

import PaletteContainer from '../containers/PaletteContainer';
import CounterContainer from '../containers/CounterContainer';
import WaitingListContainer from '../containers/WaitingListContainer';

class App extends Component {
  render() {
    return (
      <div>
        <PaletteContainer />
        <CounterContainer />
        <WaitingListContainer />
      </div>
    );
  }
}

export default App;
