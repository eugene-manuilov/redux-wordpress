import faker from 'faker';

describe('requestBooksEndpointById function', () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it('resolves the correct json on successful request', () => {
		const id = faker.random.number();
		const item = {
			"id": faker.random.number(),
			"title": faker.lorem.sentence()
		};

		const mock = fetch.mockResponse(JSON.stringify(item), { status: 200 });

		return requests.requestBooksEndpointById(id, endpoint2, params).then((data) => {
			expect(data.json).toBeDefined();
			expect(data.json).toEqual(item);

			expect(data.response).toBeDefined();

			expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${id}/${endpoint2}?context=view`);
		});
	});

	it('rejects request on error', () => {
		const statusText = 'not-found';
		const id = faker.random.number();

		const mock = fetch.mockResponse('', {
			status: 404,
			statusText: statusText,
		});

		return requests.requestBooksEndpointById(id, endpoint2, params).catch((error) => {
			expect(error).toBe(statusText);
			expect(mock).toHaveBeenCalledWith(`http://wordpress.test/wp-json/wp/v2/${endpoint}/${id}/${endpoint2}?context=view`);
		});
	});
});