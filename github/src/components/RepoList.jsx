import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReposStart } from '../store/slices/reposSlice';
import RepoCardWithChart from './RepoCardWithChart';
import { Box, CircularProgress } from '@mui/material';

const RepoList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.repos);
  const observer = useRef();

  const lastRepoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchReposStart());
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, dispatch]
  );

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchReposStart());
    }
  }, [dispatch, items.length]);

  if (error) return <div>Error: {error}</div>;

  return (
    <Box>
      {items.map((repo, index) => {
        if (index === items.length - 1) {
          return (
            <div ref={lastRepoRef} key={repo.id}>
              <RepoCardWithChart repo={repo} />
            </div>
          );
        } else {
          return <RepoCardWithChart key={repo.id} repo={repo} />;
        }
      })}
      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default RepoList;
