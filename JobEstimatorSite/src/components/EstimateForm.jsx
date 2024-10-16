import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Grid } from '@mui/material';

const EstimateForm = ({ setEstimate }) => {
  const [materials, setMaterials] = useState([]);
  const [jobDetails, setJobDetails] = useState({
    jobName: '',
    clientName: '',
    address: '',
    proposedStartDate: '',
    projectedJobEnd: '',
    proposalDate: '',
    estimateNumber: '',
    items: [{ description: '', quantity: 0, unitPrice: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get('https://job-estimator-be-production.up.railway.app/api/materials');
        console.log('Materials API response:', response.data);
        if (Array.isArray(response.data)) {
          setMaterials(response.data);
        } else {
          console.error('Materials API returned a non-array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchMaterials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...jobDetails.items];

    if (name === 'description') {
      const selectedMaterial = materials.find((material) => material.name === value);
      if (selectedMaterial) {
        items[index].unitPrice = selectedMaterial.price; // Update with material price
      }
    }

    items[index][name] = value;
    setJobDetails({ ...jobDetails, items });
  };

  const addItem = () => {
    setJobDetails({
      ...jobDetails,
      items: [...jobDetails.items, { description: '', quantity: 0, unitPrice: 0 }]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for job details
    if (!jobDetails.jobName || !jobDetails.clientName || !jobDetails.address ||
        !jobDetails.proposedStartDate || !jobDetails.projectedJobEnd ||
        !jobDetails.proposalDate || !jobDetails.estimateNumber) {
      alert('Please fill in all required fields');
      return;
    }

    // Validation for items
    for (let item of jobDetails.items) {
      if (!item.description || !item.quantity || !item.unitPrice) {
        alert('Please fill in all required fields in the items');
        return;
      }
    }

    const subtotal = jobDetails.items.reduce((sum, item) => {
      return sum + (Number(item.quantity) * Number(item.unitPrice));
    }, 0);

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const estimateData = {
      ...jobDetails,
      subtotal,
      tax,
      total,
      createdAt: new Date().toISOString(),
    };

    console.log('Estimate Data:', estimateData);
    setEstimate(estimateData);
    alert('Estimate created successfully!');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 10 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Job Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="jobName"
            label="Job Name"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="clientName"
            label="Client Name"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="address"
            label="Address"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="proposedStartDate"
            label="Proposed Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="projectedJobEnd"
            label="Projected Job End"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="proposalDate"
            label="Proposal Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="estimateNumber"
            label="Estimate Number"
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Materials and Costs
      </Typography>

      {jobDetails.items.map((item, index) => (
        <Grid container spacing={2} key={index}>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              select
              name="description"
              label="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, e)}
              SelectProps={{ native: true }}
            >
              <option value="">Select Material</option>
              {materials.map((material, i) => (
                <option key={i} value={material.name}>
                  {material.name}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              name="quantity"
              type="number"
              label="Quantity"
              onChange={(e) => handleItemChange(index, e)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              name="unitPrice"
              type="number"
              label="Unit Price"
              value={item.unitPrice} // Set value from item
              onChange={(e) => handleItemChange(index, e)}
            />
          </Grid>
        </Grid>
      ))}

      <Button variant="contained" onClick={addItem} sx={{ mt: 2 }}>
        Add Item
      </Button>
      <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }}>
        Get Estimate
      </Button>
    </Box>
  );
};

export default EstimateForm;



/** THOUGHTS / ISSUES:
 - The submit logic 
 - best way to add an upload of a logo
 - How to add a download of a PDF
 - Mocking the JSON payload so i can put the site live
 - add all the other fields you want from your diagram (draw.io)
 */
