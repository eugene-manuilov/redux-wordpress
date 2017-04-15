import fetch from 'isomorphic-fetch';
import { trimEnd, upperFirst } from 'lodash';

export default function createActions(name, host, endpoints, namespace = 'wp/v2') {
	const actions = {};

	for (const endpoint of endpoints) {
		actions[`fetch${upperFirst(endpoint)}`] = (params = {}) => {
			return dispatch => {
				fetch(`${trimEnd(host, '/')}/${namespace}/${endpoint}`).then(response => {
					if (200 === response.status) {
						response.json().then(data => {
							dispatch({
								type: `@@wordpress/${name}/fetch/${endpoint}`,
								totalPages: parseInt(response.headers.get('X-WP-TotalPages')),
								total: parseInt(response.headers.get('X-WP-Total')),
								results: data
							});
						});
					}
				});
			};
		};
	}

	return actions;
}