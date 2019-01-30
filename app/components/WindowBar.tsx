import * as React from 'react';
import { WinBarState, WinBarProps, WinBarResize } from '../interfaces/components';

// import Workspace from './Workspace';
// import Menu from './Menu';
const styles = require('./styles/WindowBar.scss');

export default class WindowBar extends React.Component<WinBarProps, WinBarState> {

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
			{width: n.width, height: n.height, offsetX: n.x, offsetY:n.y}
		);
		// switch(this.props.type) {

		// }
	}

	// private returnType: any = () => {
	// 	switch(this.props.type) {
	// 		case "Workspace": return(<Workspace width={this.state.width} height={this.state.height}/>);
	// 		case "Menu": return(<Menu />);
	// 		default: return (<div></div>);
	// 	}
	// }

	public render(): JSX.Element {
		return (
			<div className={styles.main} style={
				{width: this.state.width.toString()+'vw', height: this.state.height.toString()+'vh'}
			}>
				{this.props.children}
			</div>
		);
	}

}