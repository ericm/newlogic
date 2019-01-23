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
	}

	public componentDidMount() {
		// TODO: get these vals from settings
		let props: WinBarResize = {height: 80, width: 80, x: 0, y: 0};
		if (this._child1 !== null) {
			this._child1.resize(props);
		}
	}

	public render(): JSX.Element {
	
		return (
			<div>
				<div className={styles.container} data-tid="container">
					<div className={styles.window}>
						<WindowBar ref={(child) => { this._child1 = child; }} resize={"horizontal"} identity={1} type={"Workspace"} title={"Canvas"} />
					</div>
					
				</div>
			</div>
		);

	}

}
