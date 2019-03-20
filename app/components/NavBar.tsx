import * as React from 'react';
import { NavBarState, NavBarProps } from '../interfaces/components';
import Home from './Home';

let styles = require('./styles/NavBar.scss');

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
	public home: Home

	public constructor(props: NavBarProps) {
		super(props);
		this.state = {
			clicked: null
		};
	}
	private click = (e: React.MouseEvent<HTMLLIElement>): void => {
		this.menuOff();
		if (this.state.clicked !== e.currentTarget) {
			this.setState({clicked: e.currentTarget});
			e.currentTarget.className = styles.show;
		} else {
			this.setState({clicked: null});
		}
		
	}

	private save = (e: React.MouseEvent<HTMLLIElement>): void => {
		if (!!this.home) {
			this.home._workspaces[this.home.selectedWorkspace].save(false);
		}
	}

	private saveAs = (e: React.MouseEvent<HTMLLIElement>): void => {
		if (!!this.home) {
			this.home._workspaces[this.home.selectedWorkspace].save(true);
		}
	}

	public menuOff = (): void => {
		if (this.state.clicked !== null) this.state.clicked.className = "";
	}

	public render(): JSX.Element {
		return (
			<nav className={styles.main}>
				<ul>
					<li onClick={this.click}>File<ul>
						<li onClick={this.save}>Save</li>
						<li onClick={this.saveAs}>Save As</li>
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