import * as React from 'react';
import { Component } from 'react';
import { MenuProps, MenuState } from '../interfaces/components';
import Workspace from './Workspace';

let styles = require("./styles/Menu.scss")
const imgs = {
    "and": require('../img/icons/and.svg'), "led": require('../img/icons/led.svg'), "or": require('../img/icons/or.svg'), 
    "not": require("../img/icons/not.svg"), "switch": require("../img/icons/switch.svg"), "click": require('../img/click.svg'),
    "draw": require('../img/draw.svg'), "cut": require("../img/icons/cut.svg")
};

export default class Menu extends Component<MenuProps, MenuState> {
    private _workspaces: Workspace[] = []

    public constructor(props: MenuProps) {
        super(props);
        this.state = { 
            mode: "click", 
            loading: true, 
            clicked: {
                "click": styles.clicked,
                "draw": '',
                "cut": '',
                "and": '',
                "or": '',
                "not": '',
                "switch": '',
                "led": ''
            }
        };
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

    public toggleMode = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        this.sendMode(e.currentTarget.id);
        let clicked = {
            "click": '',
            "draw": '',
            "cut": '',
            "and": '',
            "or": '',
            "not": '',
            "switch": '',
            "led": ''
        } as any;
        clicked[e.currentTarget.id] = styles.clicked;
        this.setState({clicked});
    }

    public render(): JSX.Element {

        if (!this.state.loading) {
            return (
                <div className={styles.main}>
                    <a title={"Click"} className={`${styles.tool} ${this.state.clicked['click']}`} id={"click"} onClick={this.toggleMode}><div><img src={imgs["click"]}/></div></a>
                    <a title={"Draw"} className={`${styles.tool} ${this.state.clicked['draw']}`} id={"draw"} onClick={this.toggleMode}><div><img src={imgs["draw"]}/></div></a>
                    <a title={"Cut"} className={`${styles.tool} ${this.state.clicked['cut']}`} id={"cut"} onClick={this.toggleMode}><div><img src={imgs["cut"]}/></div></a>
                    <a title={"NOT Gate"} className={`${styles.tool} ${this.state.clicked['not']}`} id={"not"} onClick={this.toggleMode}><div><img src={imgs["not"]}/></div></a>
                    <a title={"AND Gate"} className={`${styles.tool} ${this.state.clicked['and']}`} id={"and"} onClick={this.toggleMode}><div><img src={imgs["and"]}/></div></a>
                    <a title={"OR Gate"} className={`${styles.tool} ${this.state.clicked['or']}`} id={"or"} onClick={this.toggleMode}><div><img src={imgs["or"]}/></div></a>
                    <a title={"Switch"} className={`${styles.tool} ${this.state.clicked['switch']}`} id={"switch"} onClick={this.toggleMode}><div><img src={imgs["switch"]}/></div></a>
                    <a title={"LED"} className={`${styles.tool} ${this.state.clicked['led']}`} id={"led"} onClick={this.toggleMode}><div><img src={imgs["led"]}/></div></a>
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