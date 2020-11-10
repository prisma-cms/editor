/* eslint-disable react/forbid-foreign-prop-types */
import React, { PureComponent } from 'react';
import PropTypes from "prop-types";

import PrismaCmsApp from '@prisma-cms/front'
import { Renderer as PrismaCmsRenderer } from '@prisma-cms/front'

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import withStyles from 'material-ui/styles/withStyles';

import { Link } from "react-router-dom";

import App from "../../../../App";

import textData from "./mock/data/text";
import contentStateData from "./mock/data/contentState";
import linkStateData from "./mock/data/link";
import codeStateData from "./mock/data/code";
import imageStateData from "./mock/data/image";


import prism from 'prismjs';
import 'prismjs/components/prism-json.js';


import EditableObject from "apollo-cms/lib/DataView/Object/Editable";

const withContentState = {
  object: {
    name: "With contentState",
    newState: contentStateData,
  },
};


class TestApp extends EditableObject {

  static defaultProps = {
    ...EditableObject.defaultProps,
    value: "",
    readOnly: false,
    data: {
      object: {},
    },
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

  canEdit() {

    return true;
  }


  // componentDidMount() {

  //   const css = require('prismjs/themes/prism.css');


  // }


  renderEditableView() {

    return this.renderDefaultView();
  }

  onChangeBind = newState => {

    this.updateObject({
      newState,
    });

  };


  renderDefaultView() {

    const {
      value,
      children,
      // history,
      // location,
      // match,
      classes,
      ...other
    } = this.props;

    const {
      // value: stateValue,
      // newState,
      readOnly,
    } = this.state;

    let stateOutput;

    const {
      newState,
    } = this.getObjectWithMutations() || {};

    if (newState) {

      try {

        const json = JSON.stringify(newState, null, 2);



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
        onChange={this.onChangeBind}
        // value={stateValue}
        // value={newState || stateValue}
        value={newState || null}
        // value={`gdfg
        // <div>dfhfghfg</div>
        // fghfgh
        // fghfghfg`}
        readOnly={readOnly}
      // readOnly={false}
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
})(props => <TestApp
  {...props}
/>)


class InnerDevRenderer extends PrismaCmsRenderer {


  static propTypes = {
    ...PrismaCmsRenderer.propTypes,
    pure: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...PrismaCmsRenderer.defaultProps,
    pure: false,
  }


  getRoutes() {

    const {
      classes,
      PageNotFound,
      Auth,
      routes: routesNull,
      useMetamask,
      ...other
    } = this.props;

    let routes = [
      {
        exact: true,
        path: "/",
        render: props => {

          return <div>

            <TestRenderer
              cacheKey={"test_editor/1"}
              {...other}
            >
            </TestRenderer>

            <TestRenderer
              cacheKey={"test_editor/2"}
              {...other}
            >
            </TestRenderer>
          </div>
        }
      },
      {
        exact: true,
        path: "/text-data",
        render: props => {

          return <TestRenderer
            // value={textData}
            cacheKey={"test_editor/text-data"}
            data={{
              object: {
                name: "From text data",
                newState: textData,
              },
            }}
            {...other}
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
            // value={contentStateData}
            cacheKey={"test_editor/with-state"}
            data={withContentState}
            {...other}
          >
          </TestRenderer>
        }
      },
      {
        exact: true,
        path: "/link",
        render: props => {

          return <TestRenderer
            // value={linkStateData}
            cacheKey={"test_editor/link"}
            data={{
              object: {
                newState: linkStateData,
              },
            }}
            {...other}
          >
          </TestRenderer>
        }
      },
      {
        exact: true,
        path: "/link-custom",
        render: props => {

          return <TestRenderer
            // value={linkStateData}
            {...other}
            cacheKey={"test_editor/link"}
            data={{
              object: {
                newState: linkStateData,
              },
            }}
            LinkComponent={({
              to: href,
              style,
              children,
              ...other
            }) => {
              return <a {...other} href={href} style={{ ...style, color: "green" }}>{children}</a>;
            }}
          >
          </TestRenderer>
        }
      },
      {
        exact: true,
        path: "/code",
        render: props => {

          return <TestRenderer
            // value={codeStateData}
            cacheKey={"test_editor/code"}
            data={{
              object: {
                newState: codeStateData,
              },
            }}
            {...other}
          >
          </TestRenderer>
        }
      },
      {
        exact: true,
        path: "/image",
        render: props => {

          return <TestRenderer
            // value={imageStateData}
            cacheKey={"test_editor/image"}
            data={{
              object: {
                newState: imageStateData,
              },
            }}
            {...other}
          >
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

          <Grid
            item
          >
            <Link
              to="/link"
            >
              Link
            </Link>

          </Grid>

          <Grid
            item
          >
            <Link
              to="/link-custom"
            >
              Custom Link Component
            </Link>

          </Grid>

          <Grid
            item
          >
            <Link
              to="/code"
            >
              Code
            </Link>

          </Grid>

          <Grid
            item
          >
            <Link
              to="/image"
            >
              Image
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

export default class DevApp extends PureComponent {

  static propTypes = {
  }

  static defaultProps = {
    lang: "ru",
  }

  render() {

    const {
      ...other
    } = this.props;

    return <PrismaCmsApp
      Renderer={InnerDevRenderer}
      // pure={true}
      {...other}
    />
  }
}

