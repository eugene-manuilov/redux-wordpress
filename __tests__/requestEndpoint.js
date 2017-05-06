import faker from 'faker';

describe('requestBooksEndpoint function', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('resolves the correct json on successful request', () => {
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

		return requests.requestBooksEndpoint(endpoint2, params).then((data) => {
			expect(data.json).toBeDefined();
			expect(data.json).toEqual(items);

			expect(data.response).toBeDefined();

			expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${endpoint2}?context=view`);
		});
	});

	it('rejects request on error', () => {
		const statusText = 'not-found';

		const mock = fetch.mockResponse('', {
			status: 404,
			statusText: statusText,
		});

		return requests.requestBooksEndpoint(endpoint2, params).catch((error) => {
			expect(error).toBe(statusText);
			expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${endpoint2}?context=view`);
		});
	});
});
