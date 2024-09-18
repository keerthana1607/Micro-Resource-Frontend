

import React from 'react';
import { Grid, Paper } from '@mui/material';
import PieChart from './PieChart'; // Import PieChart component
import Barchart from './Barchart'; // Import Barchart component
import AdminLayout from './Ad'; // Import AdminLayout component

const AdminHome = () => {
  return (
    <AdminLayout>
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
    </AdminLayout>
  );
};

export default AdminHome;
