import React from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const EstimateOutputLO = ({ estimate }) => {
  if (!estimate) return null;

  const generatePDF = () => {
    const input = document.getElementById('pdf-content');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save(`${estimate.fileName}.pdf`);
    });
  };

  return (
    <Box sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Job Estimate
      </Typography>
      <Button variant="contained" color="secondary" onClick={generatePDF}>
        Download as PDF
      </Button>
      <Box id="pdf-content" sx={{ mt: 2 }}>
        <Box component={Paper} sx={{ mb: 4, p: 2 }}>
          <Typography mb={4} variant="h4">{estimate.jobName} at {estimate.address}</Typography>
          <Typography><strong>Client Name:</strong> {estimate.clientName}</Typography>
          <Typography><strong>Address:</strong> {estimate.address}</Typography>
          <Typography><strong>Date:</strong> {estimate.proposalDate}</Typography>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 4 }}>
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
                  <TableCell>${Number(item.unitPrice).toFixed(2)}</TableCell>
                  <TableCell>${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {/* Total breakdown rows */}
              <TableRow>
                <TableCell colSpan={3} align="right"><strong>Subtotal:</strong></TableCell>
                <TableCell>${estimate.subtotal.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} align="right"><strong>Tax Amount:</strong></TableCell>
                <TableCell>${estimate.tax.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} align="right" sx={{ borderBottom: 'none' }}><strong>Total:</strong></TableCell>
                <TableCell sx={{ borderBottom: 'none' }}><strong>${estimate.total.toFixed(2)}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box component={Paper} sx={{ p: 2 }}>
          <Typography variant="h6">Summary</Typography>
          <Typography>
            {`The property located at ${estimate.address} will require an estimated total spend of 
            $${estimate.total.toFixed(2)} for ${estimate.jobName}. 
            This includes a ${(estimate.taxRate * 100).toFixed(2)}% tax rate for a taxable 
            amount of $${estimate.tax.toFixed(2)}. 
            The proposal was created for ${estimate.clientName} 
            on ${new Date(estimate.createdAt).toLocaleDateString()}.`}
          </Typography>
          {estimate.additionalText && (
            <Typography sx={{ mt: 2 }}>
              {estimate.additionalText}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EstimateOutputLO;
