import React from 'react';
import ReactDOM from 'react-dom';
import SpaceNavigator from './SpaceNavigator';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SpaceNavigator />, div);
    ReactDOM.unmountComponentAtNode(div);
});
