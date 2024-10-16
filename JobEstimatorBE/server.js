const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Optional logging middleware
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: '*', // Allows any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all common HTTP methods
    optionsSuccessStatus: 200
  };

// Middleware
app.use(cors(corsOptions)); // Enable CORS
app.use(morgan('combined')); // Log incoming requests (optional)
app.use(express.json()); // Enable JSON parsing for request bodies (if needed)

// Hardcoded material prices
const materials = [
  { name: "2x4 Lumber", price: 3.47 },
  { name: "Concrete (per cubic yard)", price: 120.00 },
  { name: "Brick (per 1000)", price: 500.00 },
  { name: "Plywood (4x8 sheet)", price: 40.00 },
  { name: "Rebar (per foot)", price: 0.75 },
  { name: "Drywall (4x8 sheet)", price: 12.50 },
  { name: "Insulation (per roll)", price: 15.00 },
  { name: "Roofing Shingles (bundle)", price: 35.00 },
  { name: "Cement Block", price: 1.50 },
  { name: "Steel Studs (10ft)", price: 9.00 },
  { name: "PVC Pipe (10ft)", price: 7.25 },
  { name: "Copper Pipe (10ft)", price: 22.00 },
  { name: "Electrical Wire (per 100ft)", price: 30.00 },
  { name: "Door (interior)", price: 125.00 },
  { name: "Window (single pane)", price: 150.00 },
  { name: "Hardwood Flooring (sq. ft.)", price: 5.50 },
  { name: "Tile (per sq. ft.)", price: 2.50 },
  { name: "Carpet (sq. ft.)", price: 3.00 },
  { name: "Vinyl Flooring (sq. ft.)", price: 1.75 },
  { name: "Paint (gallon)", price: 35.00 },
  { name: "Primer (gallon)", price: 25.00 },
  { name: "Siding (vinyl, sq. ft.)", price: 1.20 },
  { name: "Concrete Block (8x8x16)", price: 1.10 },
  { name: "Stucco (sq. ft.)", price: 6.00 },
  { name: "Asphalt (ton)", price: 100.00 },
  { name: "Gravel (ton)", price: 45.00 },
  { name: "Sand (ton)", price: 25.00 },
  { name: "Crushed Stone (ton)", price: 40.00 },
  { name: "Plumbing Fixtures (average)", price: 300.00 },
  { name: "Toilet", price: 150.00 },
  { name: "Bathtub", price: 400.00 },
  { name: "Shower Unit", price: 500.00 },
  { name: "Kitchen Sink", price: 200.00 },
  { name: "Faucet", price: 75.00 },
  { name: "Light Fixture", price: 50.00 },
  { name: "HVAC System", price: 5000.00 },
  { name: "Thermostat", price: 125.00 },
  { name: "Water Heater", price: 700.00 },
  { name: "Electrical Panel", price: 900.00 },
  { name: "Circuit Breaker", price: 20.00 },
  { name: "Outlets (per outlet)", price: 3.00 },
  { name: "Switches (per switch)", price: 5.00 },
  { name: "Light Bulbs (pack of 4)", price: 12.00 },
  { name: "Door Knob", price: 20.00 },
  { name: "Cabinet (base, per unit)", price: 250.00 },
  { name: "Countertop (per sq. ft.)", price: 35.00 },
  { name: "Granite (per sq. ft.)", price: 45.00 },
  { name: "Quartz (per sq. ft.)", price: 50.00 },
  { name: "Marble (per sq. ft.)", price: 60.00 },
  { name: "Fence (wood, per linear ft.)", price: 15.00 },
  { name: "Fence (vinyl, per linear ft.)", price: 25.00 },
  { name: "Gutter (per linear ft.)", price: 7.00 },
  { name: "Decking (wood, per sq. ft.)", price: 5.00 },
  { name: "Decking (composite, per sq. ft.)", price: 8.00 },
  { name: "Nails (per lb.)", price: 2.00 },
  { name: "Screws (per lb.)", price: 3.50 },
  { name: "Bolts (per lb.)", price: 4.50 },
  { name: "Concrete Mix (80 lb. bag)", price: 6.50 },
  { name: "Mortar Mix (80 lb. bag)", price: 8.00 },
  { name: "Sandpaper (pack)", price: 10.00 },
  { name: "Caulk (tube)", price: 5.00 },
  { name: "Adhesive (tube)", price: 7.00 },
  { name: "Sealant (gallon)", price: 20.00 },
  { name: "Insulated Glass (window unit)", price: 120.00 },
  { name: "Ladder (10ft)", price: 150.00 },
  { name: "Wheelbarrow", price: 85.00 },
  { name: "Shovel", price: 30.00 },
  { name: "Hammer", price: 15.00 },
  { name: "Saw (hand saw)", price: 25.00 },
  { name: "Power Drill", price: 80.00 },
  { name: "Nail Gun", price: 200.00 },
  { name: "Sander", price: 100.00 },
  { name: "Air Compressor", price: 300.00 },
  { name: "Lawn Mower", price: 400.00 },
  { name: "Pressure Washer", price: 350.00 },
  { name: "Generator", price: 600.00 }
];

// Define the API route
app.get('/api/materials', (req, res) => {
  res.json(materials);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
