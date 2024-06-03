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

import React, {Component} from 'react';

// Allows us to write CSS styles inside App.css, any styles will apply to all components inside <App />
import "./App.css";
import DropDownBar from "./DropDownBar";
import Map from "./Map";

/**
 * Represents the interface of App's state
 * @field shortNames: the collection of all short names of buildings in the map
 *        longNames: the corresponding collection of all full names of the buildings
 *        paths: an array of object that represents the path between two specified buildings
 *        cost: the length cost of the paths
 *        path2: another array ob object that represent another path between other two specified buildings
 *        cost2: the length cost of the paths2
 *        status: representing the number of Drop-Down Bar and map lines we should be able to contain
 */
interface AppState {
    shortNames : string[],
    longNames : string[],

    paths: any[],
    cost: number,

    paths2: any[],
    cost2: number,

    status: number
}

/**
 * A class that represent the application of UW campus map webpage
 */
class App extends Component<{}, AppState> {

    /**
     * Updates the short names and long names of buildings for dropdown box, once for all
     */
    makeRequestData = async () => {
        try{
            let responseShort = await fetch("http://localhost:4567/allShortNames")
            if (!responseShort.ok) {
                alert("Error! Short Response is bad")
                return;
            }
            let responseLong = await fetch("http://localhost:4567/allLongNames");
            if (!responseLong.ok) {
                alert("Error! Long Response is bad")
                return;
            }
            let convert_shortNames:string[] = await responseShort.json();
            let convert_longNames:string[] = await responseLong.json();
            this.setState({
                shortNames: convert_shortNames,
                longNames: convert_longNames,

                paths: this.state.paths,
                cost: this.state.cost,

                paths2: this.state.paths2,
                cost2: this.state.cost2,

                status: this.state.status
            });
        } catch (e) {
            alert("There is an error contacting the server initially.");
            console.log(e);
        }
    }

    /**
     * Update the path between two buildings
     * @param start the start building of this path
     * @param end the end building of this path
     * @param option 1 if the path is updated from the first picker of path
     * throw an alarm to user if there is no path for two buildings selected
     */
    makeRequestPath = async (start:string, end:string, option: number) => {
        try{
            let response = await fetch("http://localhost:4567/findShortPath?startName="+start+"&endName="+end);
            if (!response.ok) {
                alert("Error! Path Response is bad");
                return;
            }
            let output = await response.json();
            if (output === null) {
                alert("Sorry, but there is no path between " + start + " and " + end);
                return;
            }
            let pathList = output.path;
            let pathCost = output.cost;

            if (option === 1) {
                this.setState({
                    shortNames : this.state.shortNames,
                    longNames : this.state.longNames,
                    paths : pathList,
                    cost : pathCost,

                    paths2: this.state.paths2,
                    cost2: this.state.cost2,

                    status: this.state.status
                })
            } else {
                this.setState({
                    shortNames : this.state.shortNames,
                    longNames : this.state.longNames,
                    paths : this.state.paths,
                    cost : this.state.cost,

                    paths2: pathList,
                    cost2: pathCost,

                    status: this.state.status
                })
            }
            console.log("update path and cost");
        } catch (e) {
            alert("There is an error contacting the server when trying to update path.");
            console.log(e);
        }

    }

    constructor(props: any) {
        super(props);
        this.state = {
            shortNames : [],
            longNames : [],
            paths : [],
            cost : -1,
            paths2 : [],
            cost2 : -1,
            status : 1
        }
    }

    componentDidMount() {
        this.makeRequestData();
    }

    /**
     * Rounds the distance in feet into integer value
     * @param distance the accurate distance of a path
     * @return the distance in integer, or empty string if distance < 0(meaning no path selected)
     */
    distanceRounding = (distance:number) => {
        if (distance < 0) {
            return "";
        } else {
            return Math.round(distance);
        }
    }

    /**
     * Returns another dropdown box if user requests
     * @param status the flag showing whether user want 1 or 2 boxes
     * @return nothing if status = 1, or a new dropdown box if status = 2
     */
    anotherBox = (status:number) => {
        if (status === 1) {
            return;
        } else {
            return (
            <div>
                <hr/>
                <DropDownBar shortName={this.state.shortNames} longName={this.state.longNames}
                         onChange={(start, end) =>
                         {   if(start === "") {
                             alert("Your start point of this extra path is empty! Pick a start point in the extra dropdown box under the map");
                             this.setState(
                                 {shortNames : this.state.shortNames,
                                     longNames : this.state.longNames,
                                     paths : this.state.paths,
                                     cost : this.state.cost,
                                     paths2 : [],
                                     cost2 : -1,
                                     status : this.state.status
                                 });
                             return;
                         }
                             if(end === "") {
                                 alert("Your end point of this extra path is empty! Pick an end point in the extra dropdown box under the map");
                                 this.setState(
                                     {shortNames : this.state.shortNames,
                                         longNames : this.state.longNames,
                                         paths : this.state.paths,
                                         cost : this.state.cost,
                                         paths2 : [],
                                         cost2 : -1,
                                         status : this.state.status
                                     });
                                 return;
                             }
                             this.makeRequestPath(start, end, 2);
                             console.log("updating start and end:", start, end);
                         }}
                         onClear={() => {
                             this.setState({
                                 shortNames : this.state.shortNames,
                                 longNames : this.state.longNames,
                                 paths : this.state.paths,
                                 cost : this.state.cost,
                                 paths2 : [],
                                 cost2 : -1,
                                 status : this.state.status
                             });
                         }}
                />
                <h3> Expected Distance of the Green (and if overlapping exists, Red) Path is about: {this.distanceRounding(this.state.cost2)} ft</h3>
                <button onClick={() => {
                    console.log('Close Extra Path onClick was called');
                    this.setState({
                        shortNames : this.state.shortNames,
                        longNames : this.state.longNames,
                        paths : this.state.paths,
                        cost : this.state.cost,
                        paths2 : [],
                        cost2 : -1,
                        status : 1
                    })
                }}>
                    Delete this Extra Path <br/>
                    ✕
                </button>
            </div>
            );
        }
    }

    /**
     * Returns a button giving user power to add a second dropdown box
     * @param status the flag showing whether user want 1 or 2 boxes
     * @return nothing if status = 2, or a unfold button if status = 1
     */
    unfold = (status: number) => {
        if (status === 1) {
            return (
                <button onClick={() => {
                    console.log('Add Another Path onClick was called');
                    this.setState({
                        shortNames : this.state.shortNames,
                        longNames : this.state.longNames,
                        paths : this.state.paths,
                        cost : this.state.cost,
                        paths2 : this.state.paths2,
                        cost2 : this.state.cost,
                        status : 2
                    })
                }}>
                    Add Another Path<br/>
                    ↓
                </button>
            );
        } else {
            return;
        }
    }

    render() {
        return (
            <div style={{textAlign: "center"}}>
                <h1 id="app-title">UW Campus Map!</h1>
                <div>
                    <Map path={this.state.paths} path2={this.state.paths2} />
                </div>
                <DropDownBar shortName={this.state.shortNames} longName={this.state.longNames}
                             onChange={(start, end) =>
                                {   if(start === "") {
                                        alert("Your start point is empty! Pick a start point in the dropdown box under the map");
                                        this.setState(
                                        {shortNames : this.state.shortNames,
                                            longNames : this.state.longNames,
                                            paths : [],
                                            cost : -1,
                                            paths2 : this.state.paths2,
                                            cost2 : this.state.cost2,
                                            status : this.state.status
                                        });
                                        return;
                                    }
                                    if(end === "") {
                                        alert("Your end point is empty! Pick an end point in the dropdown box under the map");
                                        this.setState(
                                            {shortNames : this.state.shortNames,
                                                longNames : this.state.longNames,
                                                paths : [],
                                                cost : -1,
                                                paths2 : this.state.paths2,
                                                cost2 : this.state.cost2,
                                                status : this.state.status
                                            });
                                        return;
                                    }
                                    this.makeRequestPath(start, end, 1);
                                    console.log("updating start and end:", start, end);
                                }}
                             onClear={() => {
                                 this.setState({
                                     shortNames : this.state.shortNames,
                                     longNames : this.state.longNames,
                                     paths : [],
                                     cost : -1,
                                     paths2 : this.state.paths2,
                                     cost2 : this.state.cost2,
                                     status : this.state.status
                                 });
                             }}
                />
                <h3> Expected Distance of the Blue (and if overlapping exists, Red) Path is about: {this.distanceRounding(this.state.cost)} ft</h3>
                {this.unfold(this.state.status)}
                {this.anotherBox(this.state.status)}
            </div>
        );
    }

}

export default App;
