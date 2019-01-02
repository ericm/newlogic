import * as React from 'react';

let styles = require("./styles/WindowBar.scss");

export default class WindowBar extends React.Component<{title: string}, {title: string}> {
    constructor(props: any) {
        super(props);
        this.state = {title: this.props.title};
    }
    render() {
        return (
            <div className={styles.main}>
                <h1 draggable={true}>{this.state.title}</h1>
                <div className={styles.body}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}