import * as React from 'react';
import { Component } from 'react';
import { NavBarState, NavBarProps } from '../interfaces/components';
import Home from './Home';
import Workspace from './Workspace';
import * as system from '../actions/system';
import { remote } from 'electron';

let styles = require('./styles/NavBar.scss');
let logo = require('../img/logoW.svg');

let x = require('../img/nav/x.svg');
let max = require('../img/nav/max.svg');
let min = require('../img/nav/min.svg');

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

    private min = (): void => remote.getCurrentWindow().minimize()
    
    private max = (): void => {
        let win = remote.getCurrentWindow();
        if (!win.isMaximized()) {
            win.maximize();
        } else {
            win.restore();
        }
    }

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

    private new = (e: event): void => {
        if (!!this.home) {
            system.Reload();
        }
    }

    private settings = (e: event): void => {
        if (!!this.home) {
            this.home.settingsWindow();
        }
    }

    private exit = (): void => {
        if (!!this.home) {
            this.workspace().checkSave();
        }
    }

    private wiki = (): void => system.Open("https://github.com/ericm/newlogic/wiki")
    private credits = (): void => system.Open("https://github.com/ericm/newlogic/graphs/contributors")

    public menuOff = (): void => {
        if (this.state.clicked !== null) this.state.clicked.className = "";
    }

    public render(): JSX.Element {
        return (
            <nav className={styles.main}>
                <img className={styles.logo} src={logo} />
                <ul>
                    <li onClick={this.click}>File<ul>
                        <li onClick={this.new}>New<i>Ctrl + N</i></li>
                        <li onClick={this.open}>Open<i>Ctrl + O</i></li>
                        <li onClick={this.save}>Save<i>Ctrl + S</i></li>
                        <li onClick={this.saveAs}>Save As<i>Ctrl + Shift + S</i></li>
                        <li onClick={this.exit}>Exit<i>Ctrl + Q</i></li>
                    </ul></li>
                    <li onClick={this.click}>Edit<ul>
                        <li onClick={this.settings}>Settings<i>Alt + P</i></li>
                    </ul></li>
                    <li onClick={this.click}>Window<ul>
                        <li>Window Manager<i>Coming Soon</i></li>
                    </ul></li>
                    <li onClick={this.click}>About<ul>
                        <li onClick={this.wiki}>Wiki</li>
                        <li onClick={this.credits}>Credits</li>
                    </ul></li>
                </ul>
                <a></a>
                <div className={styles.opt}>
                    <img onClick={this.min} className={styles.min} src={min} />
                    <img onClick={this.max} className={styles.max} src={max} />
                    <img onClick={this.exit} src={x} />
                </div>
            </nav>
        );
    }
}