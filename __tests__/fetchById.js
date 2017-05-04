import faker from 'faker';

describe('fetchBooksById action creators', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('dispatches the correct action on successful fetch request', () => {
		const store = mockStore({});
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

		const mock = fetch.mockResponse(JSON.stringify(item), { status: 200 });

		return store
			.dispatch(actions.fetchBooksById(item.id, params))
			.then(() => {
				const actions = store.getActions();

				expect(actions.length).toBe(2);
				expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${item.id}?context=view`);

				expect(actions[0]).toEqual({
					type: `@@wp/${name}/fetching-by-id/${endpoint}`,
					id: item.id,
					params,
				});

				expect(actions[1]).toEqual({
					type: `@@wp/${name}/fetched-by-id/${endpoint}`,
					ok: true,
					results: item,
					id: item.id,
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
			.dispatch(actions.fetchBooksById(id, params))
			.then(() => {
				const actions = store.getActions();

				expect(actions.length).toBe(2);
				expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${id}?context=view`);

				expect(actions[0]).toEqual({
					type: `@@wp/${name}/fetching-by-id/${endpoint}`,
					id: id,
					params,
				});

				expect(actions[1]).toEqual({
					type: `@@wp/${name}/fetched-by-id/${endpoint}`,
					ok: false,
					id: id,
					message: statusText,
					params,
				});
			});
	});
});