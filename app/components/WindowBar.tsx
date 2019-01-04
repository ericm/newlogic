import * as React from 'react';
import { WinBarState, WinBarProps } from '../interfaces/components';

import Workspace from './Workspace';

let styles = require("./styles/WindowBar.scss");

export default class WindowBar extends React.Component<WinBarProps, WinBarState> {

	constructor(props: WinBarProps) {
		super(props);
		this.state = {
			title: this.props.title, x: 0, y: 24, initX: 0, initY: 24, moving: false,
			posX: 0, posY: 0, width: 200, height: 200, max: false, winWidth: 200, winHeight: 200, focused: true, z: 100,
			saved: true, closed: false
		};
	}

	private windowDrag = (e: React.MouseEvent<HTMLHeadingElement>): void => {
		switch (e.type) {
			case "mousedown": {
				this.setState({ moving: true, initX: e.clientX, initY: e.clientY });
				break;
			}
			case "mousemove": {
				if (this.state.moving && !this.state.max) {
					let mX = e.clientX - this.state.initX + this.state.posX,
						mY = e.clientY - this.state.initY + this.state.posY;

					this.setState({ x: mX, y: mY });
				}
				break;
			}
			case "mouseup": {
				this.setState({ moving: false, posX: this.state.x, posY: this.state.y });
				break;
			}
			case "mouseleave": {
				this.setState({ moving: false, posX: this.state.x, posY: this.state.y });
				break;
			}

		}

	}

	public unFocus = (): void => {

		console.log("ok");
		this.setState({ focused: false, z: 10 })

	}

	public close = (): void => {

		if (this.state.saved) {
			this.setState({
				closed: true
			});
		} else {
			console.log("use notify engine")
		}

	}

	private windowClick = (e: React.MouseEvent<HTMLDivElement>): void => {

		let width = e.currentTarget.offsetWidth - 7,
			height = e.currentTarget.offsetHeight - 7;

		if (width !== this.state.width) {
			this.setState({ width });
		}

		if (height !== this.state.height) {
			this.setState({ height });
		}

		if (!this.state.focused) {
			this.setState({ focused: true, z: 100 });
		}

	}

	private toggleMax = (e: React.MouseEvent<HTMLSpanElement>): void => {

		if (!this.state.max) {
			this.setState({
				x: 0, y: 24, initX: this.state.x, initY: this.state.y,
				max: true, width: window.innerWidth, height: window.innerHeight, winWidth: this.state.width, winHeight: this.state.height
			});
		} else {
			this.setState({ x: this.state.initX, y: this.state.initY, max: false, width: this.state.winWidth, height: this.state.winHeight });
		}

	}

	public render() {

		if (!this.state.closed) {
			return (
				<div onClick={this.windowClick} style={{
					top: this.state.y, left: this.state.x, width: this.state.width,
					height: this.state.height, zIndex: this.state.z
				}} className={styles.main}>
					<header>
						<h1 onDoubleClick={this.toggleMax} onMouseDown={this.windowDrag} onMouseMove={this.windowDrag} onMouseUp={this.windowDrag} onMouseLeave={this.windowDrag}>{this.state.title}</h1>
						<nav className={styles.nav}>
							<span onClick={this.toggleMax}>&#9633;</span>
							<span onClick={this.close}>x</span>
						</nav>
					</header>
					<div style={{ width: this.state.width, height: this.state.height - 30 }} className={styles.body}>
						{(() => {
							switch (this.props.type) {
								case "Workspace": return <Workspace width={this.state.width} height={this.state.height - 30} />;
								default: return null;
							}
						})()}
					</div>
				</div>
			);
		} else {
			return null;
		}

	}

}