import './styles.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

function findLinkEntities(contentBlock, callback, contentState) {
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

function getLinkComponent(config) {

  return class LinkDecorator extends Component {

    static propTypes = {
      entityKey: PropTypes.string.isRequired,
      children: PropTypes.array,
      contentState: PropTypes.object,
    };

    state = {
    };

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

      return (
        <span
          className="rdw-link-decorator-wrapper"
          onMouseEnter={this.toggleShowPopOver}
          onMouseLeave={this.toggleShowPopOver}
        >
          <Link
            to={url}
            target={targetOption}>{children}
          </Link>
        </span>
      );
    }
  };
}

export default config => ({
  strategy: findLinkEntities,
  component: getLinkComponent(config),
});
