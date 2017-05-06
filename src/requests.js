import { qs, upperFirst, trimEnd, requestAll, requestSingle } from './helpers';

export default function createRequests(host, endpoints, namespace = 'wp/v2') {
	const requests = {};

	endpoints.forEach((endpoint) => {
		const normalizedURL = trimEnd(host, '/');
		const endpointName = upperFirst(endpoint);

		requests[`request${endpointName}`] = (params = {}) => requestSingle(`${normalizedURL}/${namespace}/${endpoint}?${qs(params)}`);
		requests[`request${endpointName}Endpoint`] = (endpoint2, params = {}) => requestSingle(`${normalizedURL}/${namespace}/${endpoint}/${endpoint2}?${qs(params)}`);
		requests[`request${endpointName}ById`] = (id, params = {}) => requestSingle(`${normalizedURL}/${namespace}/${endpoint}/${id}?${qs(params)}`);
		requests[`request${endpointName}EndpointById`] = (id, endpoint2, params = {}) => requestSingle(`${normalizedURL}/${namespace}/${endpoint}/${id}/${endpoint2}?${qs(params)}`);

		requests[`requestAll${endpointName}`] = (params = {}) => requestAll(`${normalizedURL}/${namespace}/${endpoint}`, params);
		requests[`requestAll${endpointName}Endpoint`] = (endpoint2, params = {}) => requestAll(`${normalizedURL}/${namespace}/${endpoint}/${endpoint2}`, params);
		requests[`requestAll${endpointName}EndpointById`] = (id, endpoint2, params = {}) => requestAll(`${normalizedURL}/${namespace}/${endpoint}/${id}/${endpoint2}`, params);
	});

	return requests;
}
