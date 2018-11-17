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
import { Button } from 'material-ui';
import { withStyles } from 'material-ui';


class TestApp extends Component {

  static defaultProps = {
    value: "",
    readOnly: false,
  }


  constructor(props) {

    super(props);

    const {
      value,
      readOnly,
    } = props;

    this.state = {
      value,
      readOnly,
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
      history,
      location,
      match,
      classes,
      ...other
    } = this.props;

    const {
      value: stateValue,
      newState,
      readOnly,
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

    return <div
      className={classes.root}
    >

      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism.css"
      />

      <div
        style={{
          marginTop: 10,
          marginBottom: 20,
        }}
      >

        <Button
          onClick={() => this.setState({
            readOnly: !readOnly,
          })}
          variant="raised"
        >
          {readOnly ? "Edit mode" : "Read only mode"}
        </Button>


      </div>

      <App
        {...other}
        onChange={newState => {

          this.setState({
            value: newState,
            newState,
          });

        }}
        value={stateValue}
        readOnly={readOnly}
      />

      <div
        style={{
          marginTop: 10,
        }}
      >

        {!readOnly
          ?
          <Button
            onClick={() => {
              this.setState({
                value,
              });
            }}
          // disabled={value === stateValue}
          >
            Reset value
          </Button>
          :
          null
        }

      </div>

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

        <Typography
          variant="title"
        >
          Editor state:
        </Typography>

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


const TestRenderer = withStyles({
  root: {
    fontSize: 16,
    fontFamily: "serif",
  },
})(TestApp)


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
        component: TestRenderer,
      },
      {
        exact: true,
        path: "/text-data",
        render: props => {

          return <TestRenderer
            value={textData}
            {...props}
          >
            <div>
              <Typography
                variant="title"
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
          </TestRenderer>
        }
      },
      {
        exact: true,
        path: "/content-state",
        render: props => {

          return <TestRenderer
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
          </TestRenderer>
        }
      },
      {
        path: "*",
        render: props => this.renderOtherPages(props),
      },
    ];

    return routes;

  }


  renderMenu() {
    return null;
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

