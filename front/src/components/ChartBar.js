import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// The charts are formed using this component.
const ChartBar = ({ entries }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  )

  // Labels to x-axis, corresponding with the keys in classified entries received as a prop.
  const labels = [
    ['< 100', '< 50'],
    ['< 110', '< 60'],
    ['< 120', '< 70'],
    ['< 130', '< 80'],
    ['< 140', '< 90'],
    ['< 150', '< 100'],
    ['>= 150', '>= 100']
  ]
  
  // A helper method for forming data for data.datasets below. The value is the key for
  // desired field in classified data object (entries), e.g. 'sys' for systolic readings.
  // Returning the percentage of values belonging into each group.
  const constructData = (value) => {
    const valueArr = Object.values(entries[value])
    return labels.map((_label, index) => valueArr[index] / entries.totalAmount * 100)
  }

  // A data object with values. Used as the data property of Bar component.
  const data = {
    labels: labels,
    datasets: [      
      {
        data: constructData('sys'),
        backgroundColor: 'rgba(196, 6, 6, 0.7)'
      },
      {
        data: constructData('dia'),
        backgroundColor: 'rgba(48, 101, 245, 0.7)'
      }
    ]
  }

  // Options for Bar component.
  const options = {
    plugins: {
      legend: {
        display: false
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        ticks: {
          padding: 0
        }
      },
      y: {
        grid: {
          color: 'rgba(100, 100, 100, 0.7)',
        },
        ticks: {
          autoSkip: false,
          callback: (val, i) => `${val} %`
        }
      }
    }    
  }
  
  return (
    <Bar
      data={data}
      options={options}
      className='chart'
    />    
  )     
}

export default ChartBar