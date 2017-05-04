import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import faker from 'faker';

import { createActions } from '../lib/index';

const mockStore = configureStore([thunk]);

const name = 'test-rest-api';
const endpoint = 'books';
const endpoint2 = 'chapters';
const params = { context: 'view' };
const actions = createActions(name, 'http://wordpress.test/wp-json/', [endpoint]);

describe('fetchBooksEndpointById action creators', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('dispatches the correct action on successful fetch request', () => {
		const store = mockStore({});
		const id = faker.random.number();
		const item = {
			"id": faker.random.number(),
			"title": faker.lorem.sentence()
		};

		const mock = fetch.mockResponse(JSON.stringify(item), { status: 200 });

		return store
			.dispatch(actions.fetchBooksEndpointById(id, endpoint2, params))
			.then(() => {
				const actions = store.getActions();

				expect(actions.length).toBe(2);
				expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${id}/${endpoint2}?context=view`);

				expect(actions[0]).toEqual({
					type: `@@wp/${name}/fetching-by-id/${endpoint}/${endpoint2}`,
					id,
					params,
				});

				expect(actions[1]).toEqual({
					type: `@@wp/${name}/fetched-by-id/${endpoint}/${endpoint2}`,
					ok: true,
					results: item,
					id,
					params
				});
			});
	});

	it('dispatches the correct action on 404 response', () => {
		const store = mockStore({});
		const statusText = 'not-found';
		const id = faker.random.number();

		const mock = fetch.mockResponse('', {
			status: 404,
			statusText: statusText,
		});

		return store
			.dispatch(actions.fetchBooksEndpointById(id, endpoint2, params))
			.then(() => {
				const actions = store.getActions();

				expect(actions.length).toBe(2);
				expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${id}/${endpoint2}?context=view`);

				expect(actions[0]).toEqual({
					type: `@@wp/${name}/fetching-by-id/${endpoint}/${endpoint2}`,
					id,
					params,
				});

				expect(actions[1]).toEqual({
					type: `@@wp/${name}/fetched-by-id/${endpoint}/${endpoint2}`,
					ok: false,
					message: statusText,
					id,
					params,
				});
			});
	});
});