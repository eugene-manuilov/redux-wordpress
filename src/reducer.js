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

	prepareNewState(action) {
		const state = {};

		if (action.results) {
			state.data = this.normalizeData(action.results);
		}

		if (typeof action.total !== 'undefined') {
			state.total = action.total;
		}

		if (typeof action.totalPages !== 'undefined') {
			state.totalPages = action.totalPages;
		}

		return state;
	}
}

class FetchReducer extends Reducer {
	match(type) {
		return type.match(new RegExp(`^@@wp/${this.name}/fetched/(\\w+)$`));
	}

	map(state, action) {
		const obj = {};
		const self = this;
		const match = self.match(action.type);

		obj[match[1]] = Object.assign({}, state[match[1]] || {}, self.prepareNewState(action));

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

class FetchEndpointReducer extends Reducer {
	match(type) {
		return type.match(new RegExp(`^@@wp/${this.name}/fetched/(\\w+)/(\\w+)$`));
	}

	map(state, action) {
		const obj = {};
		const self = this;
		const match = self.match(action.type);

		obj[match[1]] = Object.assign({}, state[match[1]] || {});
		obj[match[1]][match[2]] = Object.assign(
			{},
			obj[match[1]][match[2]] || {},
			self.prepareNewState(action),
		);

		return Object.assign({}, state, obj);
	}
}

class FetchEndpointByIdReducer extends Reducer {
	match(type) {
		return type.match(new RegExp(`^@@wp/${this.name}/fetched-by-id/(\\w+)/(\\w+)$`));
	}

	map(state, action) {
		const obj = {};
		const self = this;
		const match = self.match(action.type);

		obj[match[1]] = Object.assign({}, state[match[1]] || {});
		obj[match[1]].data = obj[match[1]].data || [];
		obj[match[1]].data[action.id] = obj[match[1]].data[action.id] || {};

		obj[match[1]].data[action.id][match[2]] = Object.assign(
			{},
			obj[match[1]].data[action.id][match[2]] || {},
			self.prepareNewState(action),
		);

		return Object.assign({}, state, obj);
	}
}

class FetchAllEndpointReducer extends FetchEndpointReducer {
	match(type) {
		return type.match(new RegExp(`^@@wp/${this.name}/fetched-all/(\\w+)/(\\w+)$`));
	}
}

class FetchAllEndpointByIdReducer extends FetchEndpointByIdReducer {
	match(type) {
		return type.match(new RegExp(`^@@wp/${this.name}/fetched-all-by-id/(\\w+)/(\\w+)$`));
	}
}

export default function createReducer(name) {
	const reducers = [
		new FetchReducer(name),
		new FetchAllReducer(name),
		new FetchByIdReducer(name),
		new FetchEndpointReducer(name),
		new FetchEndpointByIdReducer(name),
		new FetchAllEndpointReducer(name),
		new FetchAllEndpointByIdReducer(name),
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
