import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders github link', () => {
  const { getByTestId } = render(<App />);
  const githubLink = getByTestId('github-link');
  expect(githubLink).toBeInTheDocument();
});

test('renders logo image', () => {
  const { getByTestId } = render(<App />);
  const logoImage = getByTestId('logo-img');
  expect(logoImage).toBeInTheDocument();
});

test('renders 2020 list', () => {
  const { getByTestId } = render(<App />);
  const list2020 = getByTestId('2020-list');
  expect(list2020).toBeInTheDocument();
});

test('renders 2017 list', () => {
  const { getByTestId } = render(<App />);
  const list2017 = getByTestId('2017-list');
  expect(list2017).toBeInTheDocument();
});

test('renders 2016 list', () => {
  const { getByTestId } = render(<App />);
  const list2016 = getByTestId('2016-list');
  expect(list2016).toBeInTheDocument();
});

test('renders contact div', () => {
  const { getByTestId } = render(<App />);
  const contactDiv = getByTestId('contact-div');
  expect(contactDiv).toBeInTheDocument();
});

test('renders contact form', () => {
  const { getByTestId } = render(<App />);
  const contactForm = getByTestId('contact-form');
  expect(contactForm).toBeInTheDocument();
});
