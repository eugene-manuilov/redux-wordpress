jest.mock('isomorphic-fetch');

import faker from 'faker';
import { createActions } from '../lib/index';

test('Test fetchEndpointById function on success', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const endpoint2 = 'chapters';
	const params = {context: 'view'};
	const item = {
		"id": faker.random.number(),
		"title": faker.lorem.sentence()
	};

	const mockData = {
		status: 200,
		data: item
	};

	require('isomorphic-fetch').__setMockData(mockData);

	let called = 0;
	const dispatch = action => {
		if (called++) {
			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${item.id}/${endpoint2}?context=view`);

			expect(action.type).toBe(`@@wp/${name}/fetched-by-id/${endpoint}/${endpoint2}`);
			expect(action.ok).toBeTruthy();
			expect(action.result).toEqual(item);
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching-by-id/${endpoint}/${endpoint2}`);
		}

		expect(action.params).toEqual(params);
		expect(action.id).toBe(item.id);
	};

	const actions = createActions(name, 'http://wordpress.test/wp-json/', [endpoint]);
	actions.fetchBooksEndpointById(item.id, endpoint2, params)(dispatch);
});

test('Test fetchEndpointById function on 404 response', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const endpoint2 = 'chapters';
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
			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${id}/${endpoint2}?context=view`);

			expect(action.type).toBe(`@@wp/${name}/fetched-by-id/${endpoint}/${endpoint2}`);
			expect(action.result).toBeUndefined();
			expect(action.ok).toBeFalsy();
			expect(action.message).toBe(statusText);
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching-by-id/${endpoint}/${endpoint2}`);
		}

		expect(action.params).toEqual(params);
		expect(action.id).toBe(id);
	};

	const actions = createActions(name, 'http://wordpress.test/wp-json/', [endpoint]);
	actions.fetchBooksEndpointById(id, endpoint2, params)(dispatch);
});

test('Test fetchEndpointById function on reject response', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const endpoint2 = 'chapters';
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
			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${id}/${endpoint2}?context=view`);

			expect(action.type).toBe(`@@wp/${name}/fetched-by-id/${endpoint}/${endpoint2}`);
			expect(action.result).toBeUndefined();
			expect(action.ok).toBeFalsy();
			expect(action.message).toBe(statusText);
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching-by-id/${endpoint}/${endpoint2}`);
		}

		expect(action.params).toEqual(params);
		expect(action.id).toBe(id);
	};

	const actions = createActions(name, 'http://wordpress.test/wp-json/', [endpoint]);
	actions.fetchBooksEndpointById(id, endpoint2, params)(dispatch);
});