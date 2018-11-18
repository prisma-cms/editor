import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";


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


export class LinkDecorator extends Component {

  static propTypes = {
    entityKey: PropTypes.string.isRequired,
    children: PropTypes.array,
    contentState: PropTypes.object,
  };

  state = {
  };


  onUrlChange = event => {
    event.preventDefault();
    event.stopPropagation();
  }

  render() {

    const {
      children,
      entityKey,
      contentState,
    } = this.props;

    const {
      url,
      targetOption,
    } = contentState.getEntity(entityKey).getData();

    // return <span>
    //   rgreg  rg gerg erg herg rger g <input />
    // </span>

    console.log("Link decorator props", this.props);

    return (
      <Fragment>
        <a
          // onMouseEnter={this.toggleShowPopOver}
          // onMouseLeave={this.toggleShowPopOver}
          href={url || ""}
          target={targetOption}
        >
          {children}
        </a>

        <input
          type="text"
          value={url || ""}
          onChange={this.onUrlChange}
          onFocus={event => {
            console.log("Input url onFocus", event);
            event.preventDefault();
            event.stopPropagation();
            return 'handled';
          }}
          onClick={event => {
            console.log("Input url onClick", event);
            event.preventDefault();
            event.stopPropagation();
            return 'handled';
          }}
          // onMouseDown={event => {
          //   console.log("Input url onMouseDown", event);
          //   event.preventDefault();
          //   event.stopPropagation();

          //   event.target.focus();

          //   return 'handled';
          // }}
          onMouseEnter={event => {
            console.log("Input url onMouseEnter", event);
            event.preventDefault();
            event.stopPropagation();
            return 'handled';
          }}
        />

      </Fragment>
    );
  }
};

export default config => ({
  strategy: findLinkEntities,
  component: LinkDecorator,
});
