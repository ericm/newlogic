import * as React from 'react';
import { Component } from 'react';
import { SettingsState, SettingsProps } from '../interfaces/components';

let styles = require('./styles/Settings.scss');

export default class Settings extends Component<SettingsProps, SettingsState> {
    public constructor(props: SettingsProps) {
        super(props);
        this.state = {};
    }

    public unmount = (_: React.MouseEvent<HTMLDivElement>) => { this.props.home.unmountPopup() }

    public render() {
        return (
            <div className={styles.container} onClick={this.unmount}>
                <div onClick={e => e.stopPropagation()} className={styles.popup}>
                    <h1>Test</h1>
                </div>
            </div>
        )
    }
}