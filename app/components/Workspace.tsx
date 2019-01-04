import * as React from 'react';
import { WorkspaceProps, WorkspaceState } from '../interfaces/components';

import { Stage, Layer, Text } from 'react-konva';

let styles = require('./styles/Workspace.scss');

export default class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {
	public render() {
		return (
			<Stage width={this.props.width} height={this.props.height} className={styles.main}>
				<Layer>
					<Text text="hi" />
				</Layer>
			</Stage>
		)
	}
}