import { createSlice } from '@reduxjs/toolkit';

const repoDetailsSlice = createSlice({
  name: 'repoDetails',
  initialState: {
    codeFrequency: [],
    commitActivity: [],
    contributors: [],
    loading: false,
    error: null,
    chartFilter: 'commit'  // default: "commit", can also be "additions" or "deletions"
  },
  reducers: {
    fetchRepoDetailsStart(state, action) {
      state.loading = true;
    },
    fetchRepoDetailsSuccess(state, action) {
      state.codeFrequency = action.payload.codeFrequency;
      state.commitActivity = action.payload.commitActivity;
      state.contributors = action.payload.contributors;
      state.loading = false;
    },
    fetchRepoDetailsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setChartFilter(state, action) {
      state.chartFilter = action.payload;
    },
    resetRepoDetails(state) {
      state.codeFrequency = [];
      state.commitActivity = [];
      state.contributors = [];
      state.error = null;
      state.loading = false;
    }
  }
});

export const {
  fetchRepoDetailsStart,
  fetchRepoDetailsSuccess,
  fetchRepoDetailsFailure,
  setChartFilter,
  resetRepoDetails
} = repoDetailsSlice.actions;
export default repoDetailsSlice.reducer;
