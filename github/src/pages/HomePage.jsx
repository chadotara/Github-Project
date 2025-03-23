// src/pages/HomePage.jsx
import React from 'react';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetRepos, fetchReposStart } from '../store/slices/reposSlice';
import RepoList from '../components/RepoList';

const HomePage = () => {
  const dispatch = useDispatch();
  const { filter } = useSelector((state) => state.repos);

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    dispatch(setFilter(newFilter));
    dispatch(resetRepos());
    dispatch(fetchReposStart());
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h2" align="center" gutterBottom>
        GitHub Repositories Dashboard
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" sx={{ mb: 4 }}>
        Explore the most starred GitHub repositories by time period
      </Typography>
      <FormControl variant="outlined" sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel id="filter-label">Time Period</InputLabel>
        <Select
          labelId="filter-label"
          value={filter}
          onChange={handleFilterChange}
          label="Time Period"
        >
          <MenuItem value="1week">Last 1 Week</MenuItem>
          <MenuItem value="2weeks">Last 2 Weeks</MenuItem>
          <MenuItem value="1month">Last 1 Month</MenuItem>
        </Select>
      </FormControl>
      <RepoList />
    </Container>
  );
};

export default HomePage;
