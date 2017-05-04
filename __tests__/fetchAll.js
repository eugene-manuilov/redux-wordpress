jest.mock('isomorphic-fetch');

import faker from 'faker';
import { createActions } from '../lib/index';

test('Test fetchAll function on success', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const items = [];
	const per_page = faker.random.number({ min: 1, max: 100 });
	const params = { context: 'view', per_page };
	const pages = [];

	for (let i = 0, len = faker.random.number({ min: 1, max: 20 }); i < len; i++) {
		const page = [];
		for (let j = 0; j < per_page; j++) {
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

			items.push(item);
			page.push(item);
		}

		pages.push(page);
	}

	const mockData = {
		status: 200,
		data: pages,
		total: items.length,
		totalPages: pages.length
	};

	require('isomorphic-fetch').__setMockData(mockData);

	let called = 0;
	const dispatch = action => {
		if (called++) {
//			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}?context=view&page=1&per_page=${per_page}`);

			expect(action.type).toBe(`@@wp/${name}/fetched-all/${endpoint}`);
//			expect(action.total).toBe(items.length);
//			expect(action.totalPages).toBe(pages.length);
//			expect(action.ok).toBeTruthy();

//			expect(Array.isArray(action.results)).toBeTruthy();
//			items.forEach((item, i) => {
//				expect(action.results[i]).toEqual(item);
//			});
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching-all/${endpoint}`);
		}

		expect(action.params).toEqual(params);
	};

	createActions(name, 'http://wordpress.test/wp-json/', [endpoint]).fetchAllBooks(params)((action) => {
		process.nextTick(() => {
			dispatch(action);
		});
	});
});

test('Test fetchAll function on 404 response', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const items = [];
	const page = faker.random.number({ min: 1, max: 100 });
	const per_page = faker.random.number({ min: 1, max: 100 });
	const params = { context: 'view', page, per_page };
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
//			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}?context=view&page=${page}&per_page=${per_page}`);

			expect(action.type).toBe(`@@wp/${name}/fetched-all/${endpoint}`);
			expect(action.total).toBeUndefined();
			expect(action.totalPages).toBeUndefined();
			expect(action.results).toBeUndefined();
			expect(action.ok).toBeFalsy();
			expect(action.message).toBe(statusText);
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching-all/${endpoint}`);
		}

		expect(action.params).toEqual(params);
	};

	createActions(name, 'http://wordpress.test/wp-json/', [endpoint]).fetchAllBooks(params)((action) => {
		process.nextTick(() => {
			dispatch(action);
		});
	});
});

test('Test fetchAll function on reject response', () => {
	const name = 'test-rest-api';
	const endpoint = 'books';
	const page = faker.random.number({ min: 1, max: 100 });
	const per_page = faker.random.number({ min: 1, max: 100 });
	const params = { context: 'view', page, per_page };
	const statusText = '404 not found';
	const mockData = {
		reject: true,
		statusText: statusText
	};

	require('isomorphic-fetch').__setMockData(mockData);

	let called = 0;
	const dispatch = action => {
		if (called++) {
//			expect(require('isomorphic-fetch').__getRequestedUrl(mockData)).toBe(`http://wordpress.test/wp-json/wp/v2/${endpoint}?context=view&page=${page}&per_page=${per_page}`);

			expect(action.type).toBe(`@@wp/${name}/fetched-all/${endpoint}`);
			expect(action.total).toBeUndefined();
			expect(action.totalPages).toBeUndefined();
			expect(action.results).toBeUndefined();
			expect(action.ok).toBeFalsy();
			expect(action.message).toBe(statusText);
		} else {
			expect(action.type).toBe(`@@wp/${name}/fetching-all/${endpoint}`);
		}

		expect(action.params).toEqual(params);
	};

	createActions(name, 'http://wordpress.test/wp-json/', [endpoint]).fetchAllBooks(params)((action) => {
		process.nextTick(() => {
			dispatch(action);
		});
	});
});