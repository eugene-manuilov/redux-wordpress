import faker from 'faker';

describe('requestBooks function', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('resolves the correct json on successful request', () => {
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

		return requests.requestBooks(params).then((data) => {
			expect(data.json).toBeDefined();
			expect(data.json).toEqual(items);

			expect(data.response).toBeDefined();

			expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}?context=view`);
		});
	});

	it('rejects request on error', () => {
		const statusText = 'not-found';
		const mock = fetch.mockResponse('', {
			status: 404,
			statusText: statusText,
		});

		return requests.requestBooks(params).catch((error) => {
			expect(error).toBe(statusText);
			expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}?context=view`);
		});
	});
});
