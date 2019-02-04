import * as React from 'react';
import { WorkspaceProps, WorkspaceState, Component, Gates } from '../interfaces/components';
import { GateCoords, GateSize } from '../interfaces/canvas';

let styles = require('./styles/Workspace.scss');

//import items (gates etc)
import AndGate from './canvas/AND';

export default class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {

	private canvas: HTMLCanvasElement
	public ctx: CanvasRenderingContext2D
	public gates: Gates

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
		this.gates = {and: []}
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
		this.gates.and.push(new AndGate(this.ctx));
	}

	private canvasClick = (e: React.MouseEvent<HTMLCanvasElement>): void => {
		const box = e.currentTarget.getBoundingClientRect();
		const coords: GateCoords = {x: e.clientX - box.left, y: e.clientY - box.top};
		const size: GateSize = {width: 40, height: 40}
		this.gates.and[0].add(coords, size);
		
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