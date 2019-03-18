import * as React from 'react';
import { NavBarState, NavBarProps } from '../interfaces/components';

let styles = require('./styles/NavBar.scss');

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
	public constructor(props: NavBarProps) {
		super(props);
		this.state = {
			clicked: null
		};
	}
	private click = (e: React.MouseEvent<HTMLLIElement>): void => {
		this.menuOff();
		this.setState({clicked: e.currentTarget});
		e.currentTarget.className = styles.show;
	}

	public menuOff = (): void => {
		if (this.state.clicked !== null) this.state.clicked.className = "";
	}

	public render(): React.ReactNode {
		return (
			<nav className={styles.main}>
				<ul>
					<li onClick={this.click}>File<ul>
						<li>Settings<i>Alt + P</i></li>
						<li>Exit</li>
					</ul></li>
					<li onClick={this.click}>Edit<ul>
						<li>Settings</li>
						<li>Exit</li>
					</ul></li>
					<li onClick={this.click}>View<ul>
						<li>Settings</li>
						<li>Exit</li>
					</ul></li>
					<li onClick={this.click}>Window<ul>
						<li>Window Manager</li>
						<li>Exit</li>
					</ul></li>
					<li onClick={this.click}>About<ul>
						<li>Settings</li>
						<li>Exit</li>
					</ul></li>
				</ul>
				<a></a>
			</nav>
		);
	}
}