/*
 * Copyright (C) 2022 Kevin Zatloukal.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Spring Quarter 2022 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */

import { LatLngExpression } from "leaflet";
import React, { Component } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { UW_LATITUDE_CENTER, UW_LONGITUDE_CENTER } from "./Constants";

// This defines the location of the map. These are the coordinates of the UW Seattle campus
const position: LatLngExpression = [UW_LATITUDE_CENTER, UW_LONGITUDE_CENTER];

interface MapProps {
  // TODO: Define the props of this component. You will want to pass down edges
  // so you can render them here
    edgeList: JSX.Element[]|Number[];
    fixedEdgeList: JSX.Element[];
}

interface MapState {}

class Map extends Component<MapProps, MapState> {

  render() {
      let arrEdge: JSX.Element[]|Number[];
      if(this.props.edgeList.length === 2 && (this.props.edgeList[0] === 0 || this.props.edgeList[0] === 1)) {
          arrEdge = [];
      } else {
          // @ts-ignore
          arrEdge = this.props.edgeList.concat(this.props.fixedEdgeList);
      }

    return (
      <div id="map">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {
            // TODO: Render map lines here using the MapLine component. E.g.
            // <MapLine key={key1} color="red" x1={1000} y1={1000} x2={2000} y2={2000}/>
            // will draw a red line from the point 1000,1000 to 2000,2000 on the
            // map
              arrEdge
          }
        </MapContainer>
      </div>
    );
  }
}

export default Map;
