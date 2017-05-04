import faker from 'faker';

describe('fetchBooks action creators', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('dispatches the correct action on successful fetch request', () => {
		const store = mockStore({});
		const items = [];

		for (let i = 0, len = faker.random.number({ min: 1, max: 20 }); i < len; i++) {
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
				"title": { "rendered": faker.lorem.sentence() },
				"content": { "rendered": faker.lorem.paragraphs(4) },
				"excerpt": { "rendered": faker.lorem.paragraph() },
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

		const mock = fetch.mockResponse(JSON.stringify(items), {
			status: 200,
			headers: new Headers({
				'X-WP-TotalPages': 1,
				'X-WP-Total': items.length
			}),
		});

		return store
			.dispatch(actions.fetchBooks(params))
			.then(() => {
				const actions = store.getActions();

				expect(actions.length).toBe(2);
				expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}?context=view`);

				expect(actions[0]).toEqual({
					type: `@@wp/${name}/fetching/${endpoint}`,
					params
				});

				expect(actions[1]).toEqual({
					type: `@@wp/${name}/fetched/${endpoint}`,
					ok: true,
					total: items.length,
					totalPages: 1,
					results: items,
					params
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
			.dispatch(actions.fetchBooks(params))
			.then(() => {
				const actions = store.getActions();

				expect(actions.length).toBe(2);
				expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}?context=view`);

				expect(actions[0]).toEqual({
					type: `@@wp/${name}/fetching/${endpoint}`,
					params
				});

				expect(actions[1]).toEqual({
					type: `@@wp/${name}/fetched/${endpoint}`,
					ok: false,
					message: statusText,
					params,
				});
			});
	});
});