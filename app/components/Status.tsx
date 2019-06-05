import * as React from 'react';
import { Component } from 'react';
import { StatusProps, StatusState } from '../interfaces/components';
import { Reload } from '../actions/system';

let styles = require('./styles/Status.scss');

export default class Status extends Component<StatusProps, StatusState> {
    public constructor(props: StatusProps) {
        super(props);
        this.state = { offset: 30, class: styles.status };
    } 

    public componentDidMount() {
        setTimeout(() => this.setState({class: styles.status + " " + styles.outS}), 5000)
    }

    public componentDidUpdate() {
        if (this.state.offset !== this.props.offset) {
            this.setState({ offset: this.props.offset })
        }
    }

    public render() {
        return (
            <div onClick={this.props.unmount} className={this.state.class} style={{top: this.state.offset, transition: "all .5s"}}>
                <p>{this.props.message}</p>
                {this.props.reload ? (<button onClick={Reload}>Reload</button>) : ""}
            </div>
        )
    }
}