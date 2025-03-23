import { all } from 'redux-saga/effects';
import reposSaga from './reposSaga';
import repoDetailsSaga from './repoDetailsSaga';

export default function* rootSaga() {
  yield all([reposSaga(), repoDetailsSaga()]);
}
