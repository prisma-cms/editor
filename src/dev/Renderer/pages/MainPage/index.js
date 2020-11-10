import React from 'react';
// import PropTypes from 'prop-types';

import Page from "../layout";
// import DevApp from '../../../App';


import DevApp from "./TestApp";


class DevMainPage extends Page {

  render() {

    const {

      /**
       * https://github.com/ReactTraining/react-router/issues/5665
       */
      staticContext,
      history,
      match,
      location,

      children,
      ...other
    } = this.props;

    return super.render(
      <div>
        <div
          id="buttons"
        >
          <button
            onClick={event => this.forceUpdate()}
          >
            Force update
          </button>
        </div>

        <div
          id="content"
        >
          <DevApp
            {...other}
          >
          </DevApp>

          {children || "Main page"}

        </div>

      </div>
    );
  }
}


export default DevMainPage;