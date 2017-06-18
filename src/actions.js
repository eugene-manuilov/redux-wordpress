import { qs, upperFirst, trimEnd, fetchSingle, fetchAll } from './helpers';

const getSuccessAction = (json, response, type, params) => {
	const action = {
		type,
		ok: true,
		results: json,
		params,
	};

	if (response) {
		const totalPages = parseInt(response.headers.get('X-WP-TotalPages'), 10);
		if (!isNaN(totalPages)) {
			action.totalPages = totalPages;
		}

		const total = parseInt(response.headers.get('X-WP-Total'), 10);
		if (!isNaN(total)) {
			action.total = total;
		}
	}

	return action;
};

const getSuccessHandler = (dispatch, type, params) => (data) => {
	dispatch(getSuccessAction(data.json, data.response, type, params));
};

const getSuccessHandlerById = (dispatch, type, id, params) => (data) => {
	const action = getSuccessAction(data.json, data.response, type, params);
	action.id = id;
	dispatch(action);
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

export default function createActions(name, host, endpoints, args = {}) {
	let options = args;

	// fallback for previous version of this function where the last param was
	// for namespace argument
	if (typeof args === 'string') {
		options = { namespace: args };
	}

	const actions = {};
	const normalizedHost = trimEnd(host, '/');
	const namespace = options.namespace || 'wp/v2';

	endpoints.forEach((endpoint) => {
		const endpointName = upperFirst(endpoint);

		if (options.fetch !== false) {
			actions[`fetch${endpointName}`] = (params = {}) => (dispatch) => {
				const type = `@@wp/${name}/fetched/${endpoint}`;

				dispatch({
					type: `@@wp/${name}/fetching/${endpoint}`,
					params,
				});

				return fetchSingle(
					`${normalizedHost}/${namespace}/${endpoint}?${qs(params)}`,
					getSuccessHandler(dispatch, type, params),
					getErrorHandler(dispatch, type, params),
				);
			};
		}

		if (options.fetchEndpoint !== false) {
			actions[`fetch${endpointName}Endpoint`] = (endpoint2, params = {}) => (dispatch) => {
				const type = `@@wp/${name}/fetched/${endpoint}/${endpoint2}`;

				dispatch({
					type: `@@wp/${name}/fetching/${endpoint}/${endpoint2}`,
					params,
				});

				return fetchSingle(
					`${normalizedHost}/${namespace}/${endpoint}/${endpoint2}?${qs(params)}`,
					getSuccessHandler(dispatch, type, params),
					getErrorHandler(dispatch, type, params),
				);
			};
		}

		if (options.fetchById !== false) {
			actions[`fetch${endpointName}ById`] = (id, params = {}) => (dispatch) => {
				const type = `@@wp/${name}/fetched-by-id/${endpoint}`;

				dispatch({
					type: `@@wp/${name}/fetching-by-id/${endpoint}`,
					id,
					params,
				});

				return fetchSingle(
					`${normalizedHost}/${namespace}/${endpoint}/${id}?${qs(params)}`,
					getSuccessHandlerById(dispatch, type, id, params),
					getErrorHandlerById(dispatch, type, id, params),
				);
			};
		}

		if (options.fetchEndpointById !== false) {
			actions[`fetch${endpointName}EndpointById`] = (id, endpoint2, params = {}) => (dispatch) => {
				const type = `@@wp/${name}/fetched-by-id/${endpoint}/${endpoint2}`;

				dispatch({
					type: `@@wp/${name}/fetching-by-id/${endpoint}/${endpoint2}`,
					id,
					params,
				});

				return fetchSingle(
					`${normalizedHost}/${namespace}/${endpoint}/${id}/${endpoint2}?${qs(params)}`,
					getSuccessHandlerById(dispatch, type, id, params),
					getErrorHandlerById(dispatch, type, id, params),
				);
			};
		}

		if (options.fetchAll !== false) {
			actions[`fetchAll${endpointName}`] = (params = {}) => (dispatch) => {
				const type = `@@wp/${name}/fetched-all/${endpoint}`;

				dispatch({
					type: `@@wp/${name}/fetching-all/${endpoint}`,
					params,
				});

				return fetchAll(
					`${normalizedHost}/${namespace}/${endpoint}`,
					params,
					getSuccessHandler(dispatch, type, params),
					getErrorHandler(dispatch, type, params),
				);
			};
		}

		if (options.fetchAllEndpoint !== false) {
			actions[`fetchAll${endpointName}Endpoint`] = (endpoint2, params = {}) => (dispatch) => {
				const type = `@@wp/${name}/fetched-all/${endpoint}/${endpoint2}`;

				dispatch({
					type: `@@wp/${name}/fetching-all/${endpoint}/${endpoint2}`,
					params,
				});

				return fetchAll(
					`${normalizedHost}/${namespace}/${endpoint}/${endpoint2}`,
					params,
					getSuccessHandler(dispatch, type, params),
					getErrorHandler(dispatch, type, params),
				);
			};
		}

		if (options.fetchAllEnpointById !== false) {
			actions[`fetchAll${endpointName}EndpointById`] = (id, endpoint2, params = {}) => (dispatch) => {
				const type = `@@wp/${name}/fetched-all-by-id/${endpoint}/${endpoint2}`;

				dispatch({
					type: `@@wp/${name}/fetching-all-by-id/${endpoint}/${endpoint2}`,
					id,
					params,
				});

				return fetchAll(
					`${normalizedHost}/${namespace}/${endpoint}/${id}/${endpoint2}`,
					params,
					getSuccessHandlerById(dispatch, type, id, params),
					getErrorHandlerById(dispatch, type, id, params),
				);
			};
		}
	});

	return actions;
}
