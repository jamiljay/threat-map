import React from "react";
import { connect } from "react-redux";
import { Origin } from 'redux-tooltip';
import { feature } from "topojson-client";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker
} from "react-simple-maps";

import * as Actions from '../../store/actions';

import './style.scss';

const CLEAR_INTERVAL = 4 * 1000; // 4 seconds

const ZOOM_MAX = 8;
const ZOOM_MIN = 1;

const SVGOrigin = Origin.wrapBy('g');

const threatTooltip = threat => (
    <ul className="threat-tooltip">
        <li><strong>{threat.owner}</strong> </li>
        <li className="spacer" />
        <li><strong>IP:</strong> {threat.ip}</li>
        <li><strong>Viruses:</strong> {threat.virus.length}</li>
    </ul>
);


class ThreatMap extends React.Component {
    state = {
        worldMap: null,
        moving: false,
        center: [0, 0],
        zoom: 1,
        clearing: -1
    }

    componentWillMount () {
        const clearing = setInterval( this.props.removeMarker, CLEAR_INTERVAL);
        
        this.setState({ clearing });
    }
    
    componentDidMount () {

        fetch("./assets/files/world-110m.json").then(response=>response.json()).then(worldData=>{

            const worldMap = feature(worldData, worldData.objects.countries).features;

            this.setState({ worldMap });
        })
    }

    componentWillUnmount () {
        clearInterval(this.state.clearing);
    }

    handleZoomIn = () => {
        this.setState({
            zoom: this.state.zoom >= ZOOM_MAX ? ZOOM_MAX : this.state.zoom + 1,
        });
    }

    handleZoomOut = () => {
        this.setState({
            zoom: this.state.zoom <= ZOOM_MIN ? ZOOM_MIN : this.state.zoom - 1,
        });
    }

    handleReset = () => {
        this.setState({ zoom: 1, center: [0, 0] });
    }

    handleMarkerClick = (threat) => {

        let center = this.state.zoom >= 4 ? [0, 0] : threat.coordinates;
        let zoom = this.state.zoom >= 4 ? 1 : 4;

        // focus on this threat
        if ( threat.coordinates.join() !== this.state.center.join() ) {

            center = threat.coordinates;
            zoom = 4;
    }

        this.setState({ center, zoom });
    }

    handleMoveStart = () => {
        this.setState({moving: true});
    }

    handleMoveEnd = () => {
        this.setState({moving: false});
    }

    render() {
        return(
            <div className="map-layout">
                <div className="zoom-wrapper btn-group" role="group">
                    <button 
                        title="Zoom In" 
                        onClick={this.handleZoomIn}
                        type="button" 
                        className="btn btn-primary">
                        <i className="fa fa-plus" aria-hidden="true" />
                    </button>
                    <button 
                        title="Zoom Out" 
                        onClick={this.handleZoomOut}
                        type="button" 
                        className="btn btn-primary">
                        <i className="fa fa-minus" aria-hidden="true" />
                    </button>
                        <button 
                            title="Reset" 
                            onClick={this.handleReset}
                            type="button" 
                        className="btn btn-warning">
                        <i className="fa fa-arrows-alt" aria-hidden="true" />
                    </button>
                </div>  
                <div className="count-wrapper">
                    <div className="data-count">Trojans: {this.props.dataCounts.get("trojans").toLocaleString('en')}</div>
                    <div className="data-count">Bots: {this.props.dataCounts.get("bots").toLocaleString('en')}</div>
                    <div className="data-count">Spam: {this.props.dataCounts.get("spam").toLocaleString('en')}</div>
                </div>
                <ComposableMap className={`map ${this.state.moving && "moving"}`} style={{ width: "100%", height: "100%" }}>
                    <ZoomableGroup 
                        zoom={this.state.zoom} 
                        center={this.state.center}
                        onMoveStart={this.handleMoveStart}
                        onMoveEnd={this.handleMoveEnd}>
                        <Geographies geography={this.state.worldMap}>
                            {(geographies, projection) => geographies.map((geography, i) => (
                                <Geography
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={`${geography.id}-${i}`}
                                    geography={ geography }
                                    projection={ projection }
                                    fill={`rgba(72, 120, 169,${1 / this.state.worldMap.length * i})`}
                                    />
                            ))}
                        </Geographies>
                        <Markers>
                        {this.props.markers.map((threat) => {

                            const isZoomed = this.state.zoom >= 4 && this.state.center.join() === threat.coordinates.join();

                            return (
                                <Marker 
                                    key={`${threat.key}`}
                                    marker={{ coordinates: threat.coordinates }}
                                    className="marker"
                                    onClick={() => this.handleMarkerClick(threat)}>
                                    <SVGOrigin content={threatTooltip(threat)}>
                                        <circle
                                            className={`threat-marker ${isZoomed ? "zoom-out" : "zoom-in"}`}
                                            cx={0}
                                            cy={0}
                                            r={threat.virus.length * this.state.zoom * 2}
                                            fill="rgba(233, 30, 99)"
                                            stroke="rgba(199, 14, 77)"
                                        />
                                    </SVGOrigin>
                                </Marker>
                            )})}
                        </Markers>
                    </ZoomableGroup>
                </ComposableMap>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return { 
        dataCounts: state.app.get("dataCounts"),
        markers: state.app.get("markers").toJS() 
    };
}

function mapDispatchToProps(dispatch){
    return {
        removeMarker: () => dispatch(Actions.removeMarker())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreatMap);