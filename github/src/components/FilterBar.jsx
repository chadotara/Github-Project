import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import { resetRepos, fetchReposStart } from '../store/slices/reposSlice';

const FilterBar = () => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    // For now, simply reset and re-fetch. In a dynamic setup, use the value.
    dispatch(resetRepos());
    dispatch(fetchReposStart());
  };

  return (
    <FormControl fullWidth variant="outlined" style={{ marginBottom: '1rem' }}>
      <InputLabel id="filter-label">Time Period</InputLabel>
      <Select
        labelId="filter-label"
        value="1month" // fixed value for now
        label="Time Period"
        onChange={handleChange}
      >
        <MenuItem value="1week">Last 1 Week</MenuItem>
        <MenuItem value="2weeks">Last 2 Weeks</MenuItem>
        <MenuItem value="1month">Last 1 Month</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FilterBar;
