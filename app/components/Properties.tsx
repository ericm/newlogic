import * as React from 'react';
import { PropertiesProps, PropertiesState } from '../interfaces/components';

let styles = require('./styles/Properties.scss');

export default class Properties extends React.Component<PropertiesProps, PropertiesState> {

	public constructor(props: PropertiesProps) {
        super(props);
        // let options = [(<label>Name<input type="text"/></label>)];
        // for (let option of this.props.gate.contextMenu) {
        //     options.push(())
        // }
    }
    
    public unmount = (_: React.MouseEvent<HTMLDivElement>) => { this.props.home.unmountPopup() }
    

	public render(): JSX.Element {
		return (
            <div className={styles.back} onClick={this.unmount}>
                <article className={styles.popup}>
                    
                </article>
            </div>
		);
	}
}