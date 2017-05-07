class Reducer {
	constructor(name) {
		this.name = name;
	}

	match() {
		return false;
	}

	map(state) {
		return state;
	}

	normalizeData(data) {
		if (Array.isArray(data)) {
			const items = [];
			data.forEach((item) => {
				const id = parseInt(item.id, 10);
				if (isNaN(id)) {
					items.push(item);
				} else {
					items[item.id] = item;
				}
			});
		}

		return data;
	}
}

class FetchReducer extends Reducer {
	match(type) {
		return type.match(new RegExp(`^@@wp/${this.name}/fetched/(\\w+)$`));
	}

	map(state, action) {
		const obj = {};
		const data = {};
		const self = this;
		const match = self.match(action.type);

		if (action.results) {
			data.data = self.normalizeData(action.results);
		}

		if (typeof action.total !== 'undefined') {
			data.total = action.total;
		}

		if (typeof action.totalPages !== 'undefined') {
			data.totalPages = action.totalPages;
		}

		obj[match[1]] = Object.assign({}, state[match[1]] || {}, data);

		return Object.assign({}, state, obj);
	}
}

class FetchAllReducer extends FetchReducer {
	match(type) {
		return type.match(new RegExp(`^@@wp/${this.name}/fetched-all/(\\w+)$`));
	}
}

class FetchByIdReducer extends Reducer {
	match(type) {
		return type.match(new RegExp(`^@@wp/${this.name}/fetched-by-id/(\\w+)$`));
	}

	map(state, action) {
		const obj = {};
		const match = this.match(action.type);

		obj[match[1]] = state[match[1]] || { data: [] };
		obj[match[1]].data[action.id] = action.result;

		return Object.assign({}, state, obj);
	}
}

export default function createReducer(name) {
	const reducers = [
		new FetchReducer(name),
		new FetchAllReducer(name),
		new FetchByIdReducer(name),
	];

	return (state = {}, action = {}) => {
		if (!action.ok) {
			return state;
		}

		let newState = Object.assign({}, state);

		reducers.forEach((reducer) => {
			if (reducer.match(action.type)) {
				newState = reducer.map(newState, action);
			}
		});

		return newState;
	};
}
