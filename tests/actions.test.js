import createActions from '../src/actions';

test('Check actions created by createActions function', () => {
	const actions = createActions('test-rest-api', 'http://wordpress.test/wp-json/', ['books', 'authors']);

	expect(typeof actions.fetchBooks).toBe('function');
	expect(typeof actions.fetchAuthors).toBe('function');
});