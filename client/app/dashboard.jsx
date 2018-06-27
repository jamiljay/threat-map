import React from 'react';
import { Tooltip } from 'redux-tooltip';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { withSocket } from './components/socket';

import * as Actions from './store/actions';

import Navbar from './components/navbar';
import Map from './components/map';
import Barchart from './components/barchart';

import './style.scss';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.props.socket.on("threats-discovered", data => {
            this.props.update(data.threats);
        });
    }

    componentDidMount(){
        this.props.load();
    }
    
    render () {

        return (
            <div className="app-layout">
                <Navbar />
                <Switch>
                    <Route exact path='/' component={Map}/>
                    <Route path='/barchart' component={Barchart}/>
                </Switch>
                <Tooltip />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { threats: state.app.get("threats").toJS() }
}


function mapDispatchToProps(dispatch){
    return {
        update: threats=>dispatch(Actions.update(threats)),
        load: ()=>dispatch(Actions.load())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withSocket(Dashboard));