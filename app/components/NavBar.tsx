import * as React from 'react';
import { NavBarState, NavBarProps } from '../interfaces/components';

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
    public constructor(props: NavBarProps) {
        super(props);
        this.state = {};
    }
    private click = (e: React.MouseEvent<HTMLLIElement>): void => {

    }

    public render(): React.ReactNode {
        return (
            <nav>
            <ul>
              <li onClick={this.click}>File<ul>
                <li onclick="nav_settings(this)">Settings<i>Alt + P</i></li>
                <li onclick="nav_exit(this)">Exit</li>
              </ul></li>
              <li onClick={this.click}>Edit<ul>
                <li onclick="nav_settings(this)">Settings</li>
                <li onclick="nav_exit(this)">Exit</li>
              </ul></li>
              <li onClick={this.click}>View<ul>
                <li onclick="nav_settings(this)">Settings</li>
                <li onclick="nav_exit(this)">Exit</li>
              </ul></li>
              <li onClick={this.click}>Window<ul>
                <li onclick="nav_settings(this)">Window Manager</li>
                <li onclick="nav_exit(this)">Exit</li>
              </ul></li>
              <li onClick={this.click}>About<ul>
                <li onclick="nav_settings(this)">Settings</li>
                <li onclick="nav_exit(this)">Exit</li>
              </ul></li>
            </ul>
            <a></a>
          </nav>
        );
    }
}