import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import EstimateFormLoggedIn from '../components/loggedin/EstimateFormLI';
import EstimateOutputLoggedIn from '../components/loggedin/EstimateOutputLI';
import EstimateFormLoggedOut from '../components/loggedout/EstimateFormLO';
import EstimateOutputLoggedOut from '../components/loggedout/EstimateOutputLO';
import { AuthContext } from '../context/AuthContext';

const EstimatePage = ({ estimate, setEstimate }) => {
  const { user } = useContext(AuthContext);
  const isLoggedIn = Boolean(user);

  return (
    <Box>
      {isLoggedIn ? (
        <>
          <EstimateFormLoggedIn setEstimate={setEstimate} />
          {estimate && <EstimateOutputLoggedIn estimate={estimate} />}
        </>
      ) : (
        <>
          <EstimateFormLoggedOut setEstimate={setEstimate} />
          {estimate && <EstimateOutputLoggedOut estimate={estimate} />}
        </>
      )}
    </Box>
  );
};

export default EstimatePage;
