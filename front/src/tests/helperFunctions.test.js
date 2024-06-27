import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { calculateAverage } from '../util/helpers'

// Tests for calculating the averages of blood pressure readings.
describe('averages', () => {
  test('averages of multiple entries per day', () => {
    const entryArray = [
      { systolic: 150, diastolic: 70, pulse: 60 },
      { systolic: 140, diastolic: 60, pulse: 55 }
    ]
  
    const avg = calculateAverage(entryArray)

    expect(avg).toEqual(
      expect.objectContaining({
        systolic: 145,
        diastolic: 65,
        pulse: 58
      })
    )
  })

  test('average of single entry per day', () => {
    const entryArray = [
      { systolic: 127, diastolic: 76, pulse: 59 }
    ]

    const avg = calculateAverage(entryArray)

    expect(avg.systolic).toBe(127)
  })
})