jest.mock('isomorphic-fetch');

import { createActions } from '../lib/index';

test('Check actions created by createActions function', () => {
	const actions = createActions('test-rest-api', 'http://wordpress.test/wp-json/', ['books', 'authors']);

	expect(typeof actions.fetchBooks).toBe('function');
	expect(typeof actions.fetchAuthors).toBe('function');
});

test('Check generated fetch function', () => {
	const name = 'test-rest-api';
	const booksEndpoint = 'books';
	const booksItems = [
		{
			"id": 338598,
			"date": "2017-04-13T20:02:35",
			"date_gmt": "2017-04-13T20:02:35",
			"guid": {"rendered": "http://wordpress.test/338598/"},
			"modified": "2017-04-13T20:02:35",
			"modified_gmt": "2017-04-13T20:02:35",
			"slug": "test-book-slug",
			"status": "publish",
			"type": "post",
			"link": "http://wordpress.test/test-book-slug/",
			"title": {"rendered": "Test book"},
			"content": {"rendered": ""},
			"excerpt": {"rendered": ""},
			"author": 1214,
			"featured_media": 331190,
			"comment_status": "open",
			"ping_status": "open",
			"sticky": false,
			"template": "",
			"format": "standard",
			"meta": [],
			"categories": [50]
		}
	];

	const dispatch = action => {
		expect(action.type).toBe(`@@wordpress/${name}/fetch/${booksEndpoint}`);
		expect(action.total).toBe(booksItems.length);
		expect(action.totalPages).toBe(1);
		expect(Array.isArray(action.results)).toBeTruthy();
		expect(action.results[0]).toEqual(booksItems[0]);
		expect(require('isomorphic-fetch').__getRequestedUrl()).toBe('http://wordpress.test/wp-json/wp/v2/books?context=view');
	};

	const actions = createActions(name, 'http://wordpress.test/wp-json/', [booksEndpoint, 'authors']);
	
	require('isomorphic-fetch').__setMockData(booksItems, booksItems.length, 1);
	actions.fetchBooks({context: 'view'})(dispatch);
});