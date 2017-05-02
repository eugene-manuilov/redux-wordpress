import trimEnd from 'lodash/trimEnd';
import upperFirst from 'lodash/upperFirst';

import { qs, fetchSingle, fetchAll } from './helpers';

export default function createActions(name, host, endpoints, namespace = 'wp/v2') {
	const actions = {};
	const normalizedHost = trimEnd(host, '/');

	endpoints.forEach((endpoint) => {
		const endpointName = upperFirst(endpoint);

		actions[`fetch${endpointName}`] = (params = {}) => (dispatch) => {
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

			fetchSingle(`${normalizedHost}/${namespace}/${endpoint}?${qs(params)}`, onSuccess, onError);
		};

		actions[`fetch${endpointName}Endpoint`] = (endpoint2, params = {}) => (dispatch) => {
			dispatch({
				type: `@@wp/${name}/fetching/${endpoint}/${endpoint2}`,
				params,
			});

			const onSuccess = (json, response) => {
				dispatch({
					type: `@@wp/${name}/fetched/${endpoint}/${endpoint2}`,
					ok: true,
					totalPages: parseInt(response.headers.get('X-WP-TotalPages'), 10),
					total: parseInt(response.headers.get('X-WP-Total'), 10),
					results: json,
					params,
				});
			};

			const onError = (error) => {
				dispatch({
					type: `@@wp/${name}/fetched/${endpoint}/${endpoint2}`,
					ok: false,
					message: error,
					params,
				});
			};

			fetchSingle(`${normalizedHost}/${namespace}/${endpoint}/${endpoint2}?${qs(params)}`, onSuccess, onError);
		};

		actions[`fetchAll${endpointName}`] = (params = {}) => (dispatch) => {
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

			fetchAll(`${normalizedHost}/${namespace}/${endpoint}`, params, onSuccess, onError);
		};

		actions[`fetch${endpointName}ById`] = (id, params = {}) => (dispatch) => {
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

			fetchSingle(`${normalizedHost}/${namespace}/${endpoint}/${id}?${qs(params)}`, onSuccess, onError);
		};

		actions[`fetch${endpointName}EndpointById`] = (id, endpoint2, params = {}) => (dispatch) => {
			dispatch({
				type: `@@wp/${name}/fetching-by-id/${endpoint}/${endpoint2}`,
				id,
				params,
			});

			const onSuccess = (json) => {
				dispatch({
					type: `@@wp/${name}/fetched-by-id/${endpoint}/${endpoint2}`,
					ok: true,
					result: json,
					id,
					params,
				});
			};

			const onError = (error) => {
				dispatch({
					type: `@@wp/${name}/fetched-by-id/${endpoint}/${endpoint2}`,
					ok: false,
					message: error,
					id,
					params,
				});
			};

			fetchSingle(`${normalizedHost}/${namespace}/${endpoint}/${id}/${endpoint2}?${qs(params)}`, onSuccess, onError);
		};
	});

	return actions;
}
