import * as React from 'react';
import Workspace from './Workspace';

let styles = require('./Home.scss');

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <div className={styles.window}>
            <Workspace />
          </div>
        </div>
      </div>
    );
  }
}
