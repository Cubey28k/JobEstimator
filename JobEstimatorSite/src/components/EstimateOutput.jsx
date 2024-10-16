import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const EstimateOutput = ({ estimate }) => {
  if (!estimate) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Job Estimate
      </Typography>
      <Box component={Paper} className="job-info" sx={{ mb: 4 }}>
        <Typography variant="h6">Job Information</Typography>
        <Typography><strong>Job Name:</strong> {estimate.jobName}</Typography>
        <Typography><strong>Client Name:</strong> {estimate.clientName}</Typography>
        <Typography><strong>Address:</strong> {estimate.address}</Typography>
        <Typography><strong>Date:</strong> {estimate.date}</Typography>
        <Typography><strong>Estimate Number:</strong> {estimate.estimateNumber}</Typography>
      </Box>
      <TableContainer component={Paper} className="estimate-details">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estimate.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${typeof item.unitPrice === 'number' ? item.unitPrice.toFixed(2) : 'N/A'}</TableCell>
                <TableCell>${typeof item.unitPrice === 'number' && typeof item.quantity === 'number' ? (item.quantity * item.unitPrice).toFixed(2) : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="summary" sx={{ mt: 4 }}>
        <Typography variant="h6">Summary</Typography>
        <Typography><strong>Subtotal:</strong> ${estimate.subtotal.toFixed(2)}</Typography>
        <Typography><strong>Tax (10%):</strong> ${estimate.tax.toFixed(2)}</Typography>
        <Typography className="total"><strong>Total:</strong> ${estimate.total.toFixed(2)}</Typography>
      </Box>
    </Box>
  );
};

export default EstimateOutput;
