import * as React from 'react';
import { Component } from 'react';
import { NavBarState, NavBarProps } from '../interfaces/components';
import Home from './Home';
import Workspace from './Workspace';

let styles = require('./styles/NavBar.scss');
let logo = require('../img/logoW.svg');

type event = React.MouseEvent<HTMLLIElement>;

export default class NavBar extends Component<NavBarProps, NavBarState> {
    public home: Home

    public constructor(props: NavBarProps) {
        super(props);
        this.state = {
            clicked: null
        };
    }
    private click = (e: React.MouseEvent<HTMLLIElement>): void => {
        this.menuOff();
        if (this.state.clicked !== e.currentTarget) {
            this.setState({clicked: e.currentTarget});
            e.currentTarget.className = styles.show;
        } else {
            this.setState({clicked: null});
        }
        
    }

    private workspace = (): Workspace => { return this.home._workspaces[this.home.selectedWorkspace]; }

    private save = (e: event): void => {
        if (!!this.home) {
            this.workspace().save(false);
        }
    }

    private saveAs = (e: event): void => {
        if (!!this.home) {
            this.workspace().save(true);
        }
    }

    private open = (e: event): void => {
        if (!!this.home) {
            this.workspace().load();
        }
    }

    private exit = (e: event): void => {
        if (!!this.home) {
            this.workspace().checkSave();
        }
    }

    public menuOff = (): void => {
        if (this.state.clicked !== null) this.state.clicked.className = "";
    }

    public render(): JSX.Element {
        return (
            <nav className={styles.main}>
                <img className={styles.logo} src={logo} />
                <ul>
                    <li onClick={this.click}>File<ul>
                        <li onClick={this.open}>Open<i>Ctrl + O</i></li>
                        <li onClick={this.save}>Save<i>Ctrl + S</i></li>
                        <li onClick={this.saveAs}>Save As<i>Ctrl + Shift + S</i></li>
                        <li onClick={this.exit}>Exit<i>Ctrl + Q</i></li>
                    </ul></li>
                    <li onClick={this.click}>Edit<ul>
                        <li>Settings<i>Alt + P</i></li>
                    </ul></li>
                    <li onClick={this.click}>Window<ul>
                        <li>Window Manager<i>Coming Soon</i></li>
                    </ul></li>
                    <li onClick={this.click}>About<ul>
                        <li>Credits</li>
                        <li>Wiki</li>
                    </ul></li>
                </ul>
                <a></a>
            </nav>
        );
    }
}