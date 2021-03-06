import ReduxWordPress from '../lib/index';
import * as reduxwp from '../lib/index';

test('Check default export', () => {
	expect(typeof ReduxWordPress.createReducer).toBe('function');
	expect(typeof ReduxWordPress.createActions).toBe('function');
	expect(typeof ReduxWordPress.createRequests).toBe('function');
});

test('Check named export', () => {
	expect(typeof reduxwp.createReducer).toBe('function');
	expect(typeof reduxwp.createActions).toBe('function');
	expect(typeof reduxwp.createRequests).toBe('function');
});