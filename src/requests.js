import { qs, upperFirst, trimEnd } from './helpers';

const fetchRequest = (url) => {
	const requestPromise = new Promise((resolve, reject) => {
		fetch(url)
			.then((response) => {
				response
					.json()
					.then(json => resolve(json, response))
					.catch(error => reject(error));
			})
			.catch(error => reject(error));
	});

	return requestPromise;
};

export default function createRequests(host, endpoints, namespace = 'wp/v2') {
	const requests = {};

	endpoints.forEach((endpoint) => {
		requests[`request${upperFirst(endpoint)}`] = params => fetchRequest(`${trimEnd(host, '/')}/${namespace}/${endpoint}?${qs(params)}`);
		requests[`request${upperFirst(endpoint)}ById`] = (id, params) => fetchRequest(`${trimEnd(host, '/')}/${namespace}/${endpoint}/${id}?${qs(params)}`);
	});

	return requests;
}
