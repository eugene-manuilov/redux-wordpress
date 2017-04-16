jest.genMockFromModule('isomorphic-fetch');

let mockData = {};
let requestedUrl = null;

const fetch = (url) => {
	requestedUrl = url;

	return new Promise((resolve, reject) => {
		// create a new response object with mock data
		const response = new Response(JSON.stringify(mockData.data || null), {
			status: 200,
			headers: new Headers({
				'X-WP-TotalPages': mockData.totalPages,
				'X-WP-Total': mockData.total
			})
		});

		// reset mock data
		mockData = {};

		// resolve promise to simulate successfull request
		resolve(response);
	});
};

fetch.__setMockData = (data, total, totalPages) => {
	mockData = {data, total, totalPages};
};

fetch.__getRequestedUrl = () => requestedUrl;

module.exports = fetch;