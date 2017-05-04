import faker from 'faker';

describe('fetchBooksEndpoint action creators', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('dispatches the correct action on successful fetch request', () => {
		const store = mockStore({});
		const items = [];

		for (let i = 0, len = faker.random.number({ min: 1, max: 20 }); i < len; i++) {
			items.push({
				"id": faker.random.number(),
				"title": faker.lorem.sentence()
			});
		}

		const mock = fetch.mockResponse(JSON.stringify(items), {
			status: 200,
			headers: new Headers({
				'X-WP-TotalPages': 1,
				'X-WP-Total': items.length
			}),
		});

		return store
			.dispatch(actions.fetchBooksEndpoint(endpoint2, params))
			.then(() => {
				const actions = store.getActions();

				expect(actions.length).toBe(2);
				expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${endpoint2}?context=view`);

				expect(actions[0]).toEqual({
					type: `@@wp/${name}/fetching/${endpoint}/${endpoint2}`,
					params,
				});

				expect(actions[1]).toEqual({
					type: `@@wp/${name}/fetched/${endpoint}/${endpoint2}`,
					ok: true,
					total: items.length,
					totalPages: 1,
					results: items,
					params,
				});
			});
	});

	it('dispatches the correct action on 404 response', () => {
		const store = mockStore({});
		const statusText = 'not-found';

		const mock = fetch.mockResponse('', {
			status: 404,
			statusText: statusText,
		});

		return store
			.dispatch(actions.fetchBooksEndpoint(endpoint2, params))
			.then(() => {
				const actions = store.getActions();

				expect(actions.length).toBe(2);
				expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${endpoint2}?context=view`);

				expect(actions[0]).toEqual({
					type: `@@wp/${name}/fetching/${endpoint}/${endpoint2}`,
					params,
				});

				expect(actions[1]).toEqual({
					type: `@@wp/${name}/fetched/${endpoint}/${endpoint2}`,
					ok: false,
					message: statusText,
					params,
				});
			});
	});
});
