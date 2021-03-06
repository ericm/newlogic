import * as React from 'react';
import { Component } from 'react';
import { WinBarProps, WinBarResize, WinBarState } from '../interfaces/components';

// import Workspace from './Workspace';
// import Menu from './Menu';
const styles = require('./styles/WindowBar.scss');

export default class WindowBar extends Component<WinBarProps, WinBarState> {

    public constructor(props: WinBarProps) {
        super(props);
        this.state = {
            title: this.props.title,
            focused: false,
            offsetX: 0,
            offsetY: 0,
            width: 0,
            height: 0,
            resize: this.props.resize
        };
    }

    public resize = (n: WinBarResize): void => {
        this.setState(
            { width: n.width, height: n.height, offsetX: n.x, offsetY: n.y }
        );
        // switch(this.props.type) {

        // }
    }


    public render(): JSX.Element {
        return (
            <div className={styles.main} style={
                { width: this.state.width.toString() + 'vw', height: this.state.height.toString() + 'vh' }
            }>
                {this.props.children}
            </div>
        );
    }

}