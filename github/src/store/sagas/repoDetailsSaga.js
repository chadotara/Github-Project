// src/store/sagas/repoDetailsSaga.js
import { call, put, all, takeLatest, delay } from 'redux-saga/effects';
import { fetchRepoDetailsStart, fetchRepoDetailsSuccess, fetchRepoDetailsFailure } from '../slices/repoDetailsSlice';
import { fetchCodeFrequency, fetchCommitActivity, fetchContributorsStats } from '../../api/github';

// Polls the given fetch function until data is available or maxAttempts is reached.
function* pollRepoStats(owner, repo, fetchFunc, maxAttempts = 5) {
  let attempt = 0;
  let data;
  while (attempt < maxAttempts) {
    data = yield call(fetchFunc, owner, repo);
    if (data && data.length > 0) {
      return data;
    }
    // Wait 3 seconds before the next attempt
    yield delay(3000);
    attempt++;
  }
  return data;
}

function* loadRepoDetails(action) {
  const { owner, repo } = action.payload;
  try {
    // Use polling for commit activity and code frequency.
    const [codeFrequency, commitActivity, contributors] = yield all([
      call(pollRepoStats, owner, repo, fetchCodeFrequency, 5),
      call(pollRepoStats, owner, repo, fetchCommitActivity, 5),
      call(fetchContributorsStats, owner, repo) // For contributors, we assume data is available or empty.
    ]);
    yield put(fetchRepoDetailsSuccess({ codeFrequency, commitActivity, contributors }));
  } catch (error) {
    const errorMsg = error.toString().toLowerCase();
    if (errorMsg.includes('rate limit')) {
      yield put(fetchRepoDetailsFailure('Rate limit exceeded. Please wait a few minutes before trying again.'));
    } else {
      yield put(fetchRepoDetailsFailure(error.toString()));
    }
  }
}

export default function* repoDetailsSaga() {
  yield takeLatest(fetchRepoDetailsStart.type, loadRepoDetails);
}
