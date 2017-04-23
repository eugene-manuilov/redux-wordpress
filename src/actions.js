import fetch from 'isomorphic-fetch';
import trimEnd from 'lodash/trimEnd';
import upperFirst from 'lodash/upperFirst';

const qs = params => Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

const fetchApi = (url, success, error) => fetch(url)
	.then((response) => {
		if (response.ok) {
			response.json().then(data => success(data, response)).catch(error);
		} else {
			error(response.statusText);
		}
	})
	.catch(error);

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

			fetchApi(`${trimEnd(host, '/')}/${namespace}/${endpoint}?${qs(params)}`, onSuccess, onError);
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

			fetchApi(`${trimEnd(host, '/')}/${namespace}/${endpoint}/${id}?${qs(params)}`, onSuccess, onError);
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
