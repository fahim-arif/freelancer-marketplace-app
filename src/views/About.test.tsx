import { render, screen } from '@testing-library/react'
import About from './About'

test('renders about element', () => {
  render(<About />)
  const element = screen.getByText(/About/i)
  expect(element).toBeInTheDocument()
})
