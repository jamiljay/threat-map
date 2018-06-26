/*
 * action types
 */

// summary view actions
export const CLEAR = "CLEAR";
export const LOAD = "LOAD";
export const UPDATE = "UPDATE";

/*
 * action creators
 */
export function clear() {
	return { type: CLEAR };
}

export function update(threats) {
	return { type: UPDATE, threats };
}


export function load() {
	return dispatch => {
		fetch("/rest/data/")
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				dispatch({ type: LOAD, threats: data.threats });
			} else {
				// console.log(`Data Error: ${JSON.stringify(data)}`);
			}
		})
		// .catch(error => {
		// 	console.log(`Request Error: ${JSON.stringify(error)}`);
		// });
	};
}
