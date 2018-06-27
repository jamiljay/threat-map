import React from 'react';
import { connect } from 'react-redux';

const ThreatChart = () => (

    <div>Hello World</div>
);


function mapStateToProps(state) {
    return { threats: state.app.get("threats") }
}

export default connect(mapStateToProps)(ThreatChart);