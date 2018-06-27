import Immutable from "immutable";

import { CLEAR, LOAD, UPDATE } from "./actions";

const init = Immutable.fromJS({
	threats: [],
	dataCounts: {
		trojans: 0,
		bots: 0,
		spam: 0,
		total: 0
	}
});

function threatCounts (threats, dataCounts) {
	return Immutable.fromJS(threats.reduce((c,t)=>{
		/* eslint-disable no-param-reassign */
		if (t.virus.indexOf("APT1") > -1) c.trojans++;
		if (t.virus.indexOf("StealCreds") > -1) c.trojans++;
		if (t.virus.indexOf("Botnet") > -1) c.bots++;
		if (t.virus.indexOf("Spam") > -1) c.spam++;

		c.total += t.virus.length;
		/* eslint-enable */

		return c;
	}, dataCounts.toJS()));
}


function appReducer(stateMap = init, action) {
	let newState = null; 

	switch (action.type) {
		case CLEAR:
			return stateMap.set("threats", Immutable.List());

		case LOAD:
			newState = stateMap.set("dataCounts", threatCounts(action.threats, stateMap.get("dataCounts")));

			return newState.set("threats", Immutable.fromJS(action.threats));

		case UPDATE:
			newState = stateMap.set("dataCounts", threatCounts(action.threats, stateMap.get("dataCounts")));

			return newState.set("threats", stateMap.get("threats").concat(Immutable.fromJS(action.threats)));

		default:
			return stateMap;
	}
}

export default appReducer;
