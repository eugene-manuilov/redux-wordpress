export function fetch() {
	return (dispatch) => {
		dispatch({
			type: '@@wordpress/fetch'
		});
	};
}