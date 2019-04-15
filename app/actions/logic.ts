import * as components from "../interfaces/components";

export namespace Logic {
    export function evalAll(gates: components.AllGates): void {
        // Go through each output eval
        for (let i = 0; i < gates.led.length; i++) {
            gates.led[i].evaluate();
        }
    }
}