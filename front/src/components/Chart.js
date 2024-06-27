import React, { useRef, useImperativeHandle } from 'react'
import { Line } from 'react-chartjs-2'
import { calculateAverage } from '../util/helpers'
import { Chart as ChartJS } from 'chart.js/auto'

// A component for displaying blood pressure readings of the selected time period as a line chart.
const Chart = React.forwardRef((props, ref) => {
  const daysArr = props.month.reverse()
  const chartRef = useRef(null)

  // A method for converting a chart to an image in base64 format. This is needed when attaching charts
  // to PDF files.
  const toImage = () => {
    return chartRef.current.toBase64Image()
  }

  useImperativeHandle(ref, () => {
    return { toImage }
  })

  if (!daysArr) return

  // The data for the line chart.
  const data = {
    // Day numbers are shown on the x-axis.
    labels: daysArr.map(date => date[0].split('/')[1]),
    datasets: [
      // The chart shows a line for systolic and diastolic pressures. The data points connecting the lines are created here.
      // Since each point represents a day, calculateAverage method is used in case there are multiple readings saved for the 
      // same date.
      {
        label: 'Systolic',        
        data: daysArr.map((day) => calculateAverage(day[1].readings, 'systolic')),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      },
      {
        label: 'Diastolic',
        data: daysArr.map((day) => calculateAverage(day[1].readings, 'diastolic')),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ]
  }

  const options = { 
    interaction: {
      intersect: false
    },
    responsive: true,
    plugins: {
      legend: false,
      title: {
        display: false,
        align: 'start',
        color: '#FFF',
        font: {
          size: 20
        },        
      },      
    },
    scales: {
      y: {
        ticks: {
          stepSize: 10
        },
        grid: {
          // Lines for guideline values for systolic and diastolic pressure are defined here.
          color: (ctx) => {
            if (ctx.tick?.value === 130) {
              return 'rgba(255, 99, 132, 0.3)'
            }
            if (ctx.tick?.value === 80) {
              return 'rgba(53, 162, 235, 0.3)'
            }
            return 'rgba(100, 100, 100, 0.7)'
          },
          lineWidth: (ctx) => {
            const tickValue = ctx.tick?.value

            if (tickValue === 130 || tickValue === 80) {
              return 5
            }
            return 1
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(100, 100, 100, 0.7)',
          offset: true
        }
      }
    }    
  }
  
  return (
    <>
      <Line
        ref={chartRef}
        className='chart'
        data={data}
        options={options}
      />
    </>
  )     
})

Chart.displayName = 'Chart'

export default Chart