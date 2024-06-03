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
import MapLine from "./MapLine";
import { UW_LATITUDE_CENTER, UW_LONGITUDE_CENTER } from "./Constants";

// This defines the location of the map. These are the coordinates of the UW Seattle campus
const position: LatLngExpression = [UW_LATITUDE_CENTER, UW_LONGITUDE_CENTER];

// NOTE: This component is a suggestion for you to use, if you would like to. If
// you don't want to use this component, you're free to delete it or replace it
// with your hw-lines Map
/**
 * Represents the interface of Map's props
 * @field path: the array containing point and cost of each edge of the first path user want
 *        path2: the array containing point and cost of each edge of the second path user want
 */
interface MapProps {
  // TODO: Define the props of this component.
    path: any[]
    path2: any[]
}

interface MapState {}

/**
 * A class that represents the map and its path in the application
 */
class Map extends Component<MapProps, MapState> {
  render() {
      let lines: JSX.Element[] = [];
      for (let i = 0; i < this.props.path.length; i++) {
          lines.push(<MapLine key={i} x1={this.props.path[i].start.x} y1={this.props.path[i].start.y}
                              x2={this.props.path[i].end.x} y2={this.props.path[i].end.y} color={"blue"} />);
      }

      let lines2: JSX.Element[] = [];

      // for loops to check overlapped path part and turn them to red for clarity
      for (let i = 0; i < this.props.path2.length; i++) {
          lines2.push(<MapLine key={-i} x1={this.props.path2[i].start.x} y1={this.props.path2[i].start.y}
                              x2={this.props.path2[i].end.x} y2={this.props.path2[i].end.y} color={"green"} />);
          for (let j = 0; j < lines.length; j++) {
              if ((lines[j].props.x1 === this.props.path2[i].start.x && lines[j].props.y1 === this.props.path2[i].start.y
                  && lines[j].props.x2 === this.props.path2[i].end.x && lines[j].props.y2 === this.props.path2[i].end.y)
              || (lines[j].props.x1 === this.props.path2[i].end.x && lines[j].props.y1 === this.props.path2[i].end.y
                      && lines[j].props.x2 === this.props.path2[i].start.x && lines[j].props.y2 === this.props.path2[i].start.y)) {
                  lines2.pop();
                  lines.splice(j, 1);
                  lines2.push(<MapLine key={-i} x1={this.props.path2[i].start.x} y1={this.props.path2[i].start.y}
                                       x2={this.props.path2[i].end.x} y2={this.props.path2[i].end.y} color={"red"} />);
                  break;
              }
          }
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
            // <MapLine key="key1" color="red" x1={1000} y1={1000} x2={2000} y2={2000}/>
            // will draw a red line from the point 1000,1000 to 2000,2000 on the
            // map. Note that key should be a unique key that only this MapLine has.
              lines
          }
          {lines2}
        </MapContainer>
      </div>
    );
  }
}

export default Map;
