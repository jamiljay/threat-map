import React from "react";
import { connect } from "react-redux";
import { Origin } from 'redux-tooltip';
import { feature } from "topojson-client";
import { geoMercator } from "d3-geo";
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
        scale: 130,
        translate: [ 800 / 2, (450 + 150) / 2 ],
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

    projection = () => geoMercator().scale(this.state.scale).translate(this.state.translate)

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
                        className="btn btn-secondary">+</button>
                    <button 
                        title="Zoom Out" 
                        onClick={this.handleZoomOut}
                        type="button" 
                        className="btn btn-secondary">-</button>
                        <button 
                            title="Reset" 
                            onClick={this.handleReset}
                            type="button" 
                            className="btn btn-secondary">Reset</button>
                </div>  
                </div>
                <ComposableMap className={`map ${this.state.moving && "moving"}`} style={{ width: "100%", height: "calc(100% - 50px)" }}>
                    <ZoomableGroup 
                        zoom={this.state.zoom} 
                        center={this.state.center}
                        onMoveStart={this.handleMoveStart}
                        onMoveEnd={this.handleMoveEnd}>
                        <Geographies geography={this.state.worldMap}>
                            {(geographies, projection) => geographies.map((geography, i) => (
                                <Geography
                                    key={ geography.id }
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
                                    key={`${threat.coordinates.join("-")}`}
                                    marker={{ coordinates: threat.coordinates }}
                                    className="marker"
                                    onClick={() => this.handleMarkerClick(threat)}>
                                    <SVGOrigin className="tooltip-wrapper" content={threatTooltip(threat)}>
                                        <circle
                                            className={`threat-marker ${isZoomed ? "zoom-out" : "zoom-in"}`}
                                            cx={0}
                                            cy={0}
                                            r={threat.virus.length*2}
                                            fill="rgba(233, 30, 99, 0.5)"
                                            stroke="rgba(199, 14, 77, 0.5)"
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