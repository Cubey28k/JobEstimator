import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MaterialModal = ({ open, onClose, onSave }) => {
  const [materials, setMaterials] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (open) {
      fetchMaterials();
    }
  }, [open]);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/materials`);
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleSave = async () => {
    try {
      const newMaterial = { name, price: parseFloat(price) };
      const response = await axios.post(`${API_BASE_URL}/materials`, newMaterial);
      const savedMaterial = response.data;
      
      // Update local state
      setMaterials((prevMaterials) => [...prevMaterials, savedMaterial]);
      
      // Notify parent component
      if (onSave) {
        onSave(savedMaterial);
      }
      
      // Clear form
      setName('');
      setPrice('');
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  const handleUpdate = async (materialId, updatedMaterial) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/materials/${materialId}`, updatedMaterial);
      setMaterials((prevMaterials) => 
        prevMaterials.map((material) => (material.id === materialId ? response.data : material))
      );
    } catch (error) {
      console.error('Error updating material:', error);
    }
  };

  const handleDelete = async (materialId) => {
    try {
      await axios.delete(`${API_BASE_URL}/materials/${materialId}`);
      setMaterials((prevMaterials) => prevMaterials.filter((material) => material.id !== materialId));
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Materials</DialogTitle>
      <DialogContent>
        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
          <TextField
            label="Material Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            type="number"
            margin="normal"
          />
          <Button 
            onClick={handleSave} 
            color="primary" 
            variant="contained"
            fullWidth
            style={{ marginTop: '16px' }}
            disabled={!name || !price}
          >
            Add Material
          </Button>
        </div>
        <List>
          {materials.map((material) => (
            <ListItem 
              key={material.id}
              secondaryAction={
                <IconButton onClick={() => handleDelete(material.id)}>
                  <Delete />
                </IconButton>
              }
            >
              {material.name} - ${material.price}
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialModal;