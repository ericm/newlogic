import * as React from 'react';
import { WorkspaceProps, WorkspaceState, Component } from '../interfaces/components';

let styles = require('./styles/Workspace.scss');

//import items (gates etc)
// import AndGate from './items/AND';

export default class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {

	canvas: HTMLCanvasElement

	public constructor(props: WorkspaceProps) {
		super(props);
		this.state = {
			width: (this.props.width * window.innerWidth / 100).toString(), 
			height: (this.props.height * window.innerHeight / 100).toString()
		}
	}
	
	public componentDidMount() {
		this.updateCanvas();
		this.setState({
			width: (this.props.width * window.innerWidth / 100).toString(), 
			height: (this.props.height * window.innerHeight / 100).toString()
		});
	}
	
	public componentDidUpdate() {
		this.updateCanvas();
	}

	private updateCanvas = () => {
		const cont = this.canvas.getContext('2d');
		if (cont !== null) {
			const ctx: CanvasRenderingContext2D = cont;
			ctx.fillText("Hello World", 10, 50);
		}	
	}

	public resize = (n: Component): void => {
		this.setState({
			width: (n.width * window.innerWidth / 100).toString(), 
			height: (n.height * window.innerHeight / 100).toString()
		});
	}

	public render() {
		return (
			<div className={styles.main}>
				<canvas ref={(canvas) => {if (canvas !== null) this.canvas = canvas}} 
					className={styles.canvas} width={this.state.width} height={this.state.height} />
			</div>
		)
	}
}