import fetch from 'isomorphic-fetch';
import trimEnd from 'lodash/trimEnd';
import upperFirst from 'lodash/upperFirst';

const qs = params => Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');

export default function createActions(name, host, endpoints, namespace = 'wp/v2') {
	const actions = {};

	for (const endpoint of endpoints) {

		actions[`fetch${upperFirst(endpoint)}`] = (params = {}) => {
			return dispatch => {
				fetch(`${trimEnd(host, '/')}/${namespace}/${endpoint}?${qs(params)}`)
					.then(response => {
						if (response.ok) {
							response.json().then(data => {
								dispatch({
									type: `@@wordpress/${name}/fetch/${endpoint}`,
									totalPages: parseInt(response.headers.get('X-WP-TotalPages')),
									total: parseInt(response.headers.get('X-WP-Total')),
									results: data
								});
							}).catch(e => {
								// @todo: catch json parsing error
							});
						} else {
							// @todo: catch non-OK requests
						}
					}).catch(e => {
						// @todo: catch failed requests
					});
			};
		};

	}

	return actions;
}