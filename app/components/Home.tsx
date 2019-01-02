import * as React from 'react';
import Workspace from './Workspace';
import WindowBar from './WindowBar';

let styles = require('./styles/Home.scss');

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <WindowBar title={"Canvas"}>
            <Workspace />
          </WindowBar>
        </div>
      </div>
    );
  }
}
