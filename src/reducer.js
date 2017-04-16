export default function createReducer(name) {
	return (state = {}, action = {}) => {
		const obj = {};
		let match = null;

		match = action.type.match(new RegExp(`^@@wp\/${name}\/fetch\/(\w+)$`));
		if (match) {
			obj[match[1]] = {
				data: action.results,
				total: action.total,
				totalPages: action.totalPages
			};

			return Object.assign({}, state, obj)
		}

		match = action.type.match(new RegExp(`^@@wp\/${name}\/fetch-by-id\/(\w+)$`));
		if (match) {
			obj[match[1]] = state[match[1]] || {};
			obj[match[1]][action.id] = action.result;

			return Object.assign({}, state, obj)
		}

		return state;
	};
}