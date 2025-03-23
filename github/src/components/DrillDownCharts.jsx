// src/components/DrillDownCharts.jsx
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChartFilter } from '../store/slices/repoDetailsSlice';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, Paper, CircularProgress } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Disable Highcharts credits for a cleaner look.
Highcharts.setOptions({
  credits: { enabled: false }
});

const DrillDownCharts = () => {
  const dispatch = useDispatch();
  const { codeFrequency, commitActivity, contributors, chartFilter, loading, error } = useSelector(
    (state) => state.repoDetails
  );

  // useMemo to efficiently compute total series based on selected filter.
  const totalSeries = useMemo(() => {
    if (chartFilter === 'commit') {
      // commitActivity: Array of objects with week and total commits.
      return Array.isArray(commitActivity)
        ? commitActivity.map((week) => [week.week * 1000, week.total])
        : [];
    } else {
      // codeFrequency: each element is [timestamp, additions, deletions]
      const cfArray = Array.isArray(codeFrequency) ? codeFrequency : [];
      return cfArray.map(([timestamp, additions, deletions]) => {
        const value = chartFilter === 'additions' ? additions : Math.abs(deletions);
        return [timestamp * 1000, value];
      });
    }
  }, [codeFrequency, commitActivity, chartFilter]);

  // useMemo to compute per-contributor series.
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

  const handleFilterChange = (e) => {
    dispatch(setChartFilter(e.target.value));
  };

  // Common options shared by both charts.
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
    tooltip: { xDateFormat: '%Y-%m-%d', shared: true },
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
        valueSuffix: chartFilter === 'commit'
          ? ' commits'
          : (chartFilter === 'additions' ? ' additions' : ' deletions')
      }
    }]
  }), [commonOptions, totalSeries, chartFilter]);

  const bottomChartOptions = useMemo(() => ({
    ...commonOptions,
    title: { text: 'Per-Contributor Activity' },
    legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    series: contributorsSeries.map(series => ({ ...series, type: 'line' }))
  }), [commonOptions, contributorsSeries]);

  if (loading) return <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Commit / Changes Activity (Weekly)
        </Typography>
        <FormControl variant="outlined" sx={{ minWidth: 200, mb: 2 }}>
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
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <HighchartsReact highcharts={Highcharts} options={topChartOptions} />
      </Paper>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Per-Contributor Activity
        </Typography>
        <HighchartsReact highcharts={Highcharts} options={bottomChartOptions} />
      </Paper>
    </Box>
  );
};

export default DrillDownCharts;
