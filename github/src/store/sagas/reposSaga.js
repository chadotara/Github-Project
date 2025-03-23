import { call, put, takeLatest, select, delay } from 'redux-saga/effects';
import { fetchRepos } from '../../api/github';
import { fetchReposStart, fetchReposSuccess, fetchReposFailure } from '../slices/reposSlice';

function* loadRepos() {
  try {
    const { page, filter } = yield select((state) => state.repos);

    // Compute the createdAfter date based on filter
    const now = new Date();
    let pastDate;
    if (filter === '1week') {
      pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (filter === '2weeks') {
      pastDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    } else { // '1month'
      pastDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    const createdAfter = pastDate.toISOString().split('T')[0]; // YYYY-MM-DD

    const repos = yield call(fetchRepos, createdAfter, page);
    yield put(fetchReposSuccess(repos));
  } catch (error) {
    const errorMsg = error.toString().toLowerCase();
    if (errorMsg.includes('rate limit')) {
      yield put(fetchReposFailure('Rate limit exceeded. Please wait a few minutes before trying again.'));
      // Optionally retry after delay:
      // yield delay(120000);
      // yield put(fetchReposStart());
    } else {
      yield put(fetchReposFailure(error.toString()));
    }
  }
}

export default function* reposSaga() {
  yield takeLatest(fetchReposStart.type, loadRepos);
}
