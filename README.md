# Job Estimator

## Overview

The **Job Estimator** is a web application designed to help users create detailed estimates for construction jobs. Users can input job details, including job name, client information, and material costs, to generate a helpful estimate. The application allows users to manage materials, quantities, and unit prices efficiently, add write-ups, include taxes (current as of Oct. '24)

The application will flesh out more features in the future, however, this represents an MVP.

## Deployed Frontend

You can view the live application at: [Job Estimator Frontend](https://job-estimator-fe-production.up.railway.app/)




## Features

- **User-Friendly Interface**: Easy-to-use form for entering job and client details.
- **Dynamic Material Selection**: Users can select materials from a list, with their corresponding prices fetched from saved activity
- **Estimate Calculation**: The application calculates the subtotal, State Tax (10%), and total estimate based on user input.

## API Development

I originally started this project with the idea that I would use trial keys from 1Build's building material API, however, after speaking with them I learned that they no longer offered trial keys. From there I thought of a placeholder wherein hard-coded materials would be served to a drop-down menu while I thought of a suitable alternative.

The alternative I ended up going with before I delve into web-scraping is to have people log in, save
materials and prices which are unique to their account, and feed these into a template. That is the
app you are seeing right now. People have the choice to save the output into a PDF.

### API Endpoints

- **POST /api/materials**: Creates a new material item with name and price.

- **GET /api/materials**: Retrieves a list of available materials with their prices.

- **PUT /api/materials**: Updates an existing material item with name and price.

- **DELETE /api/materials**: Deletes an existing material item.

- **POST /api/register**: Registers a user.

- **POST /api/login**: Logs a user in.

## Setup Instructions

- Clone this repository

- NPM install into both the frontend and backend folders

- Create a .env in both folders, frontend should have VITE_API_BASE_URL.Backend: DATABASE_URL variable, and SECRET_KEY

- To use tests on backend, set a .env.test in that folder and set a DB_NAME variable and a DB_DIALECT variable. I.e. "postgres"

- To run the backend, use node server.js, to run the frontend use npm start dev

## Technologies Used

- **Frontend**: React, Material UI, Axios, jspdf, html2canvas, Vite
- **Backend**: Express.js
- **Deployment**: Railway (for both frontend and backend)

Thank you,
Ben