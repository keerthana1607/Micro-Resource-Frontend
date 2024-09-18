import React from 'react';
import { Grid, Paper } from '@mui/material';

import ProjectDashboard from './ProjectDashboard'; // Import AdminLayout component
import PieChart from '../Admin/PieChart';
import Barchart from '../Admin/Barchart';

const ProjectmanagerHome = () => {
  return (
    <ProjectDashboard>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <PieChart width={500} height={500} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Barchart width={500} height={500} />
          </Paper>
        </Grid>
      </Grid>
    </ProjectDashboard>
  );
};

export default ProjectmanagerHome;
