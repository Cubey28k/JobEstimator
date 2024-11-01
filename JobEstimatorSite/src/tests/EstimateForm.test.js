import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EstimateForm from '../components/loggedout/EstimateFormLO'; 

describe('EstimateForm', () => {
  const setEstimateMock = jest.fn();

  beforeEach(() => {
    render(<EstimateForm setEstimate={setEstimateMock} />);
  });

  test('renders all required input fields', () => {
    // Check for job information fields
    expect(screen.getByLabelText(/job name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/client name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/proposed start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/projected job end/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/proposal date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estimate number/i)).toBeInTheDocument();
    // Check for materials and costs fields
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/unit price/i)).toBeInTheDocument();
  });

  test('updates job name input', () => {
    const jobNameInput = screen.getByLabelText(/job name/i);
    fireEvent.change(jobNameInput, { target: { value: 'New Job' } });
    expect(jobNameInput.value).toBe('New Job');
  });

  test('shows alert for empty required fields on submit', () => {
    // Spy on alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    const submitButton = screen.getByRole('button', { name: /get estimate/i });
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith('Please fill in all required fields');
  });

  test('adds a new item when Add Item button is clicked', () => {
    const addItemButton = screen.getByRole('button', { name: /add item/i });
    fireEvent.click(addItemButton);

    // Check if new item fields are rendered
    expect(screen.getAllByLabelText(/description/i).length).toBe(2);
    expect(screen.getAllByLabelText(/quantity/i).length).toBe(2);
    expect(screen.getAllByLabelText(/unit price/i).length).toBe(2);
  });

});
