export default function createReducer(name) {
	return (state = {}, action = {}) => {
		const exp = new RegExp(`^@@wordpress\/${name}\/fetch\/(\w+)$`);
		const match = action.type.match(exp);
		const obj = {};

		if (match) {
			obj[match[1]] = {
				data: action.results,
				total: action.total,
				totalPages: action.totalPages
			};

			return Object.assign({}, state, obj)
		}

		return state;
	};
}