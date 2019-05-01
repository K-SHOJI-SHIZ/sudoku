import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './js/pages/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
