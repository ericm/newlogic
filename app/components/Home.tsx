import * as React from 'react';

import WindowBar from './WindowBar';

let styles = require('./styles/Home.scss');

export default class Home extends React.Component {
	public render() {
		return (
			<div>
				<div className={styles.container} data-tid="container">
					<WindowBar resize={"horizontal"} identity={1} type={"Workspace"} title={"Canvas"} />
				</div>
			</div>
		);
	}
}
