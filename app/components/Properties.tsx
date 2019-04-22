import * as React from 'react';
import { Component } from 'react';
import { PropertiesProps, PropertiesState } from '../interfaces/components';

let styles = require('./styles/Properties.scss');

export default class Properties extends Component<PropertiesProps, PropertiesState> {

    private options: JSX.Element[] = []

    public constructor(props: PropertiesProps) {
        super(props);
        for (let option of props.gate.props.keys()) {
            const get = props.gate.props.get(option) || new Array<any>();
            switch (get[0]) {
                case "number":
                    this.options.push((<label id={option} onChange={this.changeNumber}>{option}: <input type="range" min={get[1]} defaultValue={get[3]} max={get[2]}/></label>));
                    break;
            }
        }
    }

    private changeNumber = (e: React.ChangeEvent<HTMLLabelElement>) => {
        let target = e.target as any as HTMLInputElement;
        console.log(e.currentTarget.innerText);
        this.props.gate.setProp(e.currentTarget.id, target.value);
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