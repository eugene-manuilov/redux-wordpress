jest.mock('isomorphic-fetch');

import faker from 'faker';
import { createActions } from '../lib/index';

test('Check actions created by createActions function', () => {
	const actions = createActions('test-rest-api', 'http://wordpress.test/wp-json/', ['books', 'authors']);

	expect(typeof actions.fetchBooks).toBe('function');
	expect(typeof actions.fetchBooksById).toBe('function');
	expect(typeof actions.fetchAuthors).toBe('function');
	expect(typeof actions.fetchAuthorsById).toBe('function');
});

test('Check generated fetch function', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const items = [];

	for (let i = 0, len = faker.random.number({min: 1, max: 20}); i < len; i++) {
		items.push({
			"id": faker.random.number(),
			"date": "2017-04-13T20:02:35",
			"date_gmt": "2017-04-13T20:02:35",
			"guid": {"rendered": faker.internet.url()},
			"modified": "2017-04-13T20:02:35",
			"modified_gmt": "2017-04-13T20:02:35",
			"slug": faker.lorem.slug(),
			"status": "publish",
			"type": "post",
			"link": `http://wordpress.test/${faker.lorem.slug()}/`,
			"title": {"rendered": faker.lorem.sentence()},
			"content": {"rendered": faker.lorem.paragraphs(4)},
			"excerpt": {"rendered": faker.lorem.paragraph()},
			"author": faker.random.number(),
			"featured_media": faker.random.number(),
			"comment_status": "open",
			"ping_status": "open",
			"sticky": false,
			"template": "",
			"format": "standard",
			"meta": [],
			"categories": [faker.random.number()]
		});
	}

	const dispatch = action => {
		expect(require('isomorphic-fetch').__getRequestedUrl()).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}?context=view`);

		expect(action.type).toBe(`@@wp/${name}/fetch/${endpoint}`);
		expect(action.total).toBe(items.length);
		expect(action.totalPages).toBe(1);

		expect(Array.isArray(action.results)).toBeTruthy();
		items.forEach((item, i) => {
			expect(action.results[i]).toEqual(item);
		});
	};

	const actions = createActions(name, 'http://wordpress.test/wp-json/', [endpoint]);

	require('isomorphic-fetch').__setMockData(items, items.length, 1);
	actions.fetchBooks({context: 'view'})(dispatch);
});