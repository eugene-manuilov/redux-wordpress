import { createActions } from '../lib/index';

test('Check actions created by createActions function', () => {
	const actions = createActions('test-rest-api', 'http://wordpress.test/wp-json/', ['books', 'authors']);

	expect(typeof actions.fetchBooks).toBe('function');
	expect(typeof actions.fetchBooksById).toBe('function');
	expect(typeof actions.fetchAuthors).toBe('function');
	expect(typeof actions.fetchAuthorsById).toBe('function');
});