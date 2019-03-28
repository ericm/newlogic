import * as React from 'react';
import { PropertiesProps, PropertiesState } from '../interfaces/components';
import Home from './Home';

let styles = require('./styles/Properties.scss');

export default class Properties extends React.Component<PropertiesProps, PropertiesState> {
	public home: Home

	public constructor(props: PropertiesProps) {
        super(props);
        // let options = [(<label>Name<input type="text"/></label>)];
        // for (let option of this.props.gate.contextMenu) {
        //     options.push(())
        // }
	}

	public render(): JSX.Element {
		return (
            <div className={styles.back}>
                <article className={styles.popup}>
                    
                </article>
            </div>
		);
	}
}