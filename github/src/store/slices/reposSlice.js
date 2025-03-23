// src/store/slices/reposSlice.js
import { createSlice } from '@reduxjs/toolkit';

const reposSlice = createSlice({
  name: 'repos',
  initialState: {
    items: [],
    page: 1,
    loading: false,
    error: null,
    filter: '1month' // default filter value
  },
  reducers: {
    fetchReposStart(state) {
      state.loading = true;
    },
    fetchReposSuccess(state, action) {
      state.items = [...state.items, ...action.payload];
      state.page += 1;
      state.loading = false;
    },
    fetchReposFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetRepos(state) {
      state.items = [];
      state.page = 1;
    },
    setFilter(state, action) {
      state.filter = action.payload;
      // Optionally reset items and page here as well:
      state.items = [];
      state.page = 1;
    }
  }
});

export const { fetchReposStart, fetchReposSuccess, fetchReposFailure, resetRepos, setFilter } = reposSlice.actions;
export default reposSlice.reducer;
