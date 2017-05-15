import faker from 'faker';
import { createReducer } from '../lib/index';

const name = 'wp-api';
const reducer = createReducer(name);

const getTestData = () => {
	const data = [];

	for (let i = 0, len = faker.random.number({min: 1, max: 20}); i < len; i++) {
		data.push({id: faker.random.number(), title: faker.lorem.sentence()});
	}

	return data;
};

test('Test createReducer creates a function', () => {
	expect(typeof reducer).toBe('function');
});

test('Test original state has not changed on unknown action', () => {
	const state = {test: faker.random.number(), data: [1, 2, 3]};
	expect(reducer(state, {type: 'unknown'})).toEqual(state);
});

test('Test original state has not changed on unsuccessful result', () => {
	const state = {test: faker.random.number(), data: [1, 2, 3]};

	expect(reducer(state, {type: `@@wp/${name}/fetched/books`, ok: false})).toEqual(state);
	expect(reducer(state, {type: `@@wp/${name}/fetched/books/chapters`, ok: false})).toEqual(state);
	expect(reducer(state, {type: `@@wp/${name}/fetched-all/books`, ok: false})).toEqual(state);
	expect(reducer(state, {type: `@@wp/${name}/fetched-all/books/chapters`, ok: false})).toEqual(state);
	expect(reducer(state, {type: `@@wp/${name}/fetched-by-id/books`, ok: false})).toEqual(state);
	expect(reducer(state, {type: `@@wp/${name}/fetched-by-id/books/chapters`, ok: false})).toEqual(state);
	expect(reducer(state, {type: `@@wp/${name}/fetched-all-by-id/books/chapters`, ok: false})).toEqual(state);
});

describe('Fetch reducer', () => {
	const initialState = {
		authors: {
			data: [],
			total: faker.random.number(),
			totalPages: faker.random.number()
		}
	};

	test('state change on fetch success', () => {
		const state = Object.assign({}, initialState);
		const totalPages = faker.random.number();
		const data = getTestData();

		const action = {
			type: `@@wp/${name}/fetched/books`,
			ok: true,
			results: data,
			total: data.length,
			totalPages
		};

		const result = Object.assign({}, state, {
			books: {
				data: data,
				total: data.length,
				totalPages
			}
		});

		expect(reducer(state, action)).toEqual(result);
	});

	test('state change on fetch-all success', () => {
		const state = Object.assign({}, initialState);
		const totalPages = faker.random.number();
		const data = getTestData();

		const action = {
			type: `@@wp/${name}/fetched-all/books`,
			ok: true,
			results: data,
			total: data.length,
			totalPages
		};

		const result = Object.assign({}, state, {
			books: {
				data: data,
				total: data.length,
				totalPages
			}
		});

		expect(reducer(state, action)).toEqual(result);
	});
});

describe('Fetch-by-id reducer', () => {
	test('Test state change on fetch-by-id success', () => {
		const authors = {
			data: [],
			total: faker.random.number(),
			totalPages: faker.random.number()
		};

		const state = {
			authors
		};

		const id = faker.random.number();
		const data = faker.lorem.sentence();

		const action = {
			type: `@@wp/${name}/fetched-by-id/books`,
			ok: true,
			id: id,
			result: data
		};

		const obj = {};
		obj[`books/${id}`] = { data };

		expect(reducer(state, action)).toEqual(Object.assign({}, state, obj));
	});
});

describe('Fetch-endpoint reducer', () => {
	const initialState = {
		authors: {
			data: [],
			total: faker.random.number(),
			totalPages: faker.random.number()
		}
	};

	test('state change on fetch-endpoint success', () => {
		const state = Object.assign({}, initialState);
		const totalPages = faker.random.number();
		const data = getTestData();

		const action = {
			type: `@@wp/${name}/fetched/books/chapters`,
			ok: true,
			results: data,
			total: data.length,
			totalPages
		};

		const result = Object.assign({}, state, {
			"books/chapters": {
				data: data,
				total: data.length,
				totalPages
			}
		});

		expect(reducer(state, action)).toEqual(result);
	});

	test('state change on fetch-all-enpoint success', () => {
		const state = Object.assign({}, initialState);
		const totalPages = faker.random.number();
		const data = getTestData();

		const action = {
			type: `@@wp/${name}/fetched-all/books/chapters`,
			ok: true,
			results: data,
			total: data.length,
			totalPages
		};

		const result = Object.assign({}, state, {
			"books/chapters": {
				data: data,
				total: data.length,
				totalPages
			}
		});

		expect(reducer(state, action)).toEqual(result);
	});
});

describe('Fetch-endpoint-by-id reducer', () => {
	const initialState = {
		authors: {
			data: [],
			total: faker.random.number(),
			totalPages: faker.random.number()
		}
	};

	test('state change on fetch-endpoint success', () => {
		const state = Object.assign({}, initialState);
		const id = faker.random.number();
		const data = faker.lorem.sentence();

		const action = {
			type: `@@wp/${name}/fetched-by-id/books/chapters`,
			ok: true,
			id: id,
			result: data
		};

		const obj = {};
		obj[`books/${id}/chapters`] = { data };

		expect(reducer(state, action)).toEqual(Object.assign({}, state, obj));
	});

	test('state change on fetch-all-enpoint success', () => {
		const state = Object.assign({}, initialState);
		const id = faker.random.number();
		const data = faker.lorem.sentence();

		const action = {
			type: `@@wp/${name}/fetched-all-by-id/books/chapters`,
			ok: true,
			id: id,
			result: data
		};

		const obj = {};
		obj[`books/${id}/chapters`] = { data };

		expect(reducer(state, action)).toEqual(Object.assign({}, state, obj));
	});
});
