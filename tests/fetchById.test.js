jest.mock('isomorphic-fetch');

import faker from 'faker';
import { createActions } from '../lib/index';

test('Test fetchById function on success', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const params = {context: 'view'};
	const item = {
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
	};

	const mockData = {
		status: 200,
		data: item
	};

	require('isomorphic-fetch').__setMockData(mockData);

	let called = 0;
	const dispatch = action => {
		if (called++) {
			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${item.id}?context=view`);

			expect(action.type).toBe(`@@wp/${name}/fetched-by-id/${endpoint}`);
			expect(action.ok).toBeTruthy();
			expect(action.result).toEqual(item);
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching-by-id/${endpoint}`);
		}

		expect(action.params).toEqual(params);
		expect(action.id).toBe(item.id);
	};

	const actions = createActions(name, 'http://wordpress.test/wp-json/', [endpoint]);
	actions.fetchBooksById(item.id, params)(dispatch);
});

test('Test fetchById function on 404 response', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const item = {};
	const params = {context: 'view'};
	const statusText = 'not-found';
	const id = faker.random.number();
	const mockData = {
		status: 404,
		statusText: statusText,
		data: item
	};

	require('isomorphic-fetch').__setMockData(mockData);

	let called = 0;
	const dispatch = action => {
		if (called++) {
			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${id}?context=view`);

			expect(action.type).toBe(`@@wp/${name}/fetched-by-id/${endpoint}`);
			expect(action.result).toBeUndefined();
			expect(action.ok).toBeFalsy();
			expect(action.message).toBe(statusText);
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching-by-id/${endpoint}`);
		}

		expect(action.params).toEqual(params);
		expect(action.id).toBe(id);
	};

	const actions = createActions(name, 'http://wordpress.test/wp-json/', [endpoint]);
	actions.fetchBooksById(id, params)(dispatch);
});

test('Test fetchById function on reject response', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const params = {context: 'view'};
	const statusText = '404 not found';
	const id = faker.random.number();
	const mockData = {
		reject: true,
		statusText: statusText
	};

	require('isomorphic-fetch').__setMockData(mockData);

	let called = 0;
	const dispatch = action => {
		if (called++) {
			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${id}?context=view`);

			expect(action.type).toBe(`@@wp/${name}/fetched-by-id/${endpoint}`);
			expect(action.result).toBeUndefined();
			expect(action.ok).toBeFalsy();
			expect(action.message).toBe(statusText);
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching-by-id/${endpoint}`);
		}

		expect(action.params).toEqual(params);
		expect(action.id).toBe(id);
	};

	const actions = createActions(name, 'http://wordpress.test/wp-json/', [endpoint]);
	actions.fetchBooksById(id, params)(dispatch);
});