import { createRequests } from '../lib/index';

test('Check requests created by createRequests function', () => {
	const requests = createRequests('http://wordpress.test/wp-json/', ['books', 'authors']);

	expect(typeof requests.requestBooks).toBe('function');
	expect(typeof requests.requestBooksEndpoint).toBe('function');
	expect(typeof requests.requestBooksById).toBe('function');
	expect(typeof requests.requestBooksEndpointById).toBe('function');
	expect(typeof requests.requestAllBooks).toBe('function');
	expect(typeof requests.requestAllBooksEndpoint).toBe('function');
	expect(typeof requests.requestAllBooksEndpointById).toBe('function');

	expect(typeof requests.requestAuthors).toBe('function');
	expect(typeof requests.requestAuthorsEndpoint).toBe('function');
	expect(typeof requests.requestAuthorsById).toBe('function');
	expect(typeof requests.requestAuthorsEndpointById).toBe('function');
	expect(typeof requests.requestAllAuthors).toBe('function');
	expect(typeof requests.requestAllAuthorsEndpoint).toBe('function');
	expect(typeof requests.requestAllAuthorsEndpointById).toBe('function');
});

test('Check ability to skip some requests', () => {
	const requests = createRequests('http://wordpress.test/wp-json/', ['books'], {
		request: false,
		requestEndpoint: false,
		requestById: false,
		requestEndpointById: false,
		requestAll: false,
		requestAllEndpoint: false,
		requestAllEndpointById: false,
	});

	expect(typeof requests.requestBooks).toBe('undefined');
	expect(typeof requests.requestBooksEndpoint).toBe('undefined');
	expect(typeof requests.requestBooksById).toBe('undefined');
	expect(typeof requests.requestBooksEndpointById).toBe('undefined');
	expect(typeof requests.requestAllBooks).toBe('undefined');
	expect(typeof requests.requestAllBooksEndpoint).toBe('undefined');
	expect(typeof requests.requestAllBooksEndpointById).toBe('undefined');
});
