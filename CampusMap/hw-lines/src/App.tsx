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

import React, { Component } from "react";
import EdgeList from "./EdgeList";
import Map from "./Map";

// Allows us to write CSS styles inside App.css, any styles will apply to all components inside <App />
import "./App.css";
import MapLine from "./MapLine";

interface AppState {
    fixedLines: JSX.Element[],
    lines: JSX.Element[]|Number[]
}

class App extends Component<{}, AppState> { // <- {} means no props.

  constructor(props: any) {
    super(props);
    this.state = {
      // TODO: store edges in this state
        fixedLines : [],
        lines : []
    };
  }

    parseString = (input:string) => {
        let mapLines: JSX.Element[]|Number = [];
        if(input==="") {
            return mapLines;
        }
        const splitLines = input.split(/\r?\n/);
        let index:number = 0;
        if (this.state.fixedLines.length !== 0) {
            // @ts-ignore
            index = Number(this.state.fixedLines[this.state.fixedLines.length-1].key.valueOf());
            console.log("index", index);
        }
        for (let i = 0; i < splitLines.length; i++) {
            const eachLine = splitLines[i].split(/\s+/).filter(e => e);
            if (eachLine.length !== 5) {
                return [0, i+1];
            }
            if (!(Number(eachLine[0]) >= 0 && Number(eachLine[0]) <=4000 && Number(eachLine[1]) >= 0 && Number(eachLine[1]) <=4000 && Number(eachLine[2]) >= 0 && Number(eachLine[2]) <=4000 && Number(eachLine[3]) >= 0 && Number(eachLine[3]) <=4000 && isNaN(Number(eachLine[4])) )) {
                return [1, i+1];
            }

            let eachMapLine = <MapLine key={i+index+1} x1={Number(eachLine[0])} y1={Number(eachLine[1])} x2={Number(eachLine[2])}
                                       y2={Number(eachLine[3])} color={eachLine[4]} />;
            mapLines.push(eachMapLine);
        }
        return mapLines;
    }

  update_edgeList = (input:string) => {
      this.setState({lines: this.parseString(input), fixedLines: this.state.fixedLines});
      console.log("updating edge", input);
  }



  render() {
      let reminder : JSX.Element[] = [];
      if (this.state.lines.length === 2 && this.state.lines[0] === 0) {
          reminder = [<p style={{color: 'red'}} key={0}>Error: Line {this.state.lines[1]} is expected to have 5 elements but not</p>]
      } else if (this.state.lines.length === 2 && this.state.lines[0] === 1) {
          reminder = [<p style={{color: 'red'}} key={0}>Error: Line {this.state.lines[1]} is expecting four numbers from 0 to 4000 and one color string but not</p>]
      }

    return (
      <div>
        <h1 id="app-title">Line Mapper!</h1>
        <div>
          {/* TODO: define props in the Map component and pass them in here */
              <Map edgeList={this.state.lines} fixedEdgeList={this.state.fixedLines} />
          }
        </div>
          {reminder}
        <EdgeList
            fixChange={(isFix) => {
                if(isFix) {
                    if (this.state.lines.length !== 2 || isNaN(Number(this.state.lines[0]))) {
                        let newFixedLines = this.state.fixedLines;
                        for (let i = 0; i < this.state.lines.length; i++) {
                            // @ts-ignore
                            newFixedLines.push(this.state.lines[i]);
                        }
                        this.setState({
                            fixedLines: newFixedLines,
                            lines: []
                        })
                        console.log("fixed!")
                    }
                } else {
                    this.setState({
                        fixedLines: [],
                        lines: this.state.lines
                    })
                }
            }
            }
          onTextChange={(value) => {
            // TODO: Modify this onChange callback to store the edges in the state
            console.log("EdgeList onChange", value);
            this.update_edgeList(value);
          }
        }
        />
      </div>
    );
  }
}

export default App;
