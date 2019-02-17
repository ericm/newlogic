import * as React from 'react';
import { MenuProps, MenuState } from '../interfaces/components';
import Workspace from './Workspace';

let styles = require("./styles/Menu.scss")

export default class Menu extends React.Component<MenuProps, MenuState> {
    private _workspaces: Workspace[] = []

    public constructor(props: MenuProps) {
        super(props);
        this.state = { mode: "and", loading: true };
    }

    public addWorkspace = (component: Workspace): void => {
        this._workspaces.push(component);
        component.changeMode(this.state.mode);
        this.setState({ loading: false });
    }

    private sendMode = (mode: string): void => {
        for (let i in this._workspaces) {
            this._workspaces[i].changeMode(mode);
        }
    }

    public toggleMode = (e: React.MouseEvent<HTMLAnchorElement>): void => this.sendMode(e.currentTarget.id);

    public render(): JSX.Element {

        if (!this.state.loading) {
            return (
                <div className={styles.main}>
                    <a className={styles.tool} id={"click"} onClick={this.toggleMode}>Click</a><br></br>
                    <a className={styles.tool} id={"and"} onClick={this.toggleMode}>And</a><br></br>
                    <a className={styles.tool} id={"or"} onClick={this.toggleMode}>Or</a><br></br>
                    <a className={styles.tool} id={"draw"} onClick={this.toggleMode}>Draw</a><br></br>
                </div>
            );
        } else {
            return (
                <div>
                    <p>Loading</p>
                </div>
            );
        }


    }

}