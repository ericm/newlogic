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
                    <h1>Settings</h1>
                    <label>
                        Theme:
                        <select>
                            <option>Light</option>
                            <option>Dark (Coming Soon)</option>
                        </select>
                    </label>
                    <label>
                        Snap To Grid: 
                        <input type="checkbox" value={20} />
                    </label>
                    <label>
                        Grid Type: 
                        <select>
                            <option value="lines">Lines</option>
                            <option value="dots">Dots</option>
                        </select>
                    </label>
                    <label>
                        Grid Factor <i>(The width and height of a box in the grid)</i>: 
                        <input type="number" value={20} />
                    </label>
                    <label>
                        Snap Factor <i>(How close to a node a wire should be before snapping on)</i>: 
                        <input type="number" value={20} />
                    </label>
                </div>
            </div>
        )
    }
}