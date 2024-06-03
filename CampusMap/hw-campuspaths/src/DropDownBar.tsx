import React, {Component} from 'react';

/**
 * Represents the interface of App's props
 * @field shortName: the collection of all short names of buildings in the map
 *        longName: the corresponding collection of all full names of the buildings
 *        onChange: a call back function that pass start and end names to App if user ask for the path of two buildings
 *        onClear: a call back function that reset related states of App if user click clear button
 */
interface DropDownBarProps {
    shortName : string[],
    longName : string[],
    onChange: (start: string, end: string) => void; // called when a start point and an end point are ready
    onClear: () => void; // called when the map is cleared.
}

/**
 * Represents the interface of App's state
 * @field start: the start building that user select
 *        end: the end building that user select
 */
interface DropDownBarState {
    start: string,
    end: string
}

/**
 * A class that represent start and end point dropdown bars and Search and Clear buttons in the application
 */
class DropDownBar extends Component<DropDownBarProps, DropDownBarState> {
    constructor(props: any) {
        super(props);
        this.state = {
            start: "",
            end: ""
        };
    }

    render() {
        let nameList: JSX.Element[] = [];
        nameList.push(<option style={{textAlign: "center"}} key={-1} value={""}>None</option>);
        for (let i = 0; i < this.props.shortName.length; i++) {
            nameList.push(<option style={{textAlign: "center"}} key={i} value={this.props.shortName[i]}> {this.props.shortName[i]+" "+this.props.longName[i]} </option>);
        }

        return (
            <div >
                <label> Pick a start point:<br/>
                    <select value={this.state.start}
                            onChange={(event) =>
                                {this.setState({
                                    start : event.target.value,
                                    end: this.state.end
                                    });
                                }}>
                        {nameList}
                    </select>
                </label>
                <br/>
                <label> Pick an end point:<br/>
                    <select value={this.state.end}
                            onChange={(event) =>
                                {this.setState({
                                    start : this.state.start,
                                    end: event.target.value
                                    });
                                }}>
                    {nameList}
                </select>
                </label>
                <br/>
                <button onClick={() => {
                    console.log('Search onClick was called');
                    this.props.onChange(this.state.start, this.state.end);
                }}>Search</button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button onClick={() => {
                    console.log('Clear onClick was called');
                    this.setState({
                        start: "",
                        end: ""
                    })
                    this.props.onClear();
                }}>Clear</button>
            </div>

        );
    }
}

export default DropDownBar;