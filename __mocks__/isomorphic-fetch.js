import URI from 'urijs';

jest.genMockFromModule('isomorphic-fetch');

let mockData = {};
let requestedUrls = {};

const fetch = (url) => {
	requestedUrls[JSON.stringify(mockData)] = url;

	return new Promise((resolve, reject) => {
		const qv = URI(url).search(true);
		const params = Object.assign({}, mockData);

		if (params.reject) {
			// reject with status text
			reject(params.statusText || '');
		} else {
			let data = params.data || null;

			// get page data if pagination is used
			if (qv.page && qv.page > 0 && params.data[qv.page] && Array.isArray(params.data[qv.page])) {
				data = params.data[qv.page];
			}

			// create a new response object with mock data
			const response = new Response(JSON.stringify(data), {
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

fetch.__getRequestedUrl = (data) => requestedUrls[JSON.stringify(data)];

module.exports = fetch;