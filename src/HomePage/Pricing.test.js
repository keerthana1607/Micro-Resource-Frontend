// Pricing.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Updated import
import { BrowserRouter as Router } from 'react-router-dom';
import Pricing from './Pricing'; // Adjust the import path as necessary

describe('Pricing Component', () => {
  beforeEach(() => {
    render(<Router><Pricing /></Router>);
  });

  // Test the main heading text
  test('should display the main heading text "Our IT Solutions"', () => {
    const mainHeading = screen.getByText(/Our IT Solutions/i);
    expect(mainHeading).toBeInTheDocument();
  });

  // Test the introductory paragraph text
  test('should display the introductory paragraph text', () => {
    const introText = screen.getByText(/Explore our range of IT services designed to meet the needs of businesses of all sizes. Whether you're looking for essential support or advanced solutions, we have plans that will help you achieve your goals./i);
    expect(introText).toBeInTheDocument();
  });

  // Test the essential plan description text
  test('should display the essential plan description text', () => {
    const essentialPlanDesc = screen.getByText(/Essential IT support for small businesses to maintain and manage their technology needs effectively./i);
    expect(essentialPlanDesc).toBeInTheDocument();
  });

  // Test each feature of the essential plan
  test('should display the "24/7 Technical Support" feature in the essential plan', () => {
    const feature = screen.getByText(/24\/7 Technical Support/i);
    expect(feature).toBeInTheDocument();
  });

  test('should display the "Basic Network Monitoring" feature in the essential plan', () => {
    const feature = screen.getByText(/Basic Network Monitoring/i);
    expect(feature).toBeInTheDocument();
  });

  test('should display the "Software Updates" feature in the essential plan', () => {
    const feature = screen.getByText(/Software Updates/i);
    expect(feature).toBeInTheDocument();
  });

  test('should display the "Basic Data Backup" feature in the essential plan', () => {
    const feature = screen.getByText(/Basic Data Backup/i);
    expect(feature).toBeInTheDocument();
  });

  test('should display the "Monthly reports" feature in the essential plan', () => {
    const feature = screen.getByText(/Monthly reports/i);
    expect(feature).toBeInTheDocument();
  });

  // Test the comprehensive plan description text
  test('should display the comprehensive plan description text', () => {
    const comprehensivePlanDesc = screen.getByText(/Comprehensive IT solutions with advanced features for businesses looking for robust and proactive technology management./i);
    expect(comprehensivePlanDesc).toBeInTheDocument();
  });

  // Test each feature of the comprehensive plan
  test('should display the "Advanced Network Security" feature in the comprehensive plan', () => {
    const feature = screen.getByText(/Advanced Network Security/i);
    expect(feature).toBeInTheDocument();
  });

  test('should display the "24/7 Monitoring and Alerts" feature in the comprehensive plan', () => {
    const feature = screen.getByText(/24\/7 Monitoring and Alerts/i);
    expect(feature).toBeInTheDocument();
  });

  test('should display the "Cloud Services Integration" feature in the comprehensive plan', () => {
    const feature = screen.getByText(/Cloud Services Integration/i);
    expect(feature).toBeInTheDocument();
  });

  test('should display the "Dedicated IT Specialist" feature in the comprehensive plan', () => {
    const feature = screen.getByText(/Dedicated IT Specialist/i);
    expect(feature).toBeInTheDocument();
  });

  test('should display the "Monthly Performance Reviews" feature in the comprehensive plan', () => {
    const feature = screen.getByText(/Monthly Performance Reviews/i);
    expect(feature).toBeInTheDocument();
  });

  

  test('should display the "Get Started" button for the comprehensive plan', () => {
    const button = screen.getAllByText(/Get Started/i)[1];
    expect(button).toBeInTheDocument();
  });
});
