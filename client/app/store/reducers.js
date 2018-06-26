import Immutable from "immutable";

import { CLEAR, LOAD, UPDATE } from "./actions";

const init = Immutable.fromJS({
	threats: []
});


function appReducer(stateMap = init, action) {
	switch (action.type) {
		case CLEAR:
			return stateMap.set("threats", Immutable.List());

		case LOAD:
			return stateMap.set("threats", Immutable.fromJS(action.threats));

		case UPDATE:
			return stateMap.set("threats", stateMap.get("threats").concat(Immutable.fromJS(action.threats)));

		default:
			return stateMap;
	}
}

export default appReducer;
