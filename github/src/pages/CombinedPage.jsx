// src/pages/CombinedPage.jsx
import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import RepoList from '../components/RepoList';
import DrillDownCharts from '../components/DrillDownCharts';
import { fetchRepoDetailsStart, resetRepoDetails } from '../store/slices/repoDetailsSlice';

const CombinedPage = () => {
  const dispatch = useDispatch();
  const [selectedRepo, setSelectedRepo] = useState(null);

  // When a repository is selected, fetch its details.
  useEffect(() => {
    if (selectedRepo) {
      dispatch(fetchRepoDetailsStart({ owner: selectedRepo.owner.login, repo: selectedRepo.name }));
    } else {
      dispatch(resetRepoDetails());
    }
  }, [selectedRepo, dispatch]);

  // Callback passed to RepoList to update the selected repository.
  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Repositories
          </Typography>
          <RepoList onSelect={handleRepoSelect} selectedRepo={selectedRepo} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: '100%' }}>
          {selectedRepo ? (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedRepo.name} - Activity
              </Typography>
              <DrillDownCharts />
            </>
          ) : (
            <Typography variant="body1">
              Select a repository from the list to view its commit/activity details.
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CombinedPage;
