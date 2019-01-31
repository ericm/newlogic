import * as React from 'react';
import { WorkspaceProps, WorkspaceState, Component } from '../interfaces/components';
import { GateCoords } from '../interfaces/canvas';

let styles = require('./styles/Workspace.scss');

//import items (gates etc)
import AndGate from './canvas/AND';

export default class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {

	private canvas: HTMLCanvasElement
	public ctx: CanvasRenderingContext2D

	public constructor(props: WorkspaceProps) {
		super(props);
		this.state = {
			width: (this.props.width * window.innerWidth / 100).toString(), 
			height: (this.props.height * window.innerHeight / 100).toString()
		}
	}
	
	public componentDidMount() {
		this.setCtx();
		this.setState({
			width: (this.props.width * window.innerWidth / 100).toString(), 
			height: (this.props.height * window.innerHeight / 100).toString()
		});
	}
	
	public componentDidUpdate() {
		this.updateCanvas();
	}

	private setCtx = (): void => {
		const cont = this.canvas.getContext('2d');
		if (cont !== null) {
			this.ctx = cont;
		}
	}

	private updateCanvas = (): void => {
		this.ctx.fillText("Hello World", 10, 50);
	}

	private canvasClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
		const box = e.currentTarget.getBoundingClientRect();
		const and = new AndGate(this.ctx);
		const coords: GateCoords = {x: e.clientX - box.left, y: e.clientY - box.top}
		and.add(coords);
		
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
				<canvas ref={(canvas) => {if (canvas !== null) this.canvas = canvas}} onClick={this.canvasClick}
					className={styles.canvas} width={this.state.width} height={this.state.height} />
			</div>
		)
	}
}