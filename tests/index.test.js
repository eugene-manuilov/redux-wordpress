import ReduxWordPress from '../src/index';
import * as reduxwp from '../src/index';

test('Check default export', () => {
	expect(typeof ReduxWordPress.reducer).toBe('function');
	expect(typeof ReduxWordPress.createReducer).toBe('function');
	expect(typeof ReduxWordPress.createActions).toBe('function');
});

test('Check named export', () => {
	expect(typeof reduxwp.createReducer).toBe('function');
	expect(typeof reduxwp.createActions).toBe('function');
});