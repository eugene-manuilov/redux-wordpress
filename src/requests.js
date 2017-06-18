import { qs, upperFirst, trimEnd, requestAll, requestSingle } from './helpers';

export default function createRequests(host, endpoints, args = {}) {
	let options = args;

	// fallback for previous version of this function where the last param was
	// for namespace argument
	if (typeof args === 'string') {
		options = { namespace: args };
	}

	const requests = {};
	const namespace = options.namespace || 'wp/v2';

	endpoints.forEach((endpoint) => {
		const normalizedURL = trimEnd(host, '/');
		const endpointName = upperFirst(endpoint);

		if (options.request !== false) {
			requests[`request${endpointName}`] = (params = {}) => requestSingle(`${normalizedURL}/${namespace}/${endpoint}?${qs(params)}`);
		}

		if (options.requestEndpoint !== false) {
			requests[`request${endpointName}Endpoint`] = (endpoint2, params = {}) => requestSingle(`${normalizedURL}/${namespace}/${endpoint}/${endpoint2}?${qs(params)}`);
		}

		if (options.requestById !== false) {
			requests[`request${endpointName}ById`] = (id, params = {}) => requestSingle(`${normalizedURL}/${namespace}/${endpoint}/${id}?${qs(params)}`);
		}

		if (options.requestEndpointById !== false) {
			requests[`request${endpointName}EndpointById`] = (id, endpoint2, params = {}) => requestSingle(`${normalizedURL}/${namespace}/${endpoint}/${id}/${endpoint2}?${qs(params)}`);
		}

		if (options.requestAll !== false) {
			requests[`requestAll${endpointName}`] = (params = {}) => requestAll(`${normalizedURL}/${namespace}/${endpoint}`, params);
		}

		if (options.requestAllEndpoint !== false) {
			requests[`requestAll${endpointName}Endpoint`] = (endpoint2, params = {}) => requestAll(`${normalizedURL}/${namespace}/${endpoint}/${endpoint2}`, params);
		}

		if (options.requestAllEndpointById !== false) {
			requests[`requestAll${endpointName}EndpointById`] = (id, endpoint2, params = {}) => requestAll(`${normalizedURL}/${namespace}/${endpoint}/${id}/${endpoint2}`, params);
		}
	});

	return requests;
}
