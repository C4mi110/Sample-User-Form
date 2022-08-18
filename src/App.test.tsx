import React from 'react';
import { render, screen, } from '@testing-library/react';
import UserForm from './UserForm';

test('render view', () => {
  render(<UserForm />);
  const linkElement = screen.getByText(/submit/i);
  expect(linkElement).toBeInTheDocument();
});
