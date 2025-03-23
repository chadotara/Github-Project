// src/components/RepoCardWithChart.jsx

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Avatar,
  Grid,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepoDetailsStart, resetRepoDetails, setChartFilter } from '../store/slices/repoDetailsSlice';

// Disable Highcharts credits for a cleaner look.
Highcharts.setOptions({ credits: { enabled: false } });

const RepoCardWithChart = ({ repo }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const { codeFrequency, commitActivity, contributors, chartFilter, loading, error } = useSelector(
    (state) => state.repoDetails
  );

  // Format pushed_at date for display.
  const formattedPushedAt = useMemo(() => {
    if (!repo.pushed_at) return '';
    const date = new Date(repo.pushed_at);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [repo.pushed_at]);

  const handleToggle = () => {
    if (!expanded) {
      // When expanding, fetch repository stats.
      dispatch(fetchRepoDetailsStart({ owner: repo.owner.login, repo: repo.name }));
    } else {
      dispatch(resetRepoDetails());
    }
    setExpanded(!expanded);
  };

  const handleFilterChange = (e) => {
    dispatch(setChartFilter(e.target.value));
  };

  // Compute the total series for the top chart.
  const totalSeries = useMemo(() => {
    if (chartFilter === 'commit') {
      return Array.isArray(commitActivity)
        ? commitActivity.map((week) => [week.week * 1000, week.total])
        : [];
    } else {
      const cfArray = Array.isArray(codeFrequency) ? codeFrequency : [];
      return cfArray.map(([timestamp, additions, deletions]) => {
        const value = chartFilter === 'additions' ? additions : Math.abs(deletions);
        return [timestamp * 1000, value];
      });
    }
  }, [codeFrequency, commitActivity, chartFilter]);

  // Compute per-contributor series for the bottom chart.
  const contributorsSeries = useMemo(() => {
    return Array.isArray(contributors)
      ? contributors.map((contributor) => {
          const data = Array.isArray(contributor.weeks)
            ? contributor.weeks.map((week) => {
                let value;
                if (chartFilter === 'commit') value = week.c;
                else if (chartFilter === 'additions') value = week.a;
                else value = Math.abs(week.d);
                return [week.w * 1000, value];
              })
            : [];
          return { name: contributor.author.login, data };
        })
      : [];
  }, [contributors, chartFilter]);

  // Common Highcharts options.
  const commonOptions = useMemo(() => ({
    accessibility: { enabled: false },
    xAxis: {
      type: 'datetime',
      title: { text: 'Week Start Date' },
      labels: {
        formatter: function () {
          return Highcharts.dateFormat('%b %e, %Y', this.value);
        }
      }
    },
    yAxis: { title: { text: 'Count' } },
    tooltip: {
      xDateFormat: '%Y-%m-%d',
      shared: true,
      // Custom formatter for additional info if needed.
      formatter: function () {
        return `<b>${Highcharts.dateFormat('%b %e, %Y', this.x)}</b><br/>` +
               this.points.map(pt => `${pt.series.name}: <b>${pt.y}</b>`).join('<br/>');
      }
    },
    responsive: {
      rules: [{
        condition: { maxWidth: 500 },
        chartOptions: { legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' } }
      }]
    }
  }), []);

  const topChartOptions = useMemo(() => ({
    ...commonOptions,
    title: { text: chartFilter === 'commit' ? 'Total Weekly Commits' : 'Total Weekly Changes' },
    series: [{
      name: chartFilter === 'commit'
        ? 'Commits'
        : (chartFilter === 'additions' ? 'Additions' : 'Deletions'),
      data: totalSeries,
      type: 'line',
      tooltip: {
        valueSuffix: chartFilter === 'commit' ? ' commits' : (chartFilter === 'additions' ? ' additions' : ' deletions')
      }
    }]
  }), [commonOptions, totalSeries, chartFilter]);

  const bottomChartOptions = useMemo(() => ({
    ...commonOptions,
    title: { text: 'Per-Contributor Activity' },
    legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    series: contributorsSeries.map((series) => ({ ...series, type: 'line' })),
    tooltip: {
      xDateFormat: '%Y-%m-%d',
      shared: true,
      formatter: function () {
        // Find the contributor name from the series point.
        const pointInfo = this.points.map(pt => `${pt.series.name}: <b>${pt.y}</b>`).join('<br/>');
        return `<b>${Highcharts.dateFormat('%b %e, %Y', this.x)}</b><br/>${pointInfo}`;
      }
    }
  }), [commonOptions, contributorsSeries]);

  return (
    <Card sx={{ margin: '10px 0' }}>
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
              ⭐ {repo.stargazers_count} | 🐛 {repo.open_issues_count} | Last Pushed: {formattedPushedAt} by {repo.owner.login}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <IconButton
          onClick={handleToggle}
          aria-label="expand chart"
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: '0.3s'
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2 }}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
              <InputLabel id="chart-filter-label">Show</InputLabel>
              <Select
                labelId="chart-filter-label"
                value={chartFilter}
                onChange={handleFilterChange}
                label="Show"
              >
                <MenuItem value="commit">Commits</MenuItem>
                <MenuItem value="additions">Additions</MenuItem>
                <MenuItem value="deletions">Deletions</MenuItem>
              </Select>
            </FormControl>
          </Paper>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <>
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <HighchartsReact highcharts={Highcharts} options={topChartOptions} />
              </Paper>
              <Paper elevation={3} sx={{ p: 2 }}>
                {contributorsSeries.length > 0 ? (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Per-Contributor Activity
                    </Typography>
                    <HighchartsReact highcharts={Highcharts} options={bottomChartOptions} />
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No contributor data available.
                  </Typography>
                )}
              </Paper>
            </>
          )}
        </Box>
      </Collapse>
    </Card>
  );
};

export default RepoCardWithChart;
