jest.mock('isomorphic-fetch');

import faker from 'faker';
import { createActions } from '../lib/index';

test('Test fetch endpoint function on success', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const endpoint2 = 'chapters';
	const items = [];
	const params = {context: 'view'};

	for (let i = 0, len = faker.random.number({min: 1, max: 20}); i < len; i++) {
		items.push({
			"id": faker.random.number(),
			"title": faker.lorem.sentence()
		});
	}

	const mockData = {
		status: 200,
		data: items,
		total: items.length,
		totalPages: 1
	};

	require('isomorphic-fetch').__setMockData(mockData);

	let called = 0;
	const dispatch = action => {
		if (called++) {
			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${endpoint2}?context=view`);

			expect(action.type).toBe(`@@wp/${name}/fetched/${endpoint}/${endpoint2}`);
			expect(action.total).toBe(items.length);
			expect(action.totalPages).toBe(1);
			expect(action.ok).toBeTruthy();

			expect(Array.isArray(action.results)).toBeTruthy();
			items.forEach((item, i) => {
				expect(action.results[i]).toEqual(item);
			});
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching/${endpoint}/${endpoint2}`);
		}

		expect(action.params).toEqual(params);
	};

	const actions = createActions(name, 'http://wordpress.test/wp-json/', [endpoint]);
	actions.fetchBooksEndpoint(endpoint2, params)(dispatch);
});

test('Test fetch endpoint function on 404 response', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const endpoint2 = 'chapters';
	const items = [];
	const params = {context: 'view'};
	const statusText = 'not-found';
	const mockData = {
		status: 404,
		statusText: statusText,
		data: items,
		total: items.length,
		totalPages: 1
	};

	require('isomorphic-fetch').__setMockData(mockData);

	let called = 0;
	const dispatch = action => {
		if (called++) {
			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${endpoint2}?context=view`);

			expect(action.type).toBe(`@@wp/${name}/fetched/${endpoint}/${endpoint2}`);
			expect(action.total).toBeUndefined();
			expect(action.totalPages).toBeUndefined();
			expect(action.results).toBeUndefined();
			expect(action.ok).toBeFalsy();
			expect(action.message).toBe(statusText);
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching/${endpoint}/${endpoint2}`);
		}

		expect(action.params).toEqual(params);
	};

	const actions = createActions(name, 'http://wordpress.test/wp-json/', [endpoint]);
	actions.fetchBooksEndpoint(endpoint2, params)(dispatch);
});

test('Test fetch function on reject response', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const endpoint2 = 'chapters';
	const params = {context: 'view'};
	const statusText = '404 not found';
	const mockData = {
		reject: true,
		statusText: statusText
	};

	require('isomorphic-fetch').__setMockData(mockData);

	let called = 0;
	const dispatch = action => {
		if (called++) {
			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${endpoint2}?context=view`);

			expect(action.type).toBe(`@@wp/${name}/fetched/${endpoint}/${endpoint2}`);
			expect(action.total).toBeUndefined();
			expect(action.totalPages).toBeUndefined();
			expect(action.results).toBeUndefined();
			expect(action.ok).toBeFalsy();
			expect(action.message).toBe(statusText);
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching/${endpoint}/${endpoint2}`);
		}

		expect(action.params).toEqual(params);
	};

	const actions = createActions(name, 'http://wordpress.test/wp-json/', [endpoint]);
	actions.fetchBooksEndpoint(endpoint2, params)(dispatch);
});