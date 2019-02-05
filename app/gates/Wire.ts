import { WireProps } from "../interfaces/canvas";

export default class Wire {
    public state: WireProps
    constructor(props: WireProps) {
        this.state = props;
    }
}