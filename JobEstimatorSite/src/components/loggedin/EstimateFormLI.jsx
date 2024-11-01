import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Typography, Box, Grid, List, ListItem, ListItemText, Paper } from '@mui/material';
import MaterialModal from '../MaterialModal';
import TaxRate from '../TaxRate';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EstimateFormLI = ({ setEstimate }) => {
    const { user } = useContext(AuthContext);
    const [materials, setMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [taxRate, setTaxRate] = useState(0);
    const [additionalText, setAdditionalText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    useEffect(() => {
        fetchMaterials();
    }, []);

    useEffect(() => {
        setJobDetails(prevDetails => ({
            ...prevDetails,
            taxRate
        }));
    }, [taxRate]);

    const fetchMaterials = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/materials`);
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalSave = async (newMaterial) => {
        // Update the materials list with the new material
        setMaterials(prevMaterials => [...prevMaterials, newMaterial]);
        
        // Update any selected items that might use this material
        setJobDetails(prevDetails => ({
            ...prevDetails,
            items: prevDetails.items.map(item => {
                if (item.description === newMaterial.name) {
                    return { ...item, unitPrice: newMaterial.price };
                }
                return item;
            })
        }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const items = [...jobDetails.items];

        if (name === 'description') {
            const selectedMaterial = materials.find((material) => material.name === value);
            if (selectedMaterial) {
                items[index] = {
                    ...items[index],
                    description: value,
                    unitPrice: selectedMaterial.price
                };
            } else {
                items[index] = {
                    ...items[index],
                    description: value,
                    unitPrice: 0
                };
            }
        } else if (name === 'quantity') {
            items[index] = {
                ...items[index],
                [name]: parseFloat(value) || 0
            };
        }

        setJobDetails(prevDetails => ({
            ...prevDetails,
            items
        }));
    };

    const addItem = () => {
        setJobDetails(prevDetails => ({
            ...prevDetails,
            items: [...prevDetails.items, { description: '', quantity: 0, unitPrice: 0 }]
        }));
    };

    const removeItem = (index) => {
        setJobDetails(prevDetails => ({
            ...prevDetails,
            items: prevDetails.items.filter((_, i) => i !== index)
        }));
    };

    const calculateTotals = () => {
        const subtotal = jobDetails.items.reduce((sum, item) => {
            return sum + (item.quantity * item.unitPrice);
        }, 0);

        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        return { subtotal, tax, total };
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

        // Validation for correct PDF filenames
        if (!/^[a-zA-Z0-9-_]+$/.test(jobDetails.fileName)) {
            alert('File name can only contain letters, numbers, hyphens, and underscores');
            return;
        }

        const { subtotal, tax, total } = calculateTotals();

        const estimateData = {
            ...jobDetails,
            subtotal,
            tax,
            total,
            taxRate,
            additionalText,
            createdAt: new Date().toISOString(),
        };

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
                        '🪃 Create and re-use materials when logged in',
                        'You may need to try a few times to get it how you like, note that mobile PDFs may have issues at the moment - Use a desktop for the best experience'
                    ].map((feature, index) => (
                        <ListItem key={index} sx={{ borderRadius: 1 }}>
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
                Materials and Costs
            </Typography>

            {jobDetails.items.map((item, index) => (
                <Grid container spacing={2} key={index} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required
                            fullWidth
                            select
                            name="description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, e)}
                            SelectProps={{ native: true }}
                            label="Select Material"
                        >
                            <option value="">Select Material</option>
                            {materials.map((material) => (
                                <option key={material.id} value={material.name}>
                                    {material.name}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required
                            fullWidth
                            name="quantity"
                            type="number"
                            label="Quantity"
                            value={item.quantity || ''}
                            onChange={(e) => handleItemChange(index, e)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            required
                            fullWidth
                            name="unitPrice"
                            type="number"
                            label="Unit Price"
                            value={item.unitPrice}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button 
                            variant="outlined" 
                            color="error" 
                            onClick={() => removeItem(index)}
                            disabled={jobDetails.items.length === 1}
                        >
                            Remove
                        </Button>
                    </Grid>
                </Grid>
            ))}

            <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={addItem} sx={{ mr: 2 }}>
                    Add Another Item
                </Button>
                <Button variant="contained" onClick={() => setIsModalOpen(true)}>
                    Add Material
                </Button>
            </Box>

            {/* Additional Text Section */}
            <Typography variant="h5" component="h2" color="primary" gutterBottom sx={{ mt: 4 }}>
                Custom Write-Up (Recommended)
            </Typography>
            <Typography mb={2} color="text.secondary">
                This will be added at the end of the summary. The summary by itself is extremely matter of fact.
                Add your personality here, describe the property, note anything that will make this job different
                or more challenging.
            </Typography>
            <TextField
                fullWidth
                multiline
                rows={4}
                value={additionalText}
                onChange={(e) => setAdditionalText(e.target.value)}
                placeholder="Make it shine! Start typing!"
            />

            <Box sx={{ mt: 4 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    size="large"
                >
                    Create Estimate
                </Button>
            </Box>

            <MaterialModal 
                open={isModalOpen} 
                onClose={handleModalClose} 
                onSave={handleModalSave}
            />
        </Box>
    );
};


export default EstimateFormLI;
