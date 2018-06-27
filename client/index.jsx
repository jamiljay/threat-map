import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { BrowserRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import "bootstrap/dist/css/bootstrap.css";

import "font-awesome/scss/font-awesome.scss";

import openSocket from "socket.io-client";

import App from './app/dashboard';

import SocketProvider from "./app/components/socket";

import configureStore from "./app/store/configureStore";

React.PropTypes = PropTypes; // fix for redux-tooltip 


const store = configureStore();

// TODO: update URL for Test & Prod
const socket = openSocket("http://localhost:8080");


const render = Root => {
	ReactDOM.render(<AppContainer>
			<Provider store={store}>
				<SocketProvider socket={socket}>
					<BrowserRouter>
						<Root />
					</BrowserRouter>
				</SocketProvider>
			</Provider>
		</AppContainer>, 
		document.getElementById("root")
	);
}

render(App);

if (module.hot) {
	window.store = store; // view store in console
    module.hot.accept('./app/dashboard', () => { render(App) });
}