import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// import { Link } from "react-router-dom";


import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";

import DoneIcon from "material-ui-icons/Done";

import Decorator from "../../../components/decorator";
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

import URI from "urijs";
import { ContentBlock, ContentState } from 'draft-js';

/**
 * В версии 0.11-alpha порядок методов отличается
 */
// function findLinkEntities(contentState, contentBlock, callback) {
function findLinkEntities(contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) {


  // return;

  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback,
  );
}


export class LinkDecorator extends Decorator {


  // static contextTypes = {
  //   ...Decorator.contextType,
  //   uri: PropTypes.object.isRequired,
  // }

  static propTypes = {
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...Decorator.propTypes,

    /**
     * Link component to render
     */
    Component: PropTypes.func.isRequired,
  }


  onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const {
      value,
    } = event.target;


    this.updateData({
      url: value,
    });

  }




  // componentWillReceiveProps(nextProps, nextState) {

  // }

  onClick = (event: React.MouseEvent) => {

    const {
      isReadOnly,
      onClick,
    } = this.props;

    const readOnly = isReadOnly();

    if (!readOnly) {

      event.preventDefault();

      this.showEditor()
      return;
    }

    return (onClick && onClick(event)) || false;

  }


  render() {

    const {
      children,
      entityKey,
      contentState,
      isReadOnly,
      // onClick,
      // Component: Link,
      Component: Element,
    } = this.props;

    const {
      showEditor,
    } = this.state;

    const readOnly = isReadOnly();

    const {
      url,
    } = contentState.getEntity(entityKey).getData();

    // return <span>
    //   rgreg  rg gerg erg herg rger g <input />
    // </span>

    let helperText: React.ReactNode = "Укажите адрес ссылки";

    // let Element = "a";
    let to = url;

    let uri;

    let target;

    const {
      location,
    } = global;

    if (url) {

      uri = new URI(url);



      /**
       * Если это текущий домен, то делаем ссылку локальной
       */
      if (location && uri.origin() === location.origin) {
        uri.origin("")
      }


      if (!uri.scheme()) {

        // Element = Link;
        to = uri.toString();


        if (!to.startsWith("/")) {
          to = `/${to}`;
        }

        helperText = <Typography
          color="secondary"
          component="span"
        >
          Ссылка на локальную страницу
        </Typography>;

      }
      else {

        target = "_blank";

        helperText = <Typography
          color="primary"
          component="span"
        >
          Ссылка на внешний источник
        </Typography>;

      }

    }

    // console.log("Element url", url);
    // console.log("Element to", to);

    return (
      <Fragment>
        <Element
          href={url || ""}
          to={to}
          target={target}
          // onMouseEnter={this.toggleShowPopOver}
          // onMouseLeave={this.toggleShowPopOver}
          // onMouseDown={this.showEditor}
          onClick={this.onClick}
        >
          {children}

        </Element>

        {!readOnly && (showEditor || !url)
          ?
          <div
            style={{
              marginBottom: 20,
            }}
          >
            <Grid
              container
              alignItems="center"
            >
              <Grid
                item
                xs
              >
                <TextField
                  onMouseDown={this.showEditor}
                  value={url || ""}
                  onChange={this.onUrlChange}
                  onFocus={this.startEdit}
                  onBlur={this.endEdit}
                  fullWidth
                  label="Адрес ссылки"
                  placeholder="https://..."
                  helperText={helperText}
                  error={!url}
                />
              </Grid>
              <Grid
                item
              >
                <IconButton
                  onClick={this.hideEditor}
                >
                  <DoneIcon
                    style={{
                      color: "green",
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </div>
          :
          null
        }

        {/* {children} */}

        {/* {decoratedText} */}


      </Fragment>
    );
  }
};

const EditorLinkDecorator = (config: any) => ({
  strategy: findLinkEntities,
  component: LinkDecorator,
  ...config,
});

export default EditorLinkDecorator;
