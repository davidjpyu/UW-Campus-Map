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

interface EdgeListProps {
    onTextChange: (edges: string) => void;  // called when a new edge list is ready
                                 // TODO: once you decide how you want to communicate the edges to the App, you should
                                 // change the type of edges so it isn't `any`
    fixChange: (isFix: boolean) => void;
}

// TODO: David: new added state interface
interface EdgeListState {
    input: string
}

/**
 * A text field that allows the user to enter the list of edges.
 * Also contains the buttons that the user will use to interact with the app.
 */
class EdgeList extends Component<EdgeListProps, EdgeListState> {
    constructor(props:any) {
        super(props);
        this.state = {
            // myEdges: [],
            input: ""
        }
    }


    render() {
        return (
            <div id="edge-list">
                Edges <br/>
                <textarea
                    rows={5}
                    cols={30}
                    onChange={(event) =>
                    {this.setState({
                            input: event.target.value
                                            });
                        // this.props.onTextChange(inputVal);
                        console.log('textarea onChange was called');
                    }}
                    value={this.state.input}
                /> <br/>
                <button onClick={() => {
                    console.log('Draw onClick was called');
                    this.props.onTextChange(this.state.input);
                }}>Draw</button>
                <button onClick={() => {
                    console.log('Clear onClick was called');
                    this.props.onTextChange("");
                }}>Clear</button>

            {/*    my design    */}
                <button onClick={() => {
                    console.log('Fix onClick was called');
                    this.props.fixChange(true);
                }}>Fix</button>

                <button onClick={() => {
                    console.log('Unfix onClick was called');
                    this.props.fixChange(false);
                }}>Unfix</button>
            </div>
        );
    }
}

export default EdgeList;
