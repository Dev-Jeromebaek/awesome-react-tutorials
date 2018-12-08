import React from 'react';
import ReactDOM from 'react-dom';
import ViewerTemplate from './ViewerTemplate';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ViewerTemplate />, div);
    ReactDOM.unmountComponentAtNode(div);
});
