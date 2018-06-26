import React, { Component, Children } from 'react';
import PropTypes from "prop-types";

class SocketProvider extends Component {
    
    static propTypes = {
        // eslint-disable-next-line react/forbid-prop-types
        socket: PropTypes.object.isRequired
    }

    // you must specify what you’re adding to the context
    static childContextTypes = {
        socket: PropTypes.object.isRequired
    }

	getChildContext() {
		const { socket } = this.props;
		return { socket };
    }
    
	render() {
		// `Children.only` enables us not to add a <div /> for nothing
		return Children.only(this.props.children);
	}
}



export function withSocket(WrappedComponent) {
    const Wrapper = (props, { socket }) => (
        <WrappedComponent
            socket={socket}
            {...props}
        />
    );

    Wrapper.contextTypes = { socket: PropTypes.object.isRequired };

    return Wrapper;
}

export default SocketProvider;