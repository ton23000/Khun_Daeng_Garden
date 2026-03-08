import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Basic Setup', () => {
  it('should run a simple math test', () => {
    expect(1 + 1).toBe(2)
  })
})
