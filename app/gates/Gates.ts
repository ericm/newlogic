import { AnyGate, Nodes, GateSize } from './../interfaces/canvas.d';
import { GateCoords, State } from "../interfaces/canvas";
import { IContext } from '../interfaces/components';
import { Wiring } from '../actions/canvas';

export default class Gates<T extends Gates<any>>  {
    public static IDS: number[] = []

    public ctx: CanvasRenderingContext2D
    public svg: HTMLImageElement
    public state: State<T>
    public contextMenu: string[] = ["Properties", "Name"]

    public nodeOffsetStart: GateCoords[]
	public nodeOffsetEnd: GateCoords[]

    public render = (): void => {
        this.ctx.drawImage(this.svg, this.state.coords.x, this.state.coords.y,
            this.state.size.width, this.state.size.height);
    }

    public click = (): void => {
        this.ctx.setLineDash([6]);
        this.ctx.lineWidth = 1;
        this.ctx.rect(this.state.coords.x - 6, this.state.coords.y - 6,
            this.state.size.width + 12, this.state.size.height + 12);
        this.ctx.stroke();

        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([0]);

    }

    public context = (coords: GateCoords): IContext => {
        let height = 15 * (this.contextMenu.length+1);
        let obj: IContext = {size: {width: 100, height}, coords, gate: this, options: this.contextMenu};
        Wiring.renderContext(this.ctx, obj);
        return obj;
    }

    public drag = (coords: GateCoords): void => {
        this.state.coords = coords;
        this.dragNodes(coords);
    }

    public dragNodes = (c: GateCoords): void => {
		for (let i in this.state.nodes.start) {
			const move: GateCoords = { x: c.x + this.nodeOffsetStart[i].x, y: c.y + this.nodeOffsetStart[i].y }
			this.state.nodes.start[i].setCoords(move);
		}
		for (let i in this.state.nodes.end) {
			const move: GateCoords = { x: c.x + this.nodeOffsetEnd[i].x, y: c.y + this.nodeOffsetEnd[i].y }
			this.state.nodes.end[i].setCoords(move);
		}
    }
    
    public clickSpecific = (): void => {}

    public connect = (type: string, gate: AnyGate): void => {
        switch (type) {
            case "in":
                this.state.gateIn.push(gate);
                break;
            case "out":
                this.state.gateOut.push(gate);
                break;
        }
    }

    public upEval = (): void => 
        this.state.gateIn.forEach((val) => {
            val.evaluate();
        });
    

    public evaluate = (): void => {}

    public static INCID = (): number => {
        let id: number = Gates.IDS.length > 0 ? Gates.IDS[Gates.IDS.length-1] + 1 : 0;
        Gates.IDS.push(id);
        console.log(Gates.IDS);
        return id;
    }

    public add = (c: GateCoords, s: GateSize, id?: number): Nodes<any> => { return this.state.nodes }
}