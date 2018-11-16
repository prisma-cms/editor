import React, { Component } from 'react';
import PropTypes from "prop-types";

import PrismaCmsApp from '@prisma-cms/front'
import { Renderer as PrismaCmsRenderer } from '@prisma-cms/front'

import * as queryFragments from "@prisma-cms/front/lib/schema/generated/api.fragments";

import { Grid } from 'material-ui';
import { Typography } from 'material-ui';

import { Link } from "react-router-dom";

import App from "../App";

import textData from "./mock/data/text";
import contentStateData from "./mock/data/contentState";


import prism from 'prismjs';
import 'prismjs/components/prism-json.js';


class TestApp extends Component {

  static defaultProps = {
    value: "",
  }


  constructor(props) {

    super(props);

    const {
      value,
    } = props;

    this.state = {
      value,
    }

  }


  // componentDidMount() {

  //   const css = require('prismjs/themes/prism.css');

  //   console.log("css", css);
  // }


  render() {

    const {
      value,
      children,
      ...other
    } = this.props;

    const {
      value: stateValue,
      newState,
    } = this.state;

    let stateOutput;

    if (newState) {

      try {

        const json = JSON.stringify(newState, null, 2);

        // console.log("Test json", json);

        stateOutput = prism.highlight(json, prism.languages["json"]);
      }
      catch (error) {
        console.error(error);
      }

    }

    return <div>

      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism.css"
      />

      <App
        onChange={newState => {

          console.log("Test Editor onChange", newState);

          this.setState({
            value: newState,
            newState,
          });
        }}
        value={stateValue}
        {...other}
      />

      <div
        style={{
          marginTop: 30,
        }}
      >
        {children}
      </div>

      {stateOutput ? <div
        style={{
          marginTop: 30,
        }}
      >
        <div
          style={{
            whiteSpace: "pre-wrap",
          }}
          dangerouslySetInnerHTML={{
            __html: stateOutput,
          }}
        />
      </div> : null}

    </div>

  }

}


class DevRenderer extends PrismaCmsRenderer {


  static propTypes = {
    ...PrismaCmsRenderer.propTypes,
    pure: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...PrismaCmsRenderer.defaultProps,
    pure: false,
  }


  getRoutes() {

    let routes = [
      {
        exact: true,
        path: "/",
        component: TestApp,
      },
      {
        exact: true,
        path: "/text-data",
        render: props => {

          return <TestApp
            value={textData}
            {...props}
          >
            <div>
              <Typography
                variant="subheading"
              >
                Raw text input value:
              </Typography>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {textData}
              </div>
            </div>
          </TestApp>
        }
      },
      {
        exact: true,
        path: "/content-state",
        render: props => {

          return <TestApp
            value={contentStateData}
            {...props}
          >
            {/* <div>
              <Typography
                variant="subheading"
              >
                Raw text input value:
              </Typography>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {textData}
              </div>
            </div> */}
          </TestApp>
        }
      },
      {
        path: "*",
        render: props => this.renderOtherPages(props),
      },
    ];

    return routes;

  }


  renderRoutes() {

    return <div
      style={{
        maxWidth: 1200,
        margin: "20px auto 0",
      }}
    >

      <div
        style={{
          margin: "20px 0",
        }}
      >
        <Grid
          container
          spacing={8}
        >

          <Grid
            item
          >
            <Link
              to="/"
            >
              Empty editor
            </Link>

          </Grid>

          <Grid
            item
          >
            <Link
              to="/text-data"
            >
              Create from text data
            </Link>

          </Grid>

          <Grid
            item
          >
            <Link
              to="/content-state"
            >
              With content-state
            </Link>

          </Grid>

        </Grid>


      </div>

      {super.renderRoutes()}
    </div>

  }


  render() {

    const {
      pure,
      ...other
    } = this.props;

    return pure ? <App
      {...other}
    /> : super.render();

  }

}

export default class DevApp extends Component {

  static propTypes = {
    queryFragments: PropTypes.object.isRequired,
  }

  static defaultProps = {
    queryFragments,
    lang: "ru",
  }

  render() {

    const {
      queryFragments,
      ...other
    } = this.props;

    return <PrismaCmsApp
      queryFragments={queryFragments}
      Renderer={DevRenderer}
      // pure={true}
      {...other}
    />
  }
}

