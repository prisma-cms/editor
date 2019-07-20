import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import { PrismaEditor as App, styles } from '../App';

import PrismaCmsPerformanceTester from "@prisma-cms/performance";
import withStyles from 'material-ui/styles/withStyles';

export class DevApp extends App {

  // static defaultProps = {
  //   ...App.defaultProps,
  //   classes: {},
  // }


  render() {

    return <Fragment>
      <div
        id="prisma-cms-performance-tester"
      >
        <PrismaCmsPerformanceTester
          // test={{}}
          props={this.props}
          state={this.state}
          context={this.context}
          prefix="dev_app"
        />
      </div>

      {super.render()}
    </Fragment>
  }

}

// export default DevApp;

export default withStyles(styles)(props => <DevApp
  {...props}
/>);
