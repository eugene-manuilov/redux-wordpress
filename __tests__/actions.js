import { createActions } from '../lib/index';

test('Check actions created by createActions function', () => {
	const actions = createActions('test-rest-api', 'http://wordpress.test/wp-json/', ['books', 'authors']);

	expect(typeof actions.fetchBooks).toBe('function');
	expect(typeof actions.fetchBooksEndpoint).toBe('function');
	expect(typeof actions.fetchBooksById).toBe('function');
	expect(typeof actions.fetchBooksEndpointById).toBe('function');
	expect(typeof actions.fetchAllBooks).toBe('function');
	expect(typeof actions.fetchAllBooksEndpoint).toBe('function');
	expect(typeof actions.fetchAllBooksEndpointById).toBe('function');

	expect(typeof actions.fetchAuthors).toBe('function');
	expect(typeof actions.fetchAuthorsEndpoint).toBe('function');
	expect(typeof actions.fetchAuthorsById).toBe('function');
	expect(typeof actions.fetchAuthorsEndpointById).toBe('function');
	expect(typeof actions.fetchAllAuthors).toBe('function');
	expect(typeof actions.fetchAllAuthorsEndpoint).toBe('function');
	expect(typeof actions.fetchAllAuthorsEndpointById).toBe('function');
});

test('Check ability to skip some actions', () => {
	const actions = createActions('test-rest-api', 'http://wordpress.test/wp-json/', ['books'], {
		fetch: false,
		fetchEndpoint: false,
		fetchById: false,
		fetchEndpointById: false,
		fetchAll: false,
		fetchAllEndpoint: false,
		fetchAllEndpointById: false,
	});

	expect(typeof actions.fetchBooks).toBe('undefined');
	expect(typeof actions.fetchBooksEndpoint).toBe('undefined');
	expect(typeof actions.fetchBooksById).toBe('undefined');
	expect(typeof actions.fetchBooksEndpointById).toBe('undefined');
	expect(typeof actions.fetchAllBooks).toBe('undefined');
	expect(typeof actions.fetchAllBooksEndpoint).toBe('undefined');
	expect(typeof actions.fetchAllBooksEndpointById).toBe('undefined');
});
