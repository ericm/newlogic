import * as React from 'react';

let styles = require("./WindowBar.scss");

export default class WindowBar extends React.Component<{title: string}, {title: string}> {
    constructor(props: any) {
        super(props);
        this.state = {title: this.props.title};
    }
    render() {
        return (
            <div className={styles.main}>
                <h1>{this.state.title}</h1>
            </div>
        )
    }
}