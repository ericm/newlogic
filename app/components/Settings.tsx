import * as React from 'react';
import { Component } from 'react';
import { SettingsState, SettingsProps } from '../interfaces/components';
import * as settings from '../actions/settings';

let styles = require('./styles/Settings.scss');

export default class Settings extends Component<SettingsProps, SettingsState> {
    public constructor(props: SettingsProps) {
        super(props);
        this.state = {
            theme: 0,
		    gridFactor: 20,
		    snapGrid: false,
		    snapFactor: 20,
		    gridType: 0
        };
        document.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                this.unmount();
            }
        });
    }

    public componentDidMount() {
        this.setState(settings.getSettings());
    }

    public componentDidUpdate() {
        settings.setSettings(this.state);
    }

    public unmount = (_?: React.MouseEvent<HTMLDivElement>) => { this.props.home.unmountPopup() }

    public render() {
        return (
            <div className={styles.container} onClick={this.unmount}>
                <div onClick={e => e.stopPropagation()} className={styles.popup}>
                    <h1>Settings</h1>
                    <label>
                        Theme:
                        <select onChange={e => this.setState({theme: +e.currentTarget.value})} value={this.state.theme}>
                            <option value={0}>Light</option>
                            <option value={1}>Dark (Coming Soon)</option>
                        </select>
                    </label>
                    <label>
                        Snap To Grid: 
                        <input onChange={e => this.setState({snapGrid: e.currentTarget.checked})} type="checkbox" checked={this.state.snapGrid} />
                    </label>
                    <label>
                        Grid Type: 
                        <select onChange={e => this.setState({gridType: +e.currentTarget.value})} value={this.state.gridType}>
                            <option value={0}>Lines</option>
                            <option value={1}>Dots</option>
                        </select>
                    </label>
                    <label>
                        Grid Factor <i>(The width and height of a box in the grid)</i>: 
                        <input onChange={e => this.setState({gridFactor: +e.currentTarget.value})} type="number" value={this.state.gridFactor} />
                    </label>
                    <label>
                        Snap Factor <i>(How close to a node a wire should be before snapping on)</i>: 
                        <input onChange={e => this.setState({snapFactor: +e.currentTarget.value})} type="number" value={this.state.snapFactor} />
                    </label>
                </div>
            </div>
        )
    }
}