import fetch from 'isomorphic-fetch';

import trimEnd from 'lodash/trimEnd';
import upperFirst from 'lodash/upperFirst';

import { qs } from './helpers';

export default function createRequests(host, endpoints, namespace = 'wp/v2') {
	const requests = {};

	endpoints.forEach((endpoint) => {
		requests[`request${upperFirst(endpoint)}`] = params => fetch(`${trimEnd(host, '/')}/${namespace}/${endpoint}?${qs(params)}`);
		requests[`request${upperFirst(endpoint)}ById`] = (id, params) => fetch(`${trimEnd(host, '/')}/${namespace}/${endpoint}/${id}?${qs(params)}`);
	});

	return requests;
}
