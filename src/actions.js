import fetch from 'isomorphic-fetch';

import trimEnd from 'lodash/trimEnd';
import upperFirst from 'lodash/upperFirst';

import { qs, fetchSingle, fetchAll } from './helpers';

export default function createActions(name, host, endpoints, namespace = 'wp/v2') {
	const actions = {};

	endpoints.forEach((endpoint) => {
		actions[`fetch${upperFirst(endpoint)}`] = (params = {}) => (dispatch) => {
			dispatch({
				type: `@@wp/${name}/fetching/${endpoint}`,
				params,
			});

			const onSuccess = (json, response) => {
				dispatch({
					type: `@@wp/${name}/fetched/${endpoint}`,
					ok: true,
					totalPages: parseInt(response.headers.get('X-WP-TotalPages'), 10),
					total: parseInt(response.headers.get('X-WP-Total'), 10),
					results: json,
					params,
				});
			};

			const onError = (error) => {
				dispatch({
					type: `@@wp/${name}/fetched/${endpoint}`,
					ok: false,
					message: error,
					params,
				});
			};

			fetchSingle(`${trimEnd(host, '/')}/${namespace}/${endpoint}?${qs(params)}`, onSuccess, onError);
		};

		actions[`fetchAll${upperFirst(endpoint)}`] = (params = {}) => (dispatch) => {
			dispatch({
				type: `@@wp/${name}/fetching-all/${endpoint}`,
				params,
			});

			const onSuccess = (data, response) => {
				dispatch({
					type: `@@wp/${name}/fetched-all/${endpoint}`,
					ok: true,
					totalPages: parseInt(response.headers.get('X-WP-TotalPages'), 10),
					total: parseInt(response.headers.get('X-WP-Total'), 10),
					results: data,
					params,
				});
			};

			const onError = (error) => {
				dispatch({
					type: `@@wp/${name}/fetched-all/${endpoint}`,
					ok: false,
					message: error,
					params,
				});
			};

			fetchAll(`${trimEnd(host, '/')}/${namespace}/${endpoint}`, params, onSuccess, onError);
		};

		actions[`fetch${upperFirst(endpoint)}ById`] = (id, params = {}) => (dispatch) => {
			dispatch({
				type: `@@wp/${name}/fetching-by-id/${endpoint}`,
				id,
				params,
			});

			const onSuccess = (json) => {
				dispatch({
					type: `@@wp/${name}/fetched-by-id/${endpoint}`,
					ok: true,
					result: json,
					id,
					params,
				});
			};

			const onError = (error) => {
				dispatch({
					type: `@@wp/${name}/fetched-by-id/${endpoint}`,
					ok: false,
					message: error,
					id,
					params,
				});
			};

			fetchSingle(`${trimEnd(host, '/')}/${namespace}/${endpoint}/${id}?${qs(params)}`, onSuccess, onError);
		};
	});

	return actions;
}

export function createRequests(host, endpoints, namespace = 'wp/v2') {
	const requests = {};

	endpoints.forEach((endpoint) => {
		requests[`request${upperFirst(endpoint)}`] = params => fetch(`${trimEnd(host, '/')}/${namespace}/${endpoint}?${qs(params)}`);
		requests[`request${upperFirst(endpoint)}ById`] = (id, params) => fetch(`${trimEnd(host, '/')}/${namespace}/${endpoint}/${id}?${qs(params)}`);
	});

	return requests;
}
