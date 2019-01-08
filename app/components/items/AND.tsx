import * as React from 'react';
import { AndProps, AndState } from '../../interfaces/items'
import { Image } from 'react-konva';

let image = require('../../img/and.svg')

export default class AndGate extends React.Component<AndProps, AndState> {


	public render() {

			return (
				<Image image={image} />
			);
		} 
		

	

}