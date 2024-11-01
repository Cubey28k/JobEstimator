// About.jsx
import React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Paper, Link } from '@mui/material';

const About = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" color= "primary" gutterBottom>About this Job Estimator Tool</Typography>
      <Typography variant="body1">
        Independent contractors spend hours having to put together estimates each time they court business.
        The outcome of these estimates is a matter of juggling personalities, budgets, and timelines, among
        so many other factors.
      </Typography>
      <Typography mt={2}>
        I've created this estimator tool in order to help people close to me, like my father, my cousins,
        and friends. The purpose of this tool is to have a quick method to save materials in an online platform 
        and use the output in order to add to an estimate document of their own making.
      </Typography>
      <Typography mt={2}>
        In the future, I plan on adding real-time pricing data based on location, however, here is a quick list
        of features you may use, and I have added resources that help streamline an estimate.
      </Typography>
      <Typography variant="h5" mt={2} color="primary" gutterBottom>Features:</Typography>
      
      {/* Add Paper element with padding */}
      <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
        <List>
          {[
            '📐 Create basic job estimates', 
            '🛠️ Create, update, and delete custom materials', 
            '🔒 Save materials in your own secure login for later',
            '💰 Generate totals with automatic tax calculation'
        ].map((feature, index) => (
            <ListItem 
              key={index} 
              sx={{
                // backgroundColor: index % 2 === 0 ? 'grey.100' : 'white',
                borderRadius: 1
              }}
            >
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Typography variant="h5" mt={2} color="primary" gutterBottom>NB:</Typography>
      <Typography mt={2}>
        This project is a work in progress with templates inspired by my father's
        own winning painting estimates, as well as other templates pulled from various sources.
        I take no responsibility for the outcome, positive or negative, involved in the use of
        this tool, and intentionally have created it to be parcel to, and not the whole of
        anyone's estimate.
      </Typography>
      <Typography variant="h5" mt={2} color="primary" gutterBottom>Who made this?</Typography>
      <Typography mt={2}>
        My name is Ben Olmstead, please feel free to email me at{' '}
        <Link href="mailto:Olmsteab2856@gmail.com" color="inherit">
          Olmsteab2856@gmail.com
        </Link>{' '}
        if you would like to offer feedback or suggestions. You can find my GitHub at{' '}
        <Link href="https://github.com/Cubey28k" target="_blank" rel="noopener noreferrer" color="inherit">
          github.com/Cubey28k
        </Link>.
      </Typography>
    </Box>
  );
};

export default About;
