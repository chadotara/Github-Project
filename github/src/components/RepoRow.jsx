// src/components/RepoRow.jsx
import React from 'react';
import { Card, CardContent, Typography, Avatar, Grid } from '@mui/material';

const RepoRow = ({ repo, onSelect, selected }) => {
  const handleClick = () => {
    if (onSelect) onSelect(repo);
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ margin: '10px 0', cursor: 'pointer', border: selected ? '2px solid blue' : 'none' }} 
      onClick={handleClick}
    >
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar alt={repo.owner.login} src={repo.owner.avatar_url} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6">{repo.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {repo.description}
            </Typography>
            <Typography variant="caption">
              ⭐ {repo.stargazers_count} | 🐛 {repo.open_issues_count}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default RepoRow;
