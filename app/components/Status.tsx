import * as React from 'react';
import { Component } from 'react';
import { StatusProps, StatusState } from '../interfaces/components';

let styles = require('./styles/Status.scss');

export default class Status extends Component<StatusProps, StatusState> {
    public constructor(props: StatusProps) {
        super(props);
        this.state = { offset: 30 };
    }

    public changeOrder = (): void => this.setState({offset: this.state.offset + 110})
    

    public render() {
        return (
            <div className={styles.status} style={{top: this.state.offset}}>
                <p>{this.props.message}</p>
                {this.props.reload ? (<button>Reload</button>) : ""}
            </div>
        )
    }
}