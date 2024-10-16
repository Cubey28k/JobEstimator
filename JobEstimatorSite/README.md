# Job Estimator

## Overview

The **Job Estimator** is a web application designed to help users create detailed estimates for construction jobs. Users can input job details, including job name, client information, and material costs, to generate a comprehensive estimate. The application allows users to manage materials, quantities, and unit prices efficiently.

The application will flesh out more features in the future, however, this represents an MVP.

## Deployed Frontend

You can view the live application at: [Job Estimator Frontend](https://job-estimator-fe-production.up.railway.app/)

## Project Proposal
[Project Proposal Document](https://docs.google.com/document/d/1oalVcS8O2klKDkdVoTo85ykOhTNprQerAPyBPp7Mhds/edit?usp=sharing)

## Initial Project Ideas
[Initial Project Ideas Document](https://docs.google.com/document/d/1cCVuNagdkL6G6g7b5gLWzc4fp4S5or9dERuaWEtJ0So/edit)


## Features

- **User-Friendly Interface**: Easy-to-use form for entering job and client details.
- **Dynamic Material Selection**: Users can select materials from a list, with their corresponding prices fetched from a homemade API.
- **Estimate Calculation**: The application calculates the subtotal, tax (10%), and total estimate based on user input.

## API Development

Since the 1build API could not provide the necessary keys for fetching material prices, I created a homemade API. This API serves hardcoded material data, allowing the frontend to retrieve material names and prices seamlessly. This will be changed to scraping methods down the line.

### API Endpoints

- **GET /api/materials**: Retrieves a list of available materials with their prices.

## Technologies Used

- **Frontend**: React, Material UI, Axios
- **Backend**: Express.js (with homemade data)
- **Deployment**: Railway (for both frontend and backend)
