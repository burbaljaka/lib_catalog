import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders app with main navigation', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Список книг/i);
  expect(linkElement).toBeInTheDocument();
});
