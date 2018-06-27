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

const ZOOM_MAX = 8;
const ZOOM_MIN = 1;

const SVGOrigin = Origin.wrapBy('g');

const threatTooltip = threat => (
    <ul className="threat-tooltip">
        <li><strong>{threat.owner}</strong> </li>
        <li className="spacer" />
        <li><strong>IP:</strong> {threat.ip}</li>
        <li><strong>Function:</strong> {threat.function}</li>
        {/* <li><strong>Coordinates:</strong> {threat.coordinates.map(p=>p.toFixed(2)).join(", ")}</li> */}
        <li><strong>Virus:</strong> {threat.virus.join(", ")}</li>
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
        const clearing = setInterval( this.props.clear, 20 * 1000);
        
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

    handleMarkerClick = (threat) => {
        this.setState({
            center: this.state.zoom >= 4 ? [0, 0] : threat.coordinates,
            zoom: this.state.zoom >= 4 ? 1 : 4,
        });
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
                <div className="zoom-wrapper">
                    <button title="Zoom In" onClick={this.handleZoomIn}>+</button>
                    <button title="Zoom Out" onClick={this.handleZoomOut}>-</button>
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
                        {this.props.threats.map((threat) => {

                            // original dont have coordinates why??
                            // eslint-disable-next-line no-param-reassign
                            threat.coordinates = threat.coordinates || [134.50, 79.22];

                            return (
                                <Marker 
                                    marker={{ coordinates: threat.coordinates }}
                                    className="marker"
                                    onClick={() => this.handleMarkerClick(threat)}>
                                    <SVGOrigin className="tooltip-wrapper" content={threatTooltip(threat)}>
                                        <circle
                                            className={`threat-marker ${this.state.zoom >= 4 ? "zoom-out" : "zoom-in"}`}
                                            key={threat.coordinates.join("-")}
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
        app: state.app,
        threats: state.app.get("threats").toJS() 
    };
}

function mapDispatchToProps(dispatch){
    return {
        clear: () => dispatch(Actions.clear())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreatMap);