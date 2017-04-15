export default function createActions(host, namespace, options = {}) {
	const actions = {};

	if (options.cpt && Array.isArray(options.cpt)) {
		for (const cpt of options.cpt) {
			actions[`fetch${cpt}`] = (params = {}) => {
				return dispatch => {

				};
			};
		}
	}

	return actions;
}