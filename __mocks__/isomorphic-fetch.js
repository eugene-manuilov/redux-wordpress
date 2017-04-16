jest.genMockFromModule('isomorphic-fetch');

let mockData = {};
let requestedUrl = null;

const fetch = (url) => {
	requestedUrl = url;

	return new Promise((resolve, reject) => {
		const params = Object.assign({}, mockData);

		// reset mock data
		mockData = {};

		if (params.reject) {
			// reject with status text
			reject(params.statusText || '');
		} else {
			// create a new response object with mock data
			const response = new Response(JSON.stringify(params.data || null), {
				status: params.status || 200,
				statusText: params.statusText || '',
				headers: new Headers({
					'X-WP-TotalPages': params.totalPages,
					'X-WP-Total': params.total
				})
			});

			// resolve promise to simulate successfull request
			resolve(response);
		}
	});
};

fetch.__setMockData = (data) => {
	mockData = Object.assign({}, data);
};

fetch.__getRequestedUrl = () => requestedUrl;

module.exports = fetch;