import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";


import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";

import DoneIcon from "material-ui-icons/Done";

import Decorator from "../../../components/decorator";
import { TextField } from 'material-ui';

import URI from "urijs";
import { Typography } from 'material-ui';

/**
 * В версии 0.11-alpha порядок методов отличается
 */
// function findLinkEntities(contentState, contentBlock, callback) {
function findLinkEntities(contentBlock, callback, contentState) {





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


  onUrlChange = event => {

    let {
      value,
    } = event.target;


    this.updateData({
      url: value,
    });

  }




  // componentWillReceiveProps(nextProps, nextState) {

  // }


  render() {

    const {
      children,
      entityKey,
      contentState,
      decoratedText,
      isReadOnly,
      onClick,
    } = this.props;

    const {
      editing,
      showEditor,
    } = this.state;

    const readOnly = isReadOnly();

    const {
      url,
    } = contentState.getEntity(entityKey).getData();

    // return <span>
    //   rgreg  rg gerg erg herg rger g <input />
    // </span>

    let helperText = "Укажите адрес ссылки";

    let Element = "a";
    let to;

    let uri;

    let target;

    if (url) {

      uri = new URI(url);



      /**
       * Если это текущий домен, то делаем ссылку локальной
       */
      if (uri.origin() === global.location.origin) {
        uri.origin("")
      }


      if (!uri.scheme()) {

        Element = Link;
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


    return (
      <Fragment>
        <Element
          href={url || ""}
          to={to}
          target={target}
          // onMouseEnter={this.toggleShowPopOver}
          // onMouseLeave={this.toggleShowPopOver}
          // onMouseDown={this.showEditor}
          onClick={event => {


            if (!readOnly) {

              event.preventDefault();

              this.showEditor(event)
              return;
            }

            return onClick && onClick(event) || false;

          }}
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

export default config => ({
  strategy: findLinkEntities,
  component: LinkDecorator,
  ...config,
});
