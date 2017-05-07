import faker from 'faker';
import { createReducer } from '../lib/index';

const name = 'wp-api';
const reducer = createReducer(name);

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
	expect(reducer(state, {type: `@@wp/${name}/fetched-by-id/books`, ok: false})).toEqual(state);
});

test('Test state change on fetch success', () => {
	const authors = {
		data: [],
		total: faker.random.number(),
		totalPages: faker.random.number()
	};

	const state = {
		authors
	};

	const totalPages = faker.random.number();
	const data = [];
	for (let i = 0, len = faker.random.number({min: 1, max: 20}); i < len; i++) {
		data.push({id: faker.random.number(), title: faker.lorem.sentence()});
	}

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

test('Test state change on fetch-by-id success', () => {
	const authors = [];
	authors[faker.random.number()] = faker.lorem.sentence();
	authors[faker.random.number()] = faker.lorem.sentence();
	authors[faker.random.number()] = faker.lorem.sentence();

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

	const result = Object.assign({}, state, {books: { data: [] }});
	result.books.data[id] = data;

	expect(reducer(state, action)).toEqual(result);
});