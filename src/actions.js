import trimEnd from 'lodash/trimEnd';
import upperFirst from 'lodash/upperFirst';

import { qs, fetchSingle, fetchAll } from './helpers';

const getSuccessHandler = (dispatch, type, params) => (json, response) => {
	dispatch({
		type,
		ok: true,
		totalPages: parseInt(response.headers.get('X-WP-TotalPages'), 10),
		total: parseInt(response.headers.get('X-WP-Total'), 10),
		results: json,
		params,
	});
};

const getSuccessHandlerById = (dispatch, type, id, params) => (json) => {
	dispatch({
		type,
		ok: true,
		result: json,
		id,
		params,
	});
};

const getErrorHandler = (dispatch, type, params) => (error) => {
	dispatch({
		type,
		ok: false,
		message: error,
		params,
	});
};

const getErrorHandlerById = (dispatch, type, id, params) => (error) => {
	dispatch({
		type,
		ok: false,
		message: error,
		id,
		params,
	});
};

export default function createActions(name, host, endpoints, namespace = 'wp/v2') {
	const actions = {};
	const normalizedHost = trimEnd(host, '/');

	endpoints.forEach((endpoint) => {
		const endpointName = upperFirst(endpoint);

		actions[`fetch${endpointName}`] = (params = {}) => (dispatch) => {
			const type = `@@wp/${name}/fetched/${endpoint}`;

			dispatch({
				type: `@@wp/${name}/fetching/${endpoint}`,
				params,
			});

			fetchSingle(
				`${normalizedHost}/${namespace}/${endpoint}?${qs(params)}`,
				getSuccessHandler(dispatch, type, params),
				getErrorHandler(dispatch, type, params),
			);
		};

		actions[`fetch${endpointName}Endpoint`] = (endpoint2, params = {}) => (dispatch) => {
			const type = `@@wp/${name}/fetched/${endpoint}/${endpoint2}`;

			dispatch({
				type: `@@wp/${name}/fetching/${endpoint}/${endpoint2}`,
				params,
			});

			fetchSingle(
				`${normalizedHost}/${namespace}/${endpoint}/${endpoint2}?${qs(params)}`,
				getSuccessHandler(dispatch, type, params),
				getErrorHandler(dispatch, type, params),
			);
		};

		actions[`fetchAll${endpointName}`] = (params = {}) => (dispatch) => {
			const type = `@@wp/${name}/fetched-all/${endpoint}`;

			dispatch({
				type: `@@wp/${name}/fetching-all/${endpoint}`,
				params,
			});

			fetchAll(
				`${normalizedHost}/${namespace}/${endpoint}`,
				params,
				getSuccessHandler(dispatch, type, params),
				getErrorHandler(dispatch, type, params),
			);
		};

		actions[`fetchAll${endpointName}Endpoint`] = (endpoint2, params = {}) => (dispatch) => {
			const type = `@@wp/${name}/fetched-all/${endpoint}/${endpoint2}`;

			dispatch({
				type: `@@wp/${name}/fetching-all/${endpoint}/${endpoint2}`,
				params,
			});

			fetchAll(
				`${normalizedHost}/${namespace}/${endpoint}/${endpoint2}`,
				params,
				getSuccessHandler(dispatch, type, params),
				getErrorHandler(dispatch, type, params),
			);
		};

		actions[`fetch${endpointName}ById`] = (id, params = {}) => (dispatch) => {
			const type = `@@wp/${name}/fetched-by-id/${endpoint}`;

			dispatch({
				type: `@@wp/${name}/fetching-by-id/${endpoint}`,
				id,
				params,
			});

			fetchSingle(
				`${normalizedHost}/${namespace}/${endpoint}/${id}?${qs(params)}`,
				getSuccessHandlerById(dispatch, type, id, params),
				getErrorHandlerById(dispatch, type, id, params),
			);
		};

		actions[`fetch${endpointName}EndpointById`] = (id, endpoint2, params = {}) => (dispatch) => {
			const type = `@@wp/${name}/fetched-by-id/${endpoint}/${endpoint2}`;

			dispatch({
				type: `@@wp/${name}/fetching-by-id/${endpoint}/${endpoint2}`,
				id,
				params,
			});

			fetchSingle(
				`${normalizedHost}/${namespace}/${endpoint}/${id}/${endpoint2}?${qs(params)}`,
				getSuccessHandlerById(dispatch, type, id, params),
				getErrorHandlerById(dispatch, type, id, params),
			);
		};
	});

	return actions;
}
