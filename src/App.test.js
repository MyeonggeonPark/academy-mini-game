import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation and home page', () => {
  render(<App />);
  
  // Check if navigation title is rendered
  const navTitle = screen.getByText('교육 도구');
  expect(navTitle).toBeInTheDocument();
  
  // Check if navigation links are rendered
  const mathLink = screen.getByText('계산 문제 생성기');
  const mazeLink = screen.getByText('미로 생성기');
  expect(mathLink).toBeInTheDocument();
  expect(mazeLink).toBeInTheDocument();
});

test('renders home page content', () => {
  render(<App />);
  
  // Check if home page content is rendered
  const homeTitle = screen.getByText('교육 도구 웹사이트');
  expect(homeTitle).toBeInTheDocument();
});
