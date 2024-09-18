import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Updated import
import { BrowserRouter as Router } from 'react-router-dom';
import EmployeeTable from './EmployeeList'; // Ensure this is the correct import path

describe('EmployeeTable Component', () => {
  beforeEach(() => {
    // Render the component inside a Router before each test
    render(
      <Router>
        <EmployeeTable />
      </Router>
    );
  });

  test('renders table heading "ID"', () => {
    expect(screen.getByText(/ID/i)).toBeInTheDocument();
  });

  test('renders table heading "Name"', () => {
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
  });

  test('renders table heading "Email"', () => {
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
  });

  test('renders table heading "Skills"', () => {
    expect(screen.getByText(/Skills/i)).toBeInTheDocument();
  });

  test('renders table heading "Experience"', () => {
    expect(screen.getByText(/Experience/i)).toBeInTheDocument();
  });

  test('renders table heading "Status"', () => {
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
  });

  test('renders Add Employee button', () => {
    expect(screen.getByText(/Add Employee/i)).toBeInTheDocument();
  });
});
