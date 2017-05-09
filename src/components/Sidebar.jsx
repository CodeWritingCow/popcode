import React from 'react';
import {t} from 'i18next';
import classnames from 'classnames';
import partial from 'lodash/partial';
import WordmarkVertical from '../../static/images/wordmark-vertical.svg';

class Sidebar extends React.Component {
  _renderHiddenComponents() {
    const components = this.props.hiddenComponents.
      map(componentName => (
        <div
          className="sidebar__minimized-component"
          key={componentName}
          onClick={partial(this.props.onComponentUnhide, componentName)}
        >
          {t(`workspace.components.${componentName}`)}
        </div>
      ));

    return (
      <div className="sidebar__minimized-components">
        {components}
      </div>
    );
  }

  render() {
    const sidebarClassnames = classnames(
      'sidebar',
      {
        sidebar_yellow: this.props.validationState === 'validating',
        sidebar_red: this.props.validationState === 'failed',
      },
    );

    return (
      <div className={sidebarClassnames}>
        <div className="sidebar__wordmark-container">
          <WordmarkVertical />
        </div>
        <div
          className={classnames(
            'sidebar__arrow',
            {
              sidebar__arrow_show: !this.props.dashboardIsOpen,
              sidebar__arrow_hide: this.props.dashboardIsOpen,
            },
          )}
          onClick={this.props.onToggleDashboard}
        />
        {this._renderHiddenComponents()}
      </div>
    );
  }
}

Sidebar.propTypes = {
  dashboardIsOpen: React.PropTypes.bool.isRequired,
  hiddenComponents: React.PropTypes.array.isRequired,
  validationState: React.PropTypes.string.isRequired,
  onComponentUnhide: React.PropTypes.func.isRequired,
  onToggleDashboard: React.PropTypes.func.isRequired,
};

export default Sidebar;
