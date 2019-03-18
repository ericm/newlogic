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
                <li>Settings<i>Alt + P</i></li>
                <li>Exit</li>
              </ul></li>
              <li>Edit<ul>
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