import * as React from 'react';
import { Component } from 'react';
import { PropertiesProps, PropertiesState } from '../interfaces/components';

let styles = require('./styles/Properties.scss');

export default class Properties extends Component<PropertiesProps, PropertiesState> {

    private options: JSX.Element[]

    public constructor(props: PropertiesProps) {
        super(props);
        this.options = [];
        for (let option of props.gate.props.keys()) {
            const get = props.gate.props.get(option);
            this.options.push((<label>{option}: <input type={typeof get === "number" ? "number" : "text"} value={get} /></label>));
        }
    }
    
    public unmount = (_: React.MouseEvent<HTMLDivElement>) => { this.props.home.unmountPopup() }
    
    public render(): JSX.Element {
        return (
            <div className={styles.back} onClick={this.unmount}>
                <article onClick={e => e.stopPropagation()} className={styles.popup}>
                    <h1>Gate Properties</h1>
                    {this.options}
                </article>
            </div>
        );
    }
}