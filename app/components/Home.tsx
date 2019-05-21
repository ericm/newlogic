// This component controls the resizing of all of the windows
// It then sends the updated states to each component afftected by a resize
import * as React from 'react';
import { Component as RComponent } from 'react';
import { Child, Component, HomeProps, HomeState, WinBarResize } from '../interfaces/components';
import Menu from './Menu';
import NavBar from './NavBar';
import WindowBar from './WindowBar';
import Workspace from './Workspace';
import { AnyGate } from '../interfaces/canvas';
import Properties from './Properties';


let styles = require('./styles/Home.scss');

export default class Home extends RComponent<HomeProps, HomeState> {
    private _children: { [key: number]: WindowBar; } = {};

    public _workspaces: { [key: number]: Workspace; } = {};
    public selectedWorkspace: number = 1

    private _menus: { [key: number]: Menu; } = {};
    private _navbar: NavBar

    public constructor(props: HomeProps) {
        super(props);
        this.state = {
            child1: { width: 92.5, height: 100, x: 0, y: 0, initHeight: 80, initWidth: 80, initX: 0, initY: 0 },
            child2: { width: 7, height: 100, x: 0, y: 0, initHeight: 80, initWidth: 80, initX: 0, initY: 0 }
        };
        // Add keybind listener
        document.addEventListener("keydown", this.keyBinds);
        this.propertyWindow = this.propertyWindow.bind(this);
    }

    private resizeChild = (i: number): void => {
        switch (i) {
            case 1: {
                const props: WinBarResize = {
                    width: this.state.child1.width, height: this.state.child1.height, x: this.state.child1.x, y: this.state.child1.y
                };
                const n: Component = {
                    width: props.width, height: props.height
                }

                this._children[i].resize(props);
                this._workspaces[i].resize(n);

                break;
            }
            case 2: {
                const props: WinBarResize = {
                    width: this.state.child2.width, height: this.state.child2.height, x: this.state.child2.x, y: this.state.child2.y
                };

                this._children[i].resize(props);

                break;
            }
        }
    }

    private resizer = (): void => {
        for (let i = 1; i <= 2; i++) {
            this.resizeChild(i);
        }
    }

    public componentDidMount(): void {
        // TODO: get these vals from settings
        this.resizer();
        this._menus[1].addWorkspace(this._workspaces[1]);
        window.addEventListener("resize", (): void => this.resizer());

        this._navbar.home = this;
        this._workspaces[this.selectedWorkspace].propertyWindow = this.propertyWindow;

    }

    public unmountPopup = () => this.setState({popup: (<p hidden></p>)});
    

    private propertyWindow = (gate: AnyGate): void => {
        
        this.setState({popup: (
            <Properties home={this} gate={gate} />
        )});
    }

    public componentDidUpdate(): void {
        // TODO: get these vals from settings
        this.resizer();
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", (): void => this.resizer());
    }

    private onDragResize = (e: React.DragEvent<HTMLDivElement>): void => {
        let parentStyles: HTMLElement,
            lockV = false,
            lockH = false,
            child: Child,
            childOther: Child[] = [];

        console.log(e.type);

        if (e.currentTarget instanceof Element
            && e.currentTarget.parentElement instanceof Element
            && e.currentTarget.parentElement.parentElement instanceof Element) {

            parentStyles = e.currentTarget.parentElement;

            switch (parentStyles.id) {
                case "child1":
                    lockV = true;
                    child = this.state.child1;
                    childOther.push(this.state.child2);
                    break;

                default: child = this.state.child1;
            }

            const cH = window.innerHeight;
            const cW = window.innerWidth;
            const mousePosX = ((e.clientX == 0 ? child.x : e.clientX - child.initX) / cW) * 100;
            const mousePosY = ((e.clientY == 0 ? child.y : e.clientY - child.initY) / cH) * 100;

            switch (e.type) {
                case "dragstart":
                    child.initHeight = (parentStyles.offsetHeight / cH) * 100;
                    child.initWidth = (parentStyles.offsetWidth / cW) * 100;

                    childOther.forEach((v: Child) => {
                        v.initHeight = v.height;
                        v.initWidth = v.width;
                    });

                    child.initX = e.clientX;
                    child.initY = e.clientY;

                    break;

                case "drag":
                    if (!lockV) child.height = child.initHeight - mousePosY - 0.5;
                    if (!lockH) child.width = child.initWidth - mousePosX - 0.5;

                    childOther.forEach((v: Child) => {
                        if (!lockV) v.height = v.initHeight + mousePosY;
                        if (!lockH) v.width = v.initWidth + mousePosX;
                    });

                    child.x = e.clientX - child.initX;
                    child.y = e.clientY - child.initY;
                    break;

            }

            if (child.width >= 100) child.width = 99;
            console.log(cH, child.height, e.type);
            switch (parentStyles.id) {
                case "child1":
                    this.setState({ child1: child });
                    this.resizeChild(1);
                    this.setState({ child2: childOther[0] });
                    this.resizeChild(2);
                    break;
            }

        }
    }

    private menuOff = (_: React.MouseEvent<HTMLDivElement>): void => {
        if (!!this._navbar) this._navbar.menuOff();
    }

    private keyBinds = (e: KeyboardEvent): void => {
        let workspace = this._workspaces[this.selectedWorkspace];
        if (e.altKey && e.key !== "Alt") {
            switch(e.key.toLowerCase()) {
            case "p":
                // TODO: Settings
                break;
            }
        }
        if (e.ctrlKey && e.key !== "Control") {
            switch (e.key.toLowerCase()) {
            case "o":
                workspace.load();
                break;
            case "s":
                workspace.save(e.shiftKey);
                break;
            case "q":
                workspace.checkSave();
                break;
            }
        }
    }

    public render(): JSX.Element {

        return (
            <div>
                <NavBar ref={(child) => { if (child !== null) this._navbar = child; }} />
                <div onClick={this.menuOff} className={styles.container} data-tid="container">

                    <div id={"child2"} className={styles.window}>

                        <WindowBar ref={(child) => { if (child !== null) this._children[2] = child; }} resize={"horizontal"} identity={1} type={"Menu"} title={"Canvas"}>
                            <Menu ref={(child) => { if (child !== null) this._menus[1] = child; }} width={this.state.child2.width} height={this.state.child2.height} />
                        </WindowBar>

                    </div>

                    <div id={"child1"} className={styles.window}>

                        <div onDragEnd={this.onDragResize} onDragStart={this.onDragResize} onDrag={this.onDragResize}
                            style={{ height: this.state.child1.height.toString() + "vh" }} className={styles.barV} />

                        <WindowBar ref={(child) => { if (child !== null) this._children[1] = child; }} resize={"horizontal"} identity={1} type={"Workspace"} title={"Canvas"}>
                            <Workspace name={"test"} testing={this.props.testing} ref={(child) => { if (child !== null) this._workspaces[1] = child; }}
                                width={this.state.child1.width} height={this.state.child2.height} />
                        </WindowBar>

                    </div>

                </div>
                <div id="popup">{this.state.popup}</div>
            </div>
        );

    }

}
