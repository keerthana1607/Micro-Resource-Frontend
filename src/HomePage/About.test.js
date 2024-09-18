// About.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Updated import
import { BrowserRouter as Router } from 'react-router-dom';
import About from './About'; // Adjust the import path as necessary

describe('About Component', () => {
  beforeEach(() => {
    render(<Router><About /></Router>);
  });

  // Test the main heading text
  test('should display the main heading text "Driving Innovation with Tech Innovators"', () => {
    const mainHeading = screen.getByText(/Driving Innovation with Tech Innovators/i);
    expect(mainHeading).toBeInTheDocument();
  });

  // Test the introductory paragraph text
  test('should display the introductory paragraph text', () => {
    const introText = screen.getByText(/At Tech Innovators, we harness cutting-edge technology to deliver exceptional IT solutions that drive business success. Our expertise spans across software development, cybersecurity, and cloud solutions, ensuring that our clients are always at the forefront of innovation./i);
    expect(introText).toBeInTheDocument();
  });

  // Test each statistic box
  test('should display the "99.9%" statistic for client satisfaction', () => {
    const satisfactionStat = screen.getByText(/99\.9%/i);
    expect(satisfactionStat).toBeInTheDocument();
  });

  test('should display the "Client Satisfaction" label for the satisfaction statistic', () => {
    const satisfactionLabel = screen.getByText(/Client Satisfaction/i);
    expect(satisfactionLabel).toBeInTheDocument();
  });

  test('should display the "24/7" statistic for technical support', () => {
    const supportStat = screen.getByText(/24\/7/i);
    expect(supportStat).toBeInTheDocument();
  });

  test('should display the "Technical Support" label for the support statistic', () => {
    const supportLabel = screen.getByText(/Technical Support/i);
    expect(supportLabel).toBeInTheDocument();
  });

  test('should display the "10K+" statistic for projects delivered', () => {
    const projectsStat = screen.getByText(/10K\+/i);
    expect(projectsStat).toBeInTheDocument();
  });

  test('should display the "Projects Delivered" label for the projects statistic', () => {
    const projectsLabel = screen.getByText(/Projects Delivered/i);
    expect(projectsLabel).toBeInTheDocument();
  });

});
