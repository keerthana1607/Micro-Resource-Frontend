// Footer.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Updated import
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from './Footer'; // Adjust the import path as necessary
import { FaFacebook, FaGithub, FaInstagram, FaTwitter, FaTwitch } from 'react-icons/fa';

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Router><Footer /></Router>);
  });

  // Test the presence of headings and their texts
  test('should display the "Solutions" heading', () => {
    const heading = screen.getByText(/Solutions/i);
    expect(heading).toBeInTheDocument();
  });

  test('should display the "Support" heading', () => {
    const heading = screen.getByText(/Support/i);
    expect(heading).toBeInTheDocument();
  });

  test('should display the "Company" heading', () => {
    const heading = screen.getByText(/Company/i);
    expect(heading).toBeInTheDocument();
  });

  test('should display the "Legal" heading', () => {
    const heading = screen.getByText(/Legal/i);
    expect(heading).toBeInTheDocument();
  });

  // Test the list items under each heading
  test('should display "Marketing" in Solutions section', () => {
    const item = screen.getByText(/Marketing/i);
    expect(item).toBeInTheDocument();
  });

  test('should display "Pricing" in Support section', () => {
    const item = screen.getByText(/Pricing/i);
    expect(item).toBeInTheDocument();
  });

  test('should display "About" in Company section', () => {
    const item = screen.getByText(/About/i);
    expect(item).toBeInTheDocument();
  });

  test('should display "Claims" in Legal section', () => {
    const item = screen.getByText(/Claims/i);
    expect(item).toBeInTheDocument();
  });

  // Test the newsletter subscription section
  test('should display "Subscribe to our newsletter" text', () => {
    const text = screen.getByText(/Subscribe to our newsletter/i);
    expect(text).toBeInTheDocument();
  });

  test('should display the newsletter description text', () => {
    const text = screen.getByText(/The latest news, articles, and resources, sent to your inbox weekly./i);
    expect(text).toBeInTheDocument();
  });

  // Test the email input and subscribe button
  test('should have an email input field with placeholder "Enter email.."', () => {
    const input = screen.getByPlaceholderText(/Enter email../i);
    expect(input).toBeInTheDocument();
  });

  

  
  // Test the copyright notice
  test('should display the copyright notice', () => {
    const text = screen.getByText(/2022 Workflow, LLC. All rights reserved/i);
    expect(text).toBeInTheDocument();
  });
});
