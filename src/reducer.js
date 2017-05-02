export default function createReducer(name) {
	return (state = {}, action = {}) => {
		const obj = {};
		let match = null;

		match = action.type.match(new RegExp(`^@@wp/${name}/fetched/(\\w+)$`));
		if (!match) {
			match = action.type.match(new RegExp(`^@@wp/${name}/fetched-all/(\\w+)$`));
		}

		if (match && action.ok) {
			obj[match[1]] = Object.assign({}, state[match[1]] || {}, {
				data: action.results,
				total: action.total,
				totalPages: action.totalPages,
			});

			return Object.assign({}, state, obj);
		}

		match = action.type.match(new RegExp(`^@@wp/${name}/fetched-by-id/(\\w+)$`));
		if (match && action.ok) {
			obj[match[1]] = state[match[1]] || {};
			obj[match[1]][action.id] = action.result;

			return Object.assign({}, state, obj);
		}

		return state;
	};
}
