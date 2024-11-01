import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { TextField, Button, Typography, Box, Grid, List, ListItem, ListItemText, Paper } from '@mui/material';
import TaxRate from '../TaxRate';
import MockMaterials from '../MockMaterials';

const EstimateFormLO = ({ setEstimate }) => {
  const materials = MockMaterials;
  const [taxRate, setTaxRate] = useState(0);
  const [additionalText, setAdditionalText] = useState(''); // New state for user input
  const [jobDetails, setJobDetails] = useState({
    jobName: '',
    clientName: '',
    address: '',
    proposedStartDate: '',
    projectedJobEnd: '',
    proposalDate: '',
    fileName: '',
    items: [{ description: '', quantity: 0, unitPrice: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    taxRate: 0
  });

  // useEffect(() => {
  //   const fetchMaterials = async () => {
  //     try {
  //       const response = await axios.get('https://job-estimator-be-production.up.railway.app/api/materials');
  //       console.log('Materials API response:', response.data);
  //       if (Array.isArray(response.data)) {
  //         setMaterials(response.data);
  //       } else {
  //         console.error('Materials API returned a non-array:', response.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching materials:', error);
  //     }
  //   };

  //   fetchMaterials();
  // }, []);

  // Update job details when tax rate changes
  useEffect(() => {
    setJobDetails(prevDetails => ({
      ...prevDetails,
      taxRate
    }));
  }, [taxRate]);

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
        items[index].unitPrice = selectedMaterial.price;
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
        !jobDetails.proposalDate || !jobDetails.fileName) {
      alert('Please fill in all required fields');
      return;
    }

    // Validation for tax rate
    if (taxRate === 0) {
      alert('Please select a state for tax calculation');
      return;
    }

    // Validation for items
    for (let item of jobDetails.items) {
      if (!item.description || !item.quantity || !item.unitPrice) {
        alert('Please fill in all required fields in the items');
        return;
      }
    }

    //Validation for correct PDF filenames
    if (!/^[a-zA-Z0-9-_]+$/.test(jobDetails.fileName)) {
      alert('File name can only contain letters, numbers, hyphens, and underscores');
      return;
  }

    const subtotal = jobDetails.items.reduce((sum, item) => {
      return sum + (Number(item.quantity) * Number(item.unitPrice));
    }, 0);

    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const estimateData = {
      ...jobDetails,
      subtotal,
      tax,
      total,
      taxRate,
      additionalText, // Include additional text in the estimate data
      createdAt: new Date().toISOString(),
    };

    console.log('Estimate Data:', estimateData);
    setEstimate(estimateData);
    alert('Estimate created successfully!');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 10, pb: 4 }}>
      <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
        <List>
          {[
            'HOW TO USE!', 
            '🛠️ JOB NAME: Be specific and succinct, think "Inner Staircase"', 
            '💰 Use the tax drop-down relevant to your location (Last Update: Oct 2024)',
            '✅ Save the PDF (per job) and use it to email in correspondence, or to print out',
            '🔑 Login in order to save your own materials, these are just mock materials',
            'You may need to try a few times to get it how you like, but enjoy!'
          ].map((feature, index) => (
            <ListItem 
              key={index} 
              sx={{
                borderRadius: 1
              }}
            >
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Typography variant="h5" mt={5} color="primary" component="h1" gutterBottom>
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
          <TaxRate taxRate={taxRate} setTaxRate={setTaxRate} />
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
            name="fileName"
            label="File Name"
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" color="primary" gutterBottom sx={{ mt: 4 }}>
        Custom Write-Up (Recommended)
      </Typography>
      <Typography mb={2} color="secondary">
        This will be added at the end of the summary. The summary by itself is extremely matter of fact.
        Add your personality here, describe the property, note anything that will make this job different
        or more challenging.
        </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        value={additionalText}
        onChange={(e) => setAdditionalText(e.target.value)} // Handle change for additional text
        placeholder="Make it shine! Start typing!"
      />

      <Typography variant="h5" component="h2" color="primary" gutterBottom sx={{ mt: 4 }}>
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
              value={item.unitPrice}
              onChange={(e) => handleItemChange(index, e)}
              disabled // Unit price is fetched based on the selected material
            />
          </Grid>
        </Grid>
      ))}
      <Button variant="contained" onClick={addItem} sx={{ mt: 2 }}>
        Add Another Item
      </Button>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color= "secondary" type ="submit">
          Create Estimate
        </Button>
      </Box>
    </Box>
  );
};

export default EstimateFormLO;

/** THOUGHTS / ISSUES:
 - The submit logic 
 - Mocking the JSON payload so i can put the site live
 - add all the other fields you want from your diagram (draw.io)
 */
