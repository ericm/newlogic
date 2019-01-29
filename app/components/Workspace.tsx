import * as React from 'react';
import { WorkspaceProps, WorkspaceState } from '../interfaces/components';

let styles = require('./styles/Workspace.scss');

//import items (gates etc)
// import AndGate from './items/AND';

export default class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {
	public render() {
		return (
			<div className={styles.main}>
				{/* <canvas width="200" height="100"></canvas> */}
			</div>
		)
	}
}