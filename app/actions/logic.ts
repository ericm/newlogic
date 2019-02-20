import { Assoc } from './../interfaces/canvas.d';
import GateNode from "../gates/Node";

export namespace Logic {
    export function graphCreate(endNodes: GateNode<any>[], startNodes: GateNode<any>[]): Assoc {
        let out = new Array<Array<boolean>>();
        for (let i in endNodes) {
            out.push(new Array<boolean>());
            for (let j in startNodes) {
                if (endNodes[i].hasSameGate(startNodes[j])) {
                    out[i].push(true);
                }
                else {
                    out[i].push(false);
                }
            }
        }
        return out;
    }
}