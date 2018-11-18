import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";


import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";

import DoneIcon from "material-ui-icons/Done";

import Decorator from "decorator";

/**
 * В версии 0.11-alpha порядок методов отличается
 */
// function findLinkEntities(contentState, contentBlock, callback) {
function findLinkEntities(contentBlock, callback, contentState) {

  // console.log("findLinkEntities contentBlock", contentBlock);
  // console.log("findLinkEntities callback", callback);
  // console.log("findLinkEntities contentState", contentState);

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

    const {
      value,
    } = event.target;


    this.updateData({
      url: value,
    });

  }




  // componentWillReceiveProps(nextProps, nextState) {
  //   console.log("decorator componentWillReceiveProps", nextProps);
  // }


  render() {

    const {
      children,
      entityKey,
      contentState,
      decoratedText,
      isReadOnly,
    } = this.props;

    const {
      editing,
      showEditor,
    } = this.state;

    const readOnly = isReadOnly();

    const {
      url,
      targetOption,
    } = contentState.getEntity(entityKey).getData();

    // return <span>
    //   rgreg  rg gerg erg herg rger g <input />
    // </span>

    // console.log("Link decorator props", this.props);

    // console.log("Link decorator readOnly", readOnly);
    // console.log("Link decorator editing", editing);

    return (
      <Fragment>
        <a
          href={url || ""}
          target={targetOption}
          // onMouseEnter={this.toggleShowPopOver}
          // onMouseLeave={this.toggleShowPopOver}
          onMouseDown={this.showEditor}
        >
          {children}

        </a>
        {!readOnly && showEditor
          ?
          <Grid
            container
            alignItems="center"
          >
            <Grid
              item
              xs
            >
              <input
                type="text"
                // value={url || ""}
                value={url || ""}
                onChange={this.onUrlChange}
                onFocus={this.startEdit}
                onBlur={this.endEdit}
                style={{
                  width: "100%",
                }}
              // onClick={event => {
              //   console.log("Input url onClick", event);
              //   event.preventDefault();
              //   event.stopPropagation();
              //   return 'handled';
              // }}
              // onMouseDown={event => {
              //   // console.log("Input url onMouseDown", event);
              //   // event.preventDefault();
              //   // event.stopPropagation();

              //   // event.target.focus();

              //   this.startEdit();

              //   return 'handled';
              // }}
              // onMouseEnter={event => {
              //   console.log("Input url onMouseEnter", event);
              //   event.preventDefault();
              //   event.stopPropagation();
              //   return 'handled';
              // }}
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
