import faker from 'faker';

describe('requestAllBooks function', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('resolves the correct json on successfull request', () => {
		const items = [];
		const per_page = faker.random.number({ min: 1, max: 10 });
		const params = { context: 'view', per_page };
		const pages = [];
		const mocks = [];

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

		return requests.requestAllBooks(params).then((data) => {
			expect(data.json).toBeDefined();
			expect(data.json).toEqual(items);

			expect(data.response).toBeDefined();

			mocks.forEach((mock, i) => {
				expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}?context=view&page=${i + 1}&per_page=${per_page}`);
			});
		});
	});

	it('rejects request on error', () => {
		const statusText = 'not-found';

		const mock = fetch.mockResponse('', {
			status: 404,
			statusText: statusText,
		});

		return requests.requestAllBooks(params).catch((error) => {
			expect(error).toBe(statusText);
			expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}?context=view&page=1&per_page=100`);
		});
	});
});