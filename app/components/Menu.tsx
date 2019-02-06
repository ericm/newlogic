import * as React from 'react';
import { MenuProps, MenuState } from '../interfaces/components';
import Workspace from './Workspace';

export default class Menu extends React.Component<MenuProps, MenuState> {
    private _workspaces: Workspace[] = []

    public constructor(props: MenuProps) {
        super(props);
        this.state = {mode: "and", loading: true};
    }

    public addWorkspace = (component: Workspace): void => {
        this._workspaces.push(component);
        component.changeMode(this.state.mode);
        this.setState({loading: false});
    }

    public render() {

        return (
            <div>
                <p>HI</p>
            </div>
        );

    }

}