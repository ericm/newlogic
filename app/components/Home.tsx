// This ccmponents controls the resizing of all of the windows
// It then sends the updated states to each component afftected by a resize
import * as React from 'react';
import { HomeProps, HomeState, WinBarResize } from '../interfaces/components';

import WindowBar from './WindowBar';

let styles = require('./styles/Home.scss');

export default class Home extends React.Component<HomeProps, HomeState> {
	private _child1: WindowBar | null;

	public constructor(props: HomeProps) {
		super(props);
		this.state = {
			child1: {width: 80, height: 80, x: 0, y: 0, initHeight: 80, initWidth: 80, initX: 0, initY: 0}
		};
	}

	public componentDidMount(): void {
		// TODO: get these vals from settings
		let props: WinBarResize = {
			width: this.state.child1.width, height: this.state.child1.height, x: this.state.child1.x, y: this.state.child1.y
		};
		if (this._child1 !== null) {
			this._child1.resize(props);
		}
	}

	private onDragResize = (e: React.DragEvent): void => {
		switch(e.type) {
			case "ondragcapture": this.setState({})
		}
	}

	public render(): JSX.Element {
	
		return (
			<div>
				<div className={styles.container} data-tid="container">
					<div className={styles.window}>
						<div onDrag={this.onDragResize} style={{height: this.state.child1.height}} className={styles.barV} />
						<WindowBar ref={(child) => { this._child1 = child; }} resize={"horizontal"} identity={1} type={"Workspace"} title={"Canvas"} />
					</div>
				</div>
			</div>
		);

	}

}
