import { createStore, combineReducers, applyMiddleware } from "redux";
import { reducer as tooltipReducer, middleware as tooltipMiddleware } from 'redux-tooltip';
import thunk from 'redux-thunk';

// Reducers
import appReducers from "./reducers";



const rootReducer = combineReducers({
	app: appReducers,
	tooltip: tooltipReducer
});


export default function configureStore(initialState = {}) {

	const store = createStore(rootReducer, initialState, applyMiddleware(thunk, tooltipMiddleware) );

	return store;
}
