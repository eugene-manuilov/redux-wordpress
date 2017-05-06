import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createActions, createRequests } from './lib/index';

global.fetch = require('jest-fetch-mock');
global.mockStore = configureStore([thunk]);

global.name = 'test-rest-api';
global.endpoint = 'books';
global.endpoint2 = 'chapters';
global.params = { context: 'view' };

global.actions = createActions(name, 'http://wordpress.test/wp-json/', [global.endpoint]);
global.requests = createRequests('http://wordpress.test/wp-json/', [global.endpoint]);