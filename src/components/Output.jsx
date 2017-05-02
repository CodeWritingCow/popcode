import React from 'react';
import {t} from 'i18next';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import classnames from 'classnames';
import ErrorList from './ErrorList';
import Preview from './Preview';

class Output extends React.Component {
  _renderErrorList(props) {
    return (
      <ErrorList
        {...props}
        onErrorClick={this.props.onErrorClick}
      />
    );
  }

  _renderPreview() {
    if (isNull(this.props.project)) {
      return null;
    }

    return (
      <Preview
        isValid={this.props.validationState === 'passed'}
        project={this.props.project}
        onClearRuntimeErrors={this.props.onClearRuntimeErrors}
        onRuntimeError={this.props.onRuntimeError}
      />
    );
  }

  _renderRuntimeErrorList() {
    if (!isEmpty(this.props.runtimeErrors)) {
      return this._renderErrorList({
        html: {items: [], state: 'passed'},
        css: {items: [], state: 'passed'},
        javascript: {
          items: this.props.runtimeErrors,
          state: this.props.runtimeErrors.length ? 'failed' : 'passed',
        },
        docked: true,
      });
    }

    return null;
  }

  _renderErrors() {
    if (this.props.validationState === 'validating') {
      return <div className="output__delayed-error-overlay" />;
    }

    if (this.props.validationState === 'failed') {
      return this._renderErrorList(this.props.errors);
    }

    return null;
  }

  render() {
    return (
      <div
        className={classnames(
          'environment__column',
          {u__hidden: this.props.isHidden},
        )}
      >
        <div className="environment__columnContents output">
          <div
            className="environment__label label"
            onClick={this.props.onHide}
          >
            {t('workspace.components.output')}
          </div>
          {this._renderErrors()}
          {this._renderPreview()}
          {this._renderRuntimeErrorList()}
        </div>
      </div>
    );
  }
}

Output.propTypes = {
  errors: React.PropTypes.object.isRequired,
  isHidden: React.PropTypes.bool.isRequired,
  project: React.PropTypes.object,
  runtimeErrors: React.PropTypes.array.isRequired,
  validationState: React.PropTypes.string.isRequired,
  onClearRuntimeErrors: React.PropTypes.func.isRequired,
  onErrorClick: React.PropTypes.func.isRequired,
  onHide: React.PropTypes.func.isRequired,
  onRuntimeError: React.PropTypes.func.isRequired,
};

Output.defaultProps = {
  project: null,
};

export default Output;
