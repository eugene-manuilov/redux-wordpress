import ReduxWordPress from '../src/index';
import * as reduxwp from '../src/index';

test('Check default export', () => {
	expect(ReduxWordPress.reducer).toBeDefined();
	expect(typeof ReduxWordPress.reducer).toBe('function');

	expect(ReduxWordPress.createReducer).toBeDefined();
	expect(typeof ReduxWordPress.createReducer).toBe('function');

	expect(ReduxWordPress.createActions).toBeDefined();
	expect(typeof ReduxWordPress.createActions).toBe('function');
});

test('Check named export', () => {
	expect(reduxwp.createReducer).toBeDefined();
	expect(typeof reduxwp.createReducer).toBe('function');

	expect(reduxwp.createActions).toBeDefined();
	expect(typeof reduxwp.createActions).toBe('function');
});