import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import theme from './components/Theme';
import EstimateForm from './components/EstimateForm';
import EstimateOutput from './components/EstimateOutput';

function App() {
  const [estimate, setEstimate] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <EstimateForm setEstimate={setEstimate} />
        {estimate && <EstimateOutput estimate={estimate} />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
