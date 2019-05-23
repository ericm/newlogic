import * as canvas from "../interfaces/canvas";
import { IContext } from '../interfaces/components';
import { AnyGate, GateSize, Nodes } from './../interfaces/canvas.d';

export default class Gates<T extends Gates<any>>  {
    public static IDS: number[] = []

    public ctx: CanvasRenderingContext2D
    public svg: HTMLImageElement
    public state: canvas.State<T>
    // TODO: Properties
    public contextMenu: string[] = ["Delete"]
    public props = new Map<string, Array<any>>()

    public nodeOffsetStart: canvas.GateCoords[]
    public nodeOffsetEnd: canvas.GateCoords[]

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

    public context = (coords: canvas.GateCoords): IContext => {
        let height = 15 * (this.contextMenu.length) + 10;
        console.log(height);
        let obj: IContext = {size: {width: 200, height}, coords, gate: this, options: this.contextMenu};
        return obj;
    }

    // Overloaded in gates
    public checkCustomContext = (option: string): boolean => { return false; }
    
    public drag = (coords: canvas.GateCoords): void => {
        this.state.coords = coords;
        this.dragNodes(coords);
    }

    public dragNodes = (c: canvas.GateCoords): void => {
        for (let i in this.state.nodes.start) {
            const move: canvas.GateCoords = { x: c.x + this.nodeOffsetStart[i].x, y: c.y + this.nodeOffsetStart[i].y }
            this.state.nodes.start[i].setCoords(move);
        }
        for (let i in this.state.nodes.end) {
            const move: canvas.GateCoords = { x: c.x + this.nodeOffsetEnd[i].x, y: c.y + this.nodeOffsetEnd[i].y }
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

    public setProp<T>(key: string, value: T) {
        let get = this.props.get(key) || [];
        switch (get[0]) {
            case "number":
                get[3] = value;
                this.props.set(key, get);
                break;
        }
        this.checkProps();
    }

    public checkProps = () => {}

    public invert = () => {}

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

    public static REMID = (id: number): number[] => Gates.IDS.splice(Gates.IDS.findIndex(val => { return val === id; }), 1)

    public add = (c: canvas.GateCoords, s: GateSize, id?: number, invert = false): Nodes<any> => { return this.state.nodes }
}