export function qs(params) {
	return Object
		.keys(params)
		.sort()
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
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

export function fetchSingle(url, success, error) {
	return fetch(url)
		.then((response) => {
			if (response.ok) {
				response
					.json()
					.then(data => success({ json: data, response }))
					.catch(error);
			} else {
				error(response.statusText);
			}
		})
		.catch(error);
}

export function fetchAll(url, params, onSuccess, onError) {
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

	return (new Promise((resolve, reject) => fetchPage(params.page || 1, [], resolve, reject)))
		.then(onSuccess)
		.catch(onError);
}

export default {
	qs,
	fetchSingle,
	fetchAll,
};
