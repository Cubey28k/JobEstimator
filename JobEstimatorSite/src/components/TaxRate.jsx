import React, { useState } from 'react';
import { TextField } from '@mui/material';

const TaxRate = ({ taxRate, setTaxRate }) => {
  const [selectedState, setSelectedState] = useState('');
  
  const taxRates = {
    AL: 0.04,
    AK: 0.00,
    AZ: 0.056,
    AR: 0.065,
    CA: 0.0725,
    CO: 0.029,
    CT: 0.0635,
    DE: 0.00,
    FL: 0.06,
    GA: 0.04,
    HI: 0.04,
    ID: 0.06,
    IL: 0.0625,
    IN: 0.07,
    IA: 0.06,
    KS: 0.065,
    KY: 0.06,
    LA: 0.04,
    ME: 0.055,
    MD: 0.06,
    MA: 0.0625,
    MI: 0.06,
    MN: 0.06875,
    MS: 0.07,
    MO: 0.04225,
    MT: 0.00,
    NE: 0.055,
    NV: 0.0685,
    NH: 0.00,
    NJ: 0.06625,
    NM: 0.05125,
    NY: 0.04,
    NC: 0.04,
    ND: 0.05,
    OH: 0.0575,
    OK: 0.045,
    OR: 0.00,
    PA: 0.06,
    RI: 0.07,
    SC: 0.06,
    SD: 0.04,
    TN: 0.07,
    TX: 0.0625,
    UT: 0.047,
    VT: 0.06,
    VA: 0.053,
    WA: 0.065,
    WV: 0.06,
    WI: 0.05,
    WY: 0.04,
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setTaxRate(taxRates[state]);
  };

  return (
    <TextField
      select
      label="Select State"
      value={selectedState}
      onChange={handleStateChange}
      fullWidth
      required
      SelectProps={{ native: true }}
    >
      <option value="">Select State</option>
      {Object.keys(taxRates).map((state) => (
        <option key={state} value={state}>
          {state} ({(taxRates[state] * 100).toFixed(1)}%)
        </option>
      ))}
    </TextField>
  );
};

export default TaxRate;