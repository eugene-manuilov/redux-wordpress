export function qs(params, parent = false) {
	return Object
		.keys(params)
		.sort()
		.map((key) => {
			const encode = encodeURIComponent;

			if (Array.isArray(params[key])) {
				return params[key]
					.map((value, i) => {
						if (!parent) {
							return `${encode(key)}[${encode(i)}]=${encode(value)}`;
						}

						return `${encode(parent)}[${encode(key)}][${encode(i)}]=${encode(value)}`;
					})
					.join('&');
			} else if (typeof params[key] === 'object') {
				return qs(params[key], key);
			}

			return !parent
				? `${encode(key)}=${encode(params[key])}`
				: `${encode(parent)}[${encode(key)}]=${encode(params[key])}`;
		})
		.join('&');
}

export function upperFirst(name) {
	return name
		.split(/( |-|_)/)
		.filter(item => item !== ' ' && item !== '-' && item !== '_')
		.map(item => item.toLowerCase())
		.map(item => item[0].toUpperCase() + item.slice(1))
		.join('');
}
export function trimEnd(message, char) {
	return message[message.length - 1] === char
		? trimEnd(message.slice(0, -1), char)
		: message;
}

export function requestSingle(url) {
	const requestPromise = new Promise((resolve, reject) => {
		fetch(url)
			.then((response) => {
				if (response.ok) {
					response
						.json()
						.then(json => resolve({ json, response }))
						.catch(error => reject(error));
				} else {
					reject(response.statusText);
				}
			})
			.catch(reject);
	});

	return requestPromise;
}

export function fetchSingle(url, success, error) {
	return requestSingle(url).then(success).catch(error);
}

export function requestAll(url, params = {}) {
	const fetchPage = (pagenum, data, resolve, reject) => {
		fetch(`${url}?${qs(Object.assign({ per_page: 100 }, params, { page: pagenum }))}`)
			.then((response) => {
				if (response.ok) {
					response
						.json()
						.then((items) => {
							items.forEach(item => data.push(item));

							let totalpages = parseInt(response.headers.get('X-WP-TotalPages'), 10);
							if (isNaN(totalpages)) {
								totalpages = 0;
							}

							if (pagenum >= totalpages) {
								resolve({ json: data, response });
							} else {
								fetchPage(pagenum + 1, data, resolve, reject);
							}
						})
						.catch(error => reject(error));
				} else {
					reject(response.statusText);
				}
			})
			.catch(error => reject(error));
	};

	return new Promise((resolve, reject) => fetchPage(params.page || 1, [], resolve, reject));
}

export function fetchAll(url, params, onSuccess, onError) {
	return requestAll(url, params).then(onSuccess).catch(onError);
}

export default {
	qs,
	fetchSingle,
	fetchAll,
};
