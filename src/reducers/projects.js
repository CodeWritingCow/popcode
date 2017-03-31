import {readFileSync} from 'fs';
import path from 'path';
import Immutable from 'immutable';
import isNil from 'lodash/isNil';

import {isPristineProject} from '../util/projectUtils';

const emptyMap = new Immutable.Map();

const newProject = Immutable.fromJS({
  sources: {
    html: readFileSync(path.join(
      __dirname,
      '..',
      '..',
      'templates',
      'new.html',
    ), 'utf8'),
    css: '',
    javascript: '',
  },
  enabledLibraries: new Immutable.Set(),
});

function projectToImmutable(project) {
  return Immutable.fromJS(project).set(
    'enabledLibraries',
    new Immutable.Set(project.enabledLibraries),
  );
}

function addProject(state, project) {
  return state.set(project.projectKey, projectToImmutable(project));
}

function removePristineExcept(state, keepProjectKey) {
  return state.filter((project, projectKey) => (
    projectKey === keepProjectKey || !isPristineProject(project)
  ));
}

function projects(stateIn, action) {
  let state;

  if (stateIn === undefined) {
    state = emptyMap;
  } else {
    state = stateIn;
  }

  switch (action.type) {
    case 'PROJECT_LOADED':
      return addProject(state, action.payload.project);

    case 'PROJECT_SOURCE_EDITED':
      return state.setIn(
        [action.payload.projectKey, 'sources', action.payload.language],
        action.payload.newValue,
      ).setIn(
        [action.payload.projectKey, 'updatedAt'],
        action.meta.timestamp,
      );

    case 'PROJECT_CREATED':
      return removePristineExcept(state, action.payload.projectKey).set(
        action.payload.projectKey,
        newProject.set('projectKey', action.payload.projectKey),
      );

    case 'CHANGE_CURRENT_PROJECT':
      return removePristineExcept(state, action.payload.projectKey);

    case 'RESET_WORKSPACE':
      if (isNil(action.payload.currentProjectKey)) {
        return emptyMap;
      }

      return new Immutable.Map().set(
        action.payload.currentProjectKey,
        state.get(action.payload.currentProjectKey),
      );

    case 'PROJECT_LIBRARY_TOGGLED':
      return state.updateIn(
        [action.payload.projectKey, 'enabledLibraries'],
        (enabledLibraries) => {
          const libraryKey = action.payload.libraryKey;
          if (enabledLibraries.has(libraryKey)) {
            return enabledLibraries.delete(libraryKey);
          }
          return enabledLibraries.add(libraryKey);
        },
      ).setIn(
        [action.payload.projectKey, 'updatedAt'],
        action.meta.timestamp,
      );

    default:
      return state;
  }
}

export default projects;
