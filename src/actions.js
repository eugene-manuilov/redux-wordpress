import fetch from 'isomorphic-fetch';
import trimEnd from 'lodash/trimEnd';
import upperFirst from 'lodash/upperFirst';

const qs = params => Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

const fetchApi = (url, success, error) => {
	fetch(url).then(response => {
		if (response.ok) {
			response.json().then(data => success(data, response)).catch(error);
		} else {
			error();
		}
	}).catch(error);
};

export default function createActions(name, host, endpoints, namespace = 'wp/v2') {
	const actions = {};

	for (const endpoint of endpoints) {

		actions[`fetch${upperFirst(endpoint)}`] = (params = {}) => {
			return dispatch => {
				dispatch({
					type: `@@wp/${name}/fetching/${endpoint}`,
					params
				});

				fetchApi(
					`${trimEnd(host, '/')}/${namespace}/${endpoint}?${qs(params)}`,

					(json, response) => {
						dispatch({
							type: `@@wp/${name}/fetched/${endpoint}`,
							ok: true,
							totalPages: parseInt(response.headers.get('X-WP-TotalPages')),
							total: parseInt(response.headers.get('X-WP-Total')),
							results: json
						});
					},

					() => {
						// @todo: catch json parsing error
					}
				);
			};
		};

		actions[`fetch${upperFirst(endpoint)}ById`] = (id, params = {}) => {
			return dispatch => {
				dispatch({
					type: `@@wp/${name}/fetching-by-id/${endpoint}`,
					id,
					params
				});

				fetchApi(
					`${trimEnd(host, '/')}/${namespace}/${endpoint}/${id}?${qs(params)}`,

					(json, response) => {
						dispatch({
							type: `@@wp/${name}/fetched-by-id/${endpoint}`,
							ok: true,
							result: json,
							id
						});
					},

					()=> {
						// @todo: catch json parsing error
					}
				);
			};
		};

	}

	return actions;
}