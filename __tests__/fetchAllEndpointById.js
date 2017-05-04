import faker from 'faker';

describe('fetchAllBooksEndpointById action creators', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('dispatches the correct action on successful fetch request', () => {
		const store = mockStore({});
		const items = [];
		const per_page = faker.random.number({ min: 1, max: 10 });
		const params = { context: 'view', per_page };
		const pages = [];
		const mocks = [];
		const id = faker.random.number();

		for (let i = 0, len = faker.random.number({ min: 2, max: 10 }); i < len; i++) {
			const page = [];

			for (let j = 0; j < per_page; j++) {
				const item = {
					"id": faker.random.number(),
					"date": "2017-04-13T20:02:35",
					"date_gmt": "2017-04-13T20:02:35",
					"guid": { "rendered": faker.internet.url() },
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
				};

				items.push(item);
				page.push(item);
			}

			pages.push(page);
		}

		pages.forEach((page) => {
			const mock = fetch.mockResponseOnce(JSON.stringify(page), {
				status: 200,
				headers: new Headers({
					'X-WP-TotalPages': pages.length,
					'X-WP-Total': items.length
				}),
			});

			mocks.push(mock);
		});

		return store
			.dispatch(actions.fetchAllBooksEndpointById(id, endpoint2, params))
			.then(() => {
				const actions = store.getActions();

				mocks.forEach((mock, i) => {
					expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${id}/${endpoint2}?context=view&page=${i + 1}&per_page=${per_page}`);
				});

				expect(actions.length).toBe(2);

				expect(actions[0]).toEqual({
					type: `@@wp/${name}/fetching-all-by-id/${endpoint}/${endpoint2}`,
					id,
					params,
				});

				expect(actions[1]).toEqual({
					type: `@@wp/${name}/fetched-all-by-id/${endpoint}/${endpoint2}`,
					ok: true,
					total: items.length,
					totalPages: pages.length,
					results: items,
					id,
					params,
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
			.dispatch(actions.fetchAllBooksEndpointById(id, endpoint2, params))
			.then(() => {
				const actions = store.getActions();

				expect(actions.length).toBe(2);
				expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${id}/${endpoint2}?context=view&page=1&per_page=100`);

				expect(actions[0]).toEqual({
					type: `@@wp/${name}/fetching-all-by-id/${endpoint}/${endpoint2}`,
					id,
					params,
				});

				expect(actions[1]).toEqual({
					type: `@@wp/${name}/fetched-all-by-id/${endpoint}/${endpoint2}`,
					ok: false,
					message: statusText,
					id,
					params,
				});
			});
	});
});