import * as React from 'react';

let styles = require("./styles/WindowBar.scss");

export default class WindowBar extends React.Component<{title: string}, 
    {title: string, x: number, y: number, initX: number, initY: number, moving: boolean, posX: number, posY: number}> {

    constructor(props: any) {
        super(props);
        this.state = {title: this.props.title, x: 0, y: 24, initX: 0, initY: 24, moving: false, posX: 0, posY: 0};
    }
    private windowDrag = (e: any): void => {
        switch(e.type) {
            case "mousedown": {
                this.setState({moving: true, initX: e.clientX, initY: e.clientY});
                break;
            }
            case "mousemove": {
                if (this.state.moving) {
                    let mX = e.clientX - this.state.initX + this.state.posX;
                    let mY = e.clientY - this.state.initY + this.state.posY;

                    console.log(e.clientX, this.state.initX, this.state.posX);
                    this.setState({x: mX, y: mY});
                }
                break;
            }
            case "mouseup": {
                this.setState({moving: false, posX: this.state.x, posY: this.state.y});
                break;
            }
            case "mouseleave": {
                this.setState({moving: false, posX: this.state.x, posY: this.state.y});
                break;
            }

        }
        
    }
    render() {
        return (
            <div style={{top: this.state.y, left: this.state.x}} className={styles.main}>
                <header onMouseDown={this.windowDrag} onMouseMove={this.windowDrag} onMouseUp={this.windowDrag} onMouseLeave={this.windowDrag}>
                    <h1>{this.state.title}</h1>
                </header>
                <div className={styles.body}>
                    {this.props.children}
                </div>
            </div>
        )
    }

}