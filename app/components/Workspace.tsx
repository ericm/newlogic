import * as React from 'react';
import { Stage, Layer, Text } from 'react-konva';

let styles = require('./styles/Workspace.scss');

export default class Workspace extends React.Component {
    render() {
        return (
            <Stage width={parent.length} /*height={parent.}*/ className={styles.main}>
                <Layer>
                    <Text text="hi" />
                </Layer>
            </Stage>
        )
    }
}