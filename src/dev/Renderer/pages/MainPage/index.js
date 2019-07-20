import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Page from "../layout";
// import DevApp from '../../../App';


import TestApp from "./TestApp";


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

    // console.log("children", children, typeof children);

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
          <TestApp
            {...other}
          >
          </TestApp>

          {children || "Main page"}

        </div>

      </div>
    );
  }
}


export default DevMainPage;