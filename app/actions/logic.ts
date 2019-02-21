import { AllGates } from "../interfaces/components";

export namespace Logic {
    export function evalAll(gates: AllGates): void {
		// Go through each output eval
		for (let i = 0; i < gates.led.length - 1; i++) {
			gates.led[i].evaluate();
		}
	}
}