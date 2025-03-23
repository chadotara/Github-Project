import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material';
import { fetchRepoDetailsStart, resetRepoDetails } from '../store/slices/repoDetailsSlice';
import DrillDownCharts from '../components/DrillDownCharts';

const DetailsPage = () => {
  const { owner, repo } = useParams();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.repoDetails);

  useEffect(() => {
    dispatch(fetchRepoDetailsStart({ owner, repo }));
    return () => dispatch(resetRepoDetails());
  }, [dispatch, owner, repo]);

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Button component={Link} to="/" variant="contained" style={{ marginBottom: '1rem' }}>
        Back to Repos
      </Button>
      <Typography variant="h5" gutterBottom>
        {owner}/{repo} - Commit Activity
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">Error: {error}</Typography>
      ) : (
        <DrillDownCharts />
      )}
    </Container>
  );
};

export default DetailsPage;
